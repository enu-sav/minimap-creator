import { getDistance } from "geolib";
import temp from "temp";
import process from "process";
import http, { IncomingMessage, ServerResponse } from "http";
import util from "util";
import fs from "fs";
import fsp from "fs/promises";
import mapnik from "mapnik";
import { URLSearchParams } from "url";
import stream from "stream";
import { RichMap } from "./components//RichMap";
import { countryData } from "./countryData";
import { serialize } from "jsxnik/serialize";
import { LandcoverTypes } from "./components/Landcover";

class InvalidParamError extends Error {}

const pipelineAsync = util.promisify(stream.pipeline);

temp.track();

mapnik.register_default_input_plugins();

mapnik.registerFonts("fonts", { recurse: true });

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

const server = http.createServer(requestListener);

const port = Number(process.env.PORT || 8080);

server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

function requestListener(req: IncomingMessage, res: ServerResponse) {
  generate(req, res).catch((err) => {
    if (err instanceof InvalidParamError) {
      res.writeHead(400).end(err.message);
    } else {
      console.error(err);

      res.writeHead(500);

      res.end(err.toString());
    }
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

  const scale = toNumber(params.get("scale")) ?? 1;

  const margin = toNumber(params.get("margin")) ?? 5;

  const features = params.get("features")?.split(",") ?? [];

  const placeTypes = params.get("place-types")?.split(",") ?? [];

  const places = params.get("places")?.split(",") ?? [];

  const placeLabelPlacements =
    params.get("place-label-placements") ?? undefined;

  const landcoverTypes = params.get("landcover-types")?.split(",") ?? [];

  const country = params.get("country") ?? undefined;

  const highlightAdminArea = params.get("highlight-admin-area") ?? undefined;

  const borderWidthFactor = toNumber(params.get("border-width-factor"));

  const coastlineWidthFactor =
    toNumber(params.get("coastline-width-factor")) ?? borderWidthFactor;

  const waterwayWidthFactor = toNumber(params.get("waterway-width-factor"));

  const placeSizeFactor = toNumber(params.get("place-size-factor"));

  const hillshadingOpacity = toNumber(params.get("hillshading-opacity"));

  const simplify = toNumber(params.get("simplify")) || 2;

  const colors: Record<ColorKey, string> = Object.assign(
    {
      water: "#c9e7f2",
      urban: "#ccc",
      forest: "#bea",
      pin: "#d00",
      border: "#b02482",
      coastline: "#0082c1",
      areaHighlight: "#fecc0080",
      land: "#e6edd5",
    } as const,
    Object.fromEntries(
      (params.get("colors") ?? "")
        .split(",")
        .filter((x) => x)
        .map((item) => item.split(":", 2))
    )
  );

  const watershedName = params.get("watershed-name") ?? undefined;

  const bboxParam = params.get("bbox");

  const srs = params.get("srs") ?? "+init=epsg:3857"; // "+init=epsg:3035"

  let bbox: number[];

  if (bboxParam) {
    bbox = bboxParam.split(",").map((c) => Number(c));
  } else if (country) {
    const data = countryData[country];

    if (!data) {
      throw new InvalidParamError("no such country");
    }

    const { sw, ne } = data.boundingBox;

    bbox = [sw.lon, sw.lat, ne.lon, ne.lat];
  } else {
    throw new InvalidParamError("one of `bbox` or `country` must be provided");
  }

  const mBbox = new mapnik.Projection(srs).forward(bbox);

  const aspectRatio = (mBbox[2] - mBbox[0]) / (mBbox[3] - mBbox[1]);

  const width =
    toNumber(params.get("width")) ??
    (toNumber(params.get("height")) ?? 600) * aspectRatio;

  const height = toNumber(params.get("height")) ?? width / aspectRatio;

  const map = new mapnik.Map(width, height, srs);

  const pin = lat == undefined || lon == undefined ? undefined : { lat, lon };

  const [majorBorders, minorBorders, microBorders] = [
    params.get("major-borders"),
    params.get("minor-borders"),
    params.get("micro-borders"),
  ].map((b) =>
    b
      ?.toUpperCase()
      .split(",")
      .map((item) => item.split(":"))
  );

  const sourceSimplifyFactor =
    getDistance([bbox[0], bbox[1]], [bbox[2], bbox[3]]) /
    Math.hypot(width, height);

  const style = serialize(
    <RichMap
      srs={srs}
      pin={pin}
      features={features}
      country={country?.toUpperCase()}
      highlightAdminArea={highlightAdminArea}
      majorBorders={majorBorders && Object.fromEntries(majorBorders)}
      minorBorders={minorBorders && Object.fromEntries(minorBorders)}
      microBorders={microBorders && Object.fromEntries(microBorders)}
      landcoverTypes={landcoverTypes as LandcoverTypes[]}
      placeTypes={placeTypes}
      places={places}
      placeLabelPlacements={placeLabelPlacements}
      borderWidthFactor={borderWidthFactor}
      coastlineWidthFactor={coastlineWidthFactor}
      waterwayWidthFactor={waterwayWidthFactor}
      placeSizeFactor={placeSizeFactor}
      hillshadingOpacity={hillshadingOpacity}
      watershedName={watershedName}
      bbox={bbox}
      pxLon={width / (bbox[2] - bbox[0])}
      colors={colors}
      simplify={simplify}
      sourceSimplifyFactor={sourceSimplifyFactor}
    />
  );

  await map.fromStringAsync(style);

  const mx = ((mBbox[2] - mBbox[0]) / width) * margin;
  const my = ((mBbox[3] - mBbox[1]) / height) * margin;

  map.zoomToBox([mBbox[0] - mx, mBbox[1] - my, mBbox[2] + mx, mBbox[3] + my]);

  if (format === "pdf" || format === "svg") {
    const tempName = temp.path({ suffix: "." + format });

    await map.renderFileAsync(tempName, {
      format,
      scale,
      variables: {},
    });

    res.writeHead(200, {
      "Content-Type": format === "pdf" ? "application/pdf" : "image/svg+xml",
    });

    await pipelineAsync(fs.createReadStream(tempName), res);

    await fsp.unlink(tempName);
  } else if (format === "jpeg" || format === "png") {
    const image = new mapnik.Image(width, height);

    await map.renderAsync(image, {
      scale,
      variables: {},
    });

    const buffer = await image.encodeAsync(format);

    res.writeHead(200, {
      "Content-Type": "image/" + format,
    });

    res.end(buffer);
  } else {
    res.writeHead(400).end("invalid format");
  }
}
