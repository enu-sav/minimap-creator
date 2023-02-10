import { Layer, Rule, Style, StyleName } from "jsxnik/mapnikConfig";
import { LandPolygonsDatasource } from "./LandPolygonsDatasource";
import { PlanetPolygonDatasource } from "./PlanetPolygonDatasource";
import { RichPolygonSymbolizer } from "./RichPolygonSymbolizer";

type Props = { srs: string; waterColor: string };

export function LandMask({ srs, waterColor }: Props) {
  return (
    <>
      <Style name="land-mask">
        <Rule>
          <RichPolygonSymbolizer color={waterColor} />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857" compOp="dst-in">
        <StyleName>land-mask</StyleName>

        <LandPolygonsDatasource />
      </Layer>

      <Layer srs={srs} compOp="dst-atop">
        <StyleName>land-mask</StyleName>

        <PlanetPolygonDatasource />
      </Layer>
    </>
  );
}
