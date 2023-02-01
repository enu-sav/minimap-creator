import { Datasource, Parameter } from "jsxnik/mapnikConfig";

export function LandPolygonsDatasource() {
  return (
    <Datasource base="db">
      <Parameter name="table">simplified_land_polygons</Parameter>
    </Datasource>
  );
}
