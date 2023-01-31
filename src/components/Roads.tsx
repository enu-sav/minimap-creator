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

type Props = { simplify: number };

export function Roads({ simplify }: Props) {
  return (
    <>
      <Style name="roads">
        <Rule>
          <Filter>[type] = 'trunk' || [type] = 'primary'</Filter>

          <RichLineSymbolizer color="#f58d42" width={1.5} simplify={simplify} />
        </Rule>

        <Rule>
          <Filter>[type] = 'motorway'</Filter>

          <RichLineSymbolizer color="#f58d42" width={3} simplify={simplify} />
          <RichLineSymbolizer color="#f5f242" width={1} simplify={simplify} />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857">
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
