import {
  Layer,
  Style,
  Rule,
  StyleName,
  LineSymbolizer,
} from "jsxnik/mapnikConfig";
import { colors } from "../colors";
import { LandPolygonsDatasource } from "./LandPolygonsDatasource";

type Props = { widthFactor?: number };

export function CoastlinedCoutryBorders({ widthFactor = 1 }: Props) {
  return (
    <>
      {/* <Style name="coastlineCountryBorders">
        <Rule>
          <RichLineSymbolizer color={colors.border} width={3 * widthFactor} />
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
      </Layer> */}

      <Style name="coastline-border">
        <Rule>
          <LineSymbolizer
            stroke={colors.coastline}
            strokeWidth={widthFactor * 3}
            strokeLinejoin="round"
          />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857">
        <StyleName>coastline-border</StyleName>

        <LandPolygonsDatasource />
      </Layer>
    </>
  );
}
