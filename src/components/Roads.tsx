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

export function Roads() {
  return (
    <>
      <Style name="roads">
        <Rule>
          <Filter>[type] = 'trunk' || [type] = 'primary'</Filter>

          <RichLineSymbolizer color="#f58d42" width={1.5} />
        </Rule>

        <Rule>
          <Filter>[type] = 'motorway'</Filter>

          <RichLineSymbolizer color="#f58d42" width={3} />
          <RichLineSymbolizer color="#f5f242" width={1} />
        </Rule>
      </Style>

      <Layer name="roads" srs="+init=epsg:3857">
        <StyleName>roads</StyleName>

        <Datasource base="db">
          <Parameter name="table">
            (SELECT ogc_fid, geometry, type FROM roads ORDER BY type DESC) foo
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
