import { Datasource, Parameter } from "jsxnik/mapnikConfig";

export function PlanetPolygonDatasource() {
  return (
    <Datasource>
      <Parameter name="type">geojson</Parameter>
      <Parameter name="inline">
        {`
              {
                "type": "Polygon",
                "coordinates": [
                  [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]
                ]
              }
          `}
      </Parameter>
    </Datasource>
  );
}
