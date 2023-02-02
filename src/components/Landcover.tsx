import {
  Datasource,
  Filter,
  Layer,
  Parameter,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { RichPolygonSymbolizer } from "./RichPolygonSymbolizer";

export type LandcoverTypes = "forest" | "water-body" | "urban";

type Props = {
  types: LandcoverTypes[];
  colors: Record<"forest" | "water" | "urban", string>;
};

export function Landcover({ types, colors }: Props) {
  return (
    <>
      <Layer srs="+init=epsg:3857">
        <StyleName>landcover</StyleName>

        <Datasource base="db">
          {/* TODO add WHERE condition */}
          <Parameter name="table">landcover</Parameter>
        </Datasource>
      </Layer>

      <Style name="landcover">
        {types.includes("forest") && (
          <Rule>
            <Filter>[type] = 'forest'</Filter>
            <RichPolygonSymbolizer color={colors.forest} />
          </Rule>
        )}

        {types.includes("water-body") && (
          <Rule>
            <Filter>[type] = 'water'</Filter>
            <RichPolygonSymbolizer color={colors.water} />
          </Rule>
        )}

        {types.includes("urban") && (
          <Rule>
            <Filter>[type] = 'urban'</Filter>
            <RichPolygonSymbolizer color={colors.urban} />
          </Rule>
        )}
      </Style>
    </>
  );
}
