import {
  Datasource,
  Layer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { colors } from "../colors";

export function Land() {
  return (
    <>
      <Style name="land">
        <Rule>
          <PolygonSymbolizer fill={colors.land} />
        </Rule>
      </Style>

      <Layer name="land" srs="+init=epsg:3857">
        <StyleName>land</StyleName>

        <Datasource>
          <Parameter name="type">shape</Parameter>

          <Parameter name="file">
            simplified-land-polygons-complete-3857/simplified_land_polygons.shp
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
