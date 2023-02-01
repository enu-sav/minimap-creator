import { Datasource, Layer, Parameter, StyleName } from "jsxnik/mapnikConfig";

type Props = { name: string };

export function WatershedMask({ name }: Props) {
  return (
    <Layer srs="+init=epsg:3857" compOp="dst-out">
      <StyleName>mask</StyleName>

      <Datasource>
        <Parameter name="type">sqlite</Parameter>

        <Parameter name="file">data/watershed_{name}.sqlite</Parameter>

        <Parameter name="table">watershed_{name}</Parameter>
      </Datasource>
    </Layer>
  );
}
