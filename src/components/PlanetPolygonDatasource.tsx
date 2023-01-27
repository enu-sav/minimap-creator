import { Datasource, Parameter } from "jsxnik/mapnikConfig";

type Props = { srs: string };

export function PlanetPolygonDatasource({ srs }: Props) {
  const [minX, minY, maxX, maxY] =
    srs === "+init=epsg:3035"
      ? [
          // 1896628.62, 1095703.18, 7104179.2, 6882401.15, // epsg:3035
          0, 0, 100_000_000, 100_000_000,
        ]
      : srs === "+init=epsg:3857"
      ? [-20037508.34, -20048966.1, 20037508.34, 20048966.1]
      : srs === "+init=epsg:4326"
      ? [-180, -90, 180, 90]
      : die(srs);

  return (
    <Datasource>
      <Parameter name="type">geojson</Parameter>
      <Parameter name="inline">
        {`
              {
                "type": "Polygon",
                "coordinates": [
                  [[${minX}, ${minY}], [${minX}, ${maxY}], [${maxX}, ${maxY}], [${maxX}, ${minY}], [${minX}, ${minY}]]
                ]
              }
          `}
      </Parameter>
    </Datasource>
  );
}

export function mangleSrs(srs: string) {
  return ["+init=epsg:3035", "+init=epsg:3857"].includes(srs)
    ? srs
    : "+init=epsg:4326";
}

function die(srs: string): never {
  throw new Error("unsupported SRS " + srs);
}
