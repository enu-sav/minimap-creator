import { Datasource, Parameter } from "jsxnik/mapnikConfig";

export function PlanetPolygonDatasource() {
  const [minX, minY, maxX, maxY] = [
    -100_000_000, -100_000_000, 100_000_000, 100_000_000,
  ];

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
