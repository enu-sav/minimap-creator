import { Layer, Rule, Style, StyleName } from "jsxnik/mapnikConfig";
import { PlanetPolygonDatasource } from "./PlanetPolygonDatasource";
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

      <Layer srs={srs} compOp="src-over" opacity={0.25}>
        <StyleName>mask</StyleName>

        <PlanetPolygonDatasource />

        {children}
      </Layer>
    </>
  );
}
