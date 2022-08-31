import {
  Datasource,
  Filter,
  Layer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

export function Landcover() {
  return (
    <>
      <Layer name="landuse" srs="+init=epsg:3857">
        <StyleName>landuse</StyleName>

        <Datasource base="db">
          <Parameter name="table">osm_landcover_gen_z7_</Parameter>
        </Datasource>
      </Layer>

      <Style name="landuse">
        <Rule>
          <Filter>[type] = 'forest'</Filter>
          <PolygonSymbolizer fill="#bea" />
        </Rule>

        <Rule>
          <Filter>[type] = 'water'</Filter>
          <PolygonSymbolizer fill="#aaf" />
        </Rule>

        <Rule>
          <Filter>[type] = 'human'</Filter>
          <PolygonSymbolizer fill="#ccc" />
        </Rule>
      </Style>
    </>
  );
}
