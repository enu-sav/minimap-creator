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
      <Layer name="landcover" srs="+init=epsg:3857">
        <StyleName>landcover</StyleName>

        <Datasource base="db">
          <Parameter name="table">landcover</Parameter>
        </Datasource>
      </Layer>

      <Style name="landcover">
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
