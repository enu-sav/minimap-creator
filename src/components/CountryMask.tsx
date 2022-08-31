import {
  Datasource,
  Layer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

type Props = { country: string };

export function CountryMask({ country }: Props) {
  return (
    <>
      <Style name="countryMask">
        <Rule>
          <PolygonSymbolizer fill="#000" />
        </Rule>
      </Style>

      <Layer
        name="countryMask"
        srs="+init=epsg:4326"
        compOp="src-over"
        opacity={0.25}
      >
        <StyleName>countryMask</StyleName>

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

        <Layer name="countryMask1" srs="+init=epsg:3857" compOp="dst-out">
          <StyleName>countryMask</StyleName>

          <Datasource base="db">
            <Parameter name="table">
              (SELECT ogc_fid, wkb_geometry FROM admin WHERE admin_level = 2 AND
              country_code = '{country}') AS foo
            </Parameter>
          </Datasource>
        </Layer>
      </Layer>
    </>
  );
}
