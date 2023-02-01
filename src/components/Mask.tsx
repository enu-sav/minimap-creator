import { Layer, Rule, Style, StyleName } from "jsxnik/mapnikConfig";
import { mangleSrs, PlanetPolygonDatasource } from "./PlanetPolygonDatasource";
import { RichPolygonSymbolizer } from "./RichPolygonSymbolizer";

type Props = { srs: string; simplify: number; children: JSX.Element };

export function Mask({ srs, children, simplify }: Props) {
  return (
    <>
      <Style name="mask">
        <Rule>
          <RichPolygonSymbolizer color="#000" simplify={simplify} />
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
