import {
  Layer,
  Style,
  Rule,
  StyleName,
  Datasource,
  Parameter,
} from "jsxnik/mapnikConfig";
import { LandPolygonsDatasource } from "./LandPolygonsDatasource";
import { RichLineSymbolizer } from "./RichLineSymbolizer";

type Props = { widthFactor?: number; color: string };

export function Coastline({ widthFactor = 1, color }: Props) {
  return (
    <>
      <Style name="coastline-border">
        <Rule>
          <RichLineSymbolizer color={color} width={widthFactor * 3} />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857">
        <StyleName>coastline-border</StyleName>

        <LandPolygonsDatasource />
      </Layer>
    </>
  );
}
