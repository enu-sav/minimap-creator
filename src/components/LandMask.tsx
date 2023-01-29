import {
  Layer,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { LandPolygonsDatasource } from "./LandPolygonsDatasource";
import { mangleSrs, PlanetPolygonDatasource } from "./PlanetPolygonDatasource";

type Props = { srs: string; waterColor: string };

export function LandMask({ srs, waterColor }: Props) {
  return (
    <>
      <Style name="land-mask">
        <Rule>
          <PolygonSymbolizer fill={waterColor} />
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
