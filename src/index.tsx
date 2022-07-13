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
import { RichMap } from "./RichMap";

const pipelineAsync = util.promisify(stream.pipeline);

temp.track();

mapnik.register_default_input_plugins();

mapnik.registerFonts("fonts", { recurse: true });

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
  if (value == undefined) {
    return undefined;
  }

  const n = Number(value);

  return isNaN(n) ? undefined : n;
}

async function generate(req: IncomingMessage, res: ServerResponse) {
  const params = new URLSearchParams(req.url?.replace(/^[^?]*/, ""));

  const format = params.get("format") ?? "png";

  const lat = toNumber(params.get("lat"));

  const lon = toNumber(params.get("lon"));

  const width = toNumber(params.get("width")) ?? 800;

  const height = toNumber(params.get("height")) ?? 400;

  const scale = toNumber(params.get("scale")) ?? 1;

  const featureSet = new Set(params.get("features")?.split(",") ?? []);

  const districtId = toNumber(params.get("districtId"));

  const regionId = toNumber(params.get("regionId"));

  const placeId = toNumber(params.get("placeId"));

  const map = new mapnik.Map(width, height, "+init=epsg:3857");

  const pin = lat == undefined || lon == undefined ? undefined : { lat, lon };

  const style = render(
    <RichMap
      pin={pin}
      featureSet={featureSet}
      regionId={regionId}
      districtId={districtId}
      placeId={placeId}
    />
  );

  // console.log("Style:", style);

  await map.fromStringAsync(style);

  map.zoomToBox(merc.forward(bbox));

  if (format === "pdf" || format === "svg") {
    const tempName = temp.path({ suffix: "." + format });

    await map.renderFileAsync(tempName, {
      format,
      scale,
    });

    res.writeHead(200, {
      "Content-Type": format === "pdf" ? "application/pdf" : "image/svg+xml",
    });

    await pipelineAsync(fs.createReadStream(tempName), res);

    await fsp.unlink(tempName);
  } else if (format === "jpeg" || format === "png") {
    const image = new mapnik.Image(width, height);

    await map.renderAsync(image, { scale });

    const buffer = await image.encodeAsync(format);

    res.writeHead(200, {
      "Content-Type": "image/" + format,
    });

    res.end(buffer);
  } else {
    res.writeHead(400).end("invalid format");
  }
}
