import {
  Datasource,
  Layer,
  LineSymbolizer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { colors } from "../colors";
import { LandPolygonsDatasource } from "./LandPolygonsDatasource";
import { PlanetPolygonDatasource } from "./PlanetPolygonDatasource";

export function LandMask() {
  return (
    <>
      <Style name="land-mask">
        <Rule>
          <PolygonSymbolizer fill={colors.water} />
          <LineSymbolizer stroke={"red"} />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857" compOp="dst-in">
        <StyleName>land-mask</StyleName>

        <LandPolygonsDatasource />
      </Layer>

      <Layer srs="+init=epsg:4326" compOp="dst-atop">
        <StyleName>land-mask</StyleName>

        <PlanetPolygonDatasource />
      </Layer>
    </>
  );
}
