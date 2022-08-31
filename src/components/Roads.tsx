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
          <Filter>[type] = 'motorway'</Filter>

          <RichLineSymbolizer color="#734a08" width={1.5} />
        </Rule>

        <Rule>
          <Filter>[type] = 'trunk' || [type] = 'primary'</Filter>

          <RichLineSymbolizer color="#734a08" width={1} />
        </Rule>
      </Style>

      <Layer name="roads" srs="+init=epsg:3857">
        <StyleName>roads</StyleName>

        <Datasource base="db">
          <Parameter name="table">osm_roads_gen0</Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
