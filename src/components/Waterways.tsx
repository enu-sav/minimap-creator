import {
  Datasource,
  Layer,
  LineSymbolizer,
  Parameter,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

type Props = {
  name: string;
};

export function Waterways({ name }: Props) {
  return (
    <>
      <Style name="waterways">
        <Rule>
          <LineSymbolizer stroke="#0000ff" />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3035">
        <StyleName>waterways</StyleName>

        <Datasource>
          <Parameter name="type">sqlite</Parameter>

          <Parameter name="file">waterways_{name}.sqlite</Parameter>

          <Parameter name="table">waterways_{name}</Parameter>
        </Datasource>
      </Layer>

      <Style name="waterways">
        <Rule>
          <LineSymbolizer stroke="#0000ff" />
        </Rule>
      </Style>
    </>
  );
}
