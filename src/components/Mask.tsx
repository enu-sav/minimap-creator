import {
  Datasource,
  Layer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

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

        <Datasource>
          <Parameter name="type">geojson</Parameter>
          <Parameter name="inline">
            {`
              {
                "type": "Polygon",
                "coordinates": [
                  [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]
                ]
              }
          `}
          </Parameter>
        </Datasource>

        {children}
      </Layer>
    </>
  );
}
