import {
  Datasource,
  Layer,
  Parameter,
  Style,
  Rule,
  StyleName,
} from "jsxnik/mapnikConfig";
import { colors } from "../colors";
import { RichLineSymbolizer } from "./RichLineSymbolizer";

export function CoastlinedCoutryBorders() {
  return (
    <>
      <Style name="coastlineCountryBorders">
        <Rule>
          <RichLineSymbolizer color={colors.border} width={3} />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857">
        <StyleName>coastlineCountryBorders</StyleName>

        <Datasource>
          <Parameter name="type">sqlite</Parameter>
          <Parameter name="file">countries.sqlite</Parameter>
          <Parameter name="table">
            (SELECT ogc_fid, geometry FROM countries) AS foo
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
