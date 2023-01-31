import {
  Datasource,
  Layer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { mangleSrs, PlanetPolygonDatasource } from "./PlanetPolygonDatasource";

type Props = { srs: string; children: JSX.Element };

export function Mask({ srs, children }: Props) {
  return (
    <>
      <Style name="mask">
        <Rule>
          <PolygonSymbolizer
            fill="#000"
            simplify={10}
            simplifyAlgorithm="visvalingam-whyatt"
          />
        </Rule>
      </Style>

      <Layer srs={mangleSrs(srs)} compOp="src-over" opacity={0.25}>
        <StyleName>mask</StyleName>

        <PlanetPolygonDatasource srs={srs} />

        {children}
      </Layer>
    </>
  );
}
