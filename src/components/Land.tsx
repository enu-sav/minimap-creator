import { Layer, Rule, Style, StyleName } from "jsxnik/mapnikConfig";
import { LandPolygonsDatasource } from "./LandPolygonsDatasource";
import { RichPolygonSymbolizer } from "./RichPolygonSymbolizer";

type Props = { color: string; simplify: number };

export function Land({ color, simplify }: Props) {
  return (
    <>
      <Style name="land">
        <Rule>
          <RichPolygonSymbolizer color={color} simplify={simplify} />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857">
        <StyleName>land</StyleName>

        <LandPolygonsDatasource />
      </Layer>
    </>
  );
}
