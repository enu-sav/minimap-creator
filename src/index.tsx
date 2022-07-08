import temp from "temp";
import process from "process";
import http, { IncomingMessage, ServerResponse } from "http";
import util from "util";
import fs from "fs";
import fsp from "fs/promises";
import mapnik from "mapnik";
import * as turf from "@turf/turf";
import { URLSearchParams } from "url";
import stream from "stream";
import { render } from "jsx-xml";
import { DistrictMap } from "./DistrictMap";

const pipelineAsync = util.promisify(stream.pipeline);

temp.track();

mapnik.register_default_input_plugins();

const merc = new mapnik.Projection("+init=epsg:3857");

for (const [cla, methods] of [
  [mapnik.Map, ["render", "fromString", "load", "renderFile"]] as const,
  [mapnik.Image, ["save", "encode"]] as const,
]) {
  for (const method of methods) {
    (cla as any).prototype[method + "Async"] = util.promisify(
      (cla as any).prototype[method]
    );
  }
}

const bbox = turf.bbox(
  turf.buffer(
    JSON.parse(
      fs.readFileSync("geodata/kraj_3.geojson", { encoding: "utf-8" })
    ),
    5
  )
);

const server = http.createServer(requestListener);

const port = Number(process.env.PORT || 8080);

server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

function requestListener(req: IncomingMessage, res: ServerResponse) {
  generate(req, res).catch((err) => {
    console.error(err);

    res.writeHead(500);

    res.end(err.toString());
  });
}

function toNumber(value: unknown): number | undefined {
  const n = Number(value);

  return isNaN(n) ? undefined : n;
}

async function generate(req: IncomingMessage, res: ServerResponse) {
  const params = new URLSearchParams(req.url?.replace(/^[^?]*/, ""));

  const format = params.get("format") ?? "png";

  const lat = toNumber(params.get("lat"));

  const lon = toNumber(params.get("lon"));

  const featureSet = new Set(params.get("features")?.split(",") ?? []);

  const okresId = toNumber(params.get("okresId"));

  const krajId = toNumber(params.get("krajId"));

  const map = new mapnik.Map(800, 400, "+init=epsg:3857");

  await map.fromStringAsync(
    render(
      <DistrictMap
        krajId={krajId}
        okresId={okresId}
        featureSet={featureSet}
        point={lat == undefined || lon == undefined ? undefined : { lat, lon }}
      />
    )
  );

  map.zoomToBox(merc.forward(bbox));

  if (format === "pdf" || format === "svg") {
    const tempName = temp.path({ suffix: "." + format });

    await map.renderFileAsync(tempName, {
      format,
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
