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
import { RichLineSymbolizer } from "./RichLineSymbolizer";

export function Borders() {
  return (
    <>
      <Style name="borders">
        <Rule>
          <Filter>[admin_level] = 2</Filter>

          <RichLineSymbolizer color={colors.border} width={3} />
        </Rule>

        <Rule>
          <Filter>[admin_level] = 4</Filter>

          <RichLineSymbolizer color={colors.border} width={1.5} />
        </Rule>

        <Rule>
          <Filter>[name] = "Prešovský kraj"</Filter>
          <PolygonSymbolizer fill={colors.areaHighlight} />
        </Rule>
      </Style>

      <Layer name="borders" srs="+init=epsg:3857">
        <StyleName>borders</StyleName>

        <Datasource base="db">
          <Parameter name="table">
            (SELECT ogc_fid, admin_level, name, geometry FROM admin_areas WHERE
            admin_level &lt; 8) AS foo
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
