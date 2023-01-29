import { Datasource, Parameter } from "jsxnik/mapnikConfig";

export function LandPolygonsDatasource() {
  return (
    <Datasource>
      <Parameter name="type">shape</Parameter>

      <Parameter name="file">
        data/simplified-land-polygons-complete-3857/simplified_land_polygons.shp
      </Parameter>
    </Datasource>
  );
}
