import { Datasource, Layer, Parameter, StyleName } from "jsxnik/mapnikConfig";

type Props = { country: string };

export function CountryMask({ country }: Props) {
  return (
    <Layer srs="+init=epsg:3857" compOp="dst-out">
      <StyleName>mask</StyleName>

      <Datasource base="db">
        <Parameter name="table">
          {`(SELECT geometry FROM admin_areas WHERE admin_level = 2 AND country_code = '${country}') AS foo`}
        </Parameter>
      </Datasource>
    </Layer>
  );
}
