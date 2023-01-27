import { Datasource, Layer, Parameter, StyleName } from "jsxnik/mapnikConfig";

type Props = { country: string; coastlineBorders?: boolean };

export function CountryMask({ country, coastlineBorders }: Props) {
  return (
    <Layer srs="+init=epsg:3857" compOp="dst-out">
      <StyleName>mask</StyleName>

      {coastlineBorders ? (
        <Datasource>
          <Parameter name="type">sqlite</Parameter>
          <Parameter name="file">countries.sqlite</Parameter>
          <Parameter name="table">
            {`(SELECT ogc_fid, geometry FROM countries WHERE cntr_id = '${country}') AS foo`}
          </Parameter>
        </Datasource>
      ) : (
        <Datasource base="db">
          <Parameter name="table">
            {`(SELECT ogc_fid, geometry FROM admin_areas WHERE admin_level = 2 AND country_code = '${country}') AS foo`}
          </Parameter>
        </Datasource>
      )}
    </Layer>
  );
}
