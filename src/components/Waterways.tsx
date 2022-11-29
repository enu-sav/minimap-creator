import {
  Datasource,
  ElseFilter,
  Filter,
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
          <LineSymbolizer stroke="[color]" strokeWidth="[strahler] / 3" />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3035">
        <StyleName>waterways</StyleName>

        <Datasource>
          <Parameter name="type">sqlite</Parameter>
          <Parameter name="file">waterways_{name}.sqlite</Parameter>
          <Parameter name="table">{`(SELECT *, '#8080ff' AS color FROM waterways_${name}) AS foo`}</Parameter>
          <Parameter name="geometry_field">shape</Parameter>
        </Datasource>
      </Layer>

      <Layer srs="+init=epsg:3035">
        <StyleName>waterways</StyleName>

        <Datasource>
          <Parameter name="type">sqlite</Parameter>
          <Parameter name="file">waterways_{name}_main.sqlite</Parameter>
          <Parameter name="table">{`(SELECT *, '#0000ff' AS color FROM waterways_${name}) AS foo`}</Parameter>
          <Parameter name="geometry_field">shape</Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
