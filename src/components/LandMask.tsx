import {
  Layer,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { colors } from "../colors";
import { LandPolygonsDatasource } from "./LandPolygonsDatasource";
import { mangleSrs, PlanetPolygonDatasource } from "./PlanetPolygonDatasource";

type Props = { srs: string };

export function LandMask({ srs }: Props) {
  return (
    <>
      <Style name="land-mask">
        <Rule>
          <PolygonSymbolizer fill={colors.water} />
        </Rule>
      </Style>

      <Layer srs={"+init=epsg:3857"} compOp="dst-in">
        <StyleName>land-mask</StyleName>

        <LandPolygonsDatasource />
      </Layer>

      <Layer srs={mangleSrs(srs)} compOp="dst-atop">
        <StyleName>land-mask</StyleName>

        <PlanetPolygonDatasource srs={srs} />
      </Layer>
    </>
  );
}
