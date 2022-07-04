const temp = require("temp");
const process = require("process");
const http = require("http");
const util = require("util");
const fs = require("fs");
const fsp = require("fs/promises");
const mapnik = require("mapnik");
const turf = require("@turf/turf");
const { URLSearchParams } = require("url");
const stream = require("stream");

const pipelineAsync = util.promisify(stream.pipeline);

temp.track();

mapnik.register_default_input_plugins();

const merc = new mapnik.Projection("+init=epsg:3857");

for (const [cla, methods] of [
  [mapnik.Map, ["render", "fromString", "load", "renderFile"]],
  [mapnik.Image, ["save", "encode"]],
]) {
  for (const method of methods) {
    cla.prototype[method + "Async"] = util.promisify(cla.prototype[method]);
  }
}

const bbox = turf.bbox(
  turf.buffer(JSON.parse(fs.readFileSync("geodata/kraj_3.geojson")), 5)
);

function createGeojsonLayer(name, file, style) {
  return `
    <Layer name="${name}" srs="+init=epsg:4326">
      <StyleName>${style ?? name}</StyleName>

      <Datasource>
        <Parameter name="type">geojson</Parameter>

        <Parameter name="file">${file}</Parameter>
      </Datasource>
    </Layer>
  `;
}

const server = http.createServer(requestListener);

const port = Number(process.env.PORT || 8080);

server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function requestListener(req, res) {
  generate(req, res).catch((err) => {
    console.error(err);

    res.writeHead(500);

    res.end(err.toString());
  });
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function generate(req, res) {
  const params = new URLSearchParams(req.url.replace(/^[^?]*/, ""));

  const format = params.get("format") ?? "png";

  const lat = Number(params.get("lat"));

  const lon = Number(params.get("lon"));

  const featureSet = new Set(params.get("features")?.split(",") ?? []);

  const okresId = Number(params.get("okresId"));

  const krajId = Number(params.get("krajId"));

  const map = new mapnik.Map(800, 400, "+init=epsg:3857");

  await map.fromStringAsync(`
    <Map>
      <Style name="bgFill">
        <Rule>
          <PolygonSymbolizer fill="#ccc" />
        </Rule>
      </Style>

      <Style name="krajFill">
        <Rule>
          <Filter>[IDN2] = ${krajId}</Filter>
          <PolygonSymbolizer fill="#c00" />
        </Rule>
      </Style>

      <Style name="kraj">
        <Rule>
          <LineSymbolizer stroke="#734a08" stroke-width="2" stroke-linejoin="round" />
        </Rule>
      </Style>

      <Style name="okresFill">
        <Rule>
          <Filter>[IDN3] = ${okresId}</Filter>
          <PolygonSymbolizer fill="#c00" />
        </Rule>
      </Style>

      <Style name="okres">
        <Rule>
          <LineSymbolizer stroke="#734a08" stroke-width="1" stroke-linejoin="round" />
        </Rule>
      </Style>

      <Style name="point">
        <Rule>
          <MarkersSymbolizer
            allow-overlap="true"
            ignore-placement="true"
            stroke-width="0"
            fill="blue"
            width="12"
            height="12"
          />
        </Rule>
      </Style>

      ${createGeojsonLayer("bgFill", "geodata/sr_3.geojson")}

      ${
        isNaN(okresId)
          ? ""
          : createGeojsonLayer("okres", "geodata/okres_3.geojson", "okresFill")
      }

      ${
        isNaN(krajId)
          ? ""
          : createGeojsonLayer("kraj", "geodata/kraj_3.geojson", "krajFill")
      }

      ${
        featureSet.has("okresy")
          ? createGeojsonLayer("okres", "geodata/okres_3.geojson")
          : ""
      }

      ${
        featureSet.has("kraje")
          ? createGeojsonLayer("kraj", "geodata/kraj_3.geojson")
          : ""
      }

      ${
        isNaN(lon) || isNaN(lat)
          ? ""
          : `
        <Layer name="point" srs="+init=epsg:4326">
          <StyleName>point</StyleName>

          <Datasource>
            <Parameter name="type">geojson</Parameter>

            <Parameter name="inline"><![CDATA[
              ${JSON.stringify(turf.point([lon, lat]))}
            ]]></Parameter>
          </Datasource>
        </Layer>
      `
      }
    </Map>
  `);

  map.zoomToBox(merc.forward(bbox));

  if (format === "pdf" || format === "svg") {
    const tempName = temp.path({ suffix: "." + format });

    const scale_denominator =
      559082264.028 / Math.pow(2, Math.round(10 + Math.log2(1)));


    await map.renderFileAsync(tempName, {
      format,
      buffer_size: 256,
      scale_denominator,
      scale: 1,
    });

    res.writeHead(200, {
      "Content-Type": format === "pdf" ? "application/pdf" : "image/svg+xml",
    });

    await pipelineAsync(fs.createReadStream(tempName), res);

    await fsp.unlink(tempName);
  } else if (format === "jpeg" || format === "png") {
    const image = new mapnik.Image(800, 400);

    await map.renderAsync(image, {});

    const buffer = await image.encodeAsync(format);

    res.writeHead(200, {
      "Content-Type": "image/" + format,
    });

    res.end(buffer);
  } else {
    res.writeHead(400).end("invalid format");
  }
}
