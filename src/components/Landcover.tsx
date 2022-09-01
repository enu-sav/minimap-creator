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
import { colors } from "../colors";

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
          <PolygonSymbolizer fill={colors.forest} />
        </Rule>

        <Rule>
          <Filter>[type] = 'water'</Filter>
          <PolygonSymbolizer fill={colors.water} />
        </Rule>

        <Rule>
          <Filter>[type] = 'human'</Filter>
          <PolygonSymbolizer fill={colors.human} />
        </Rule>
      </Style>
    </>
  );
}
