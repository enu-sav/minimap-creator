import {
  Datasource,
  Layer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { PlanetPolygonDatasource } from "./PlanetPolygonDatasource";

type Props = { children: JSX.Element };

export function Mask({ children }: Props) {
  return (
    <>
      <Style name="mask">
        <Rule>
          <PolygonSymbolizer fill="#000" />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:4326" compOp="src-over" opacity={0.25}>
        <StyleName>mask</StyleName>

        <PlanetPolygonDatasource />

        {children}
      </Layer>
    </>
  );
}
