import {
  Datasource,
  Layer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

type Props = { color: string };

export function Land({ color }: Props) {
  return (
    <>
      <Style name="land">
        <Rule>
          <PolygonSymbolizer fill={color} />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857">
        <StyleName>land</StyleName>

        <Datasource>
          <Parameter name="type">shape</Parameter>

          <Parameter name="file">
            data/simplified-land-polygons-complete-3857/simplified_land_polygons.shp
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
