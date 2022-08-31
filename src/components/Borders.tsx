import {
  Datasource,
  Filter,
  Layer,
  Parameter,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { RichLineSymbolizer } from "./RichLineSymbolizer";

export function Borders() {
  return (
    <>
      <Style name="borders">
        <Rule>
          <Filter>[admin_level] = 2</Filter>

          <RichLineSymbolizer color="#808" width={3} />
        </Rule>

        <Rule>
          <Filter>[admin_level] = 4</Filter>

          <RichLineSymbolizer color="#808" width={1} />
        </Rule>

        {/* <Rule>
          <Filter>[admin_level] = 8</Filter>

          <RichLineSymbolizer color="#808" width={1} />
        </Rule> */}
      </Style>

      <Layer name="borders" srs="+init=epsg:3857">
        <StyleName>borders</StyleName>

        <Datasource base="db">
          <Parameter name="table">
            (select ogc_fid, admin_level, wkb_geometry from admin where
            admin_level in (2, 4)) AS foo
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
