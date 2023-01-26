import {
  Datasource,
  Layer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { colors } from "../colors";

export function LandMask() {
  return (
    <>
      <Style name="land-mask">
        <Rule>
          <PolygonSymbolizer fill={colors.water} />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857" compOp="dst-in">
        <StyleName>land-mask</StyleName>

        <Datasource>
          <Parameter name="type">shape</Parameter>

          <Parameter name="file">
            simplified-land-polygons-complete-3857/simplified_land_polygons.shp
          </Parameter>
        </Datasource>
      </Layer>

      <Layer srs="+init=epsg:4326" compOp="dst-atop">
        <StyleName>land-mask</StyleName>

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
      </Layer>
    </>
  );
}
