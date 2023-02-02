import { Datasource, Parameter } from "jsxnik/mapnikConfig";

export function LandPolygonsDatasource() {
  return (
    <Datasource base="db">
      <Parameter name="geometry_field">wkb_geometry</Parameter>
      <Parameter name="table">simplified_land_polygons</Parameter>
    </Datasource>
  );
}
