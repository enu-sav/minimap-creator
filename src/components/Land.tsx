import {
  Datasource,
  Layer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { LandPolygonsDatasource } from "./LandPolygonsDatasource";

type Props = { color: string; simplify: number };

export function Land({ color, simplify }: Props) {
  return (
    <>
      <Style name="land">
        <Rule>
          <PolygonSymbolizer
            fill={color}
            simplify={simplify}
            simplifyAlgorithm="visvalingam-whyatt"
          />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857">
        <StyleName>land</StyleName>

        <LandPolygonsDatasource />
      </Layer>
    </>
  );
}
