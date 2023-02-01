import { simplify } from "@turf/turf";
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
import { RichLineSymbolizer } from "./RichLineSymbolizer";

type Props = {
  name: string;
  widthFactor?: number;
  simplify: number;
};

export function Waterways({ name, widthFactor = 1, simplify }: Props) {
  return (
    <>
      <Style name="waterways">
        <Rule>
          <RichLineSymbolizer
            color="[color]"
            width={`${widthFactor} * [strahler] / 3`}
            simplify={simplify}
          />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3035">
        <StyleName>waterways</StyleName>

        <Datasource>
          <Parameter name="type">sqlite</Parameter>
          <Parameter name="file">data/waterways_{name}_parent.sqlite</Parameter>
          <Parameter name="table">
            (SELECT *, '#6060a0' AS color FROM waterways_{name}) AS foo
          </Parameter>
          <Parameter name="geometry_field">shape</Parameter>
        </Datasource>
      </Layer>

      <Layer srs="+init=epsg:3035">
        <StyleName>waterways</StyleName>

        <Datasource>
          <Parameter name="type">sqlite</Parameter>
          <Parameter name="file">data/waterways_{name}.sqlite</Parameter>
          <Parameter name="table">
            (SELECT *, '#8080ff' AS color FROM waterways_{name}) AS foo
          </Parameter>
          <Parameter name="geometry_field">shape</Parameter>
        </Datasource>
      </Layer>

      <Layer srs="+init=epsg:3035">
        <StyleName>waterways</StyleName>

        <Datasource>
          <Parameter name="type">sqlite</Parameter>
          <Parameter name="file">data/waterways_{name}_main.sqlite</Parameter>
          <Parameter name="table">
            (SELECT *, '#0000ff' AS color FROM waterways_{name}) AS foo
          </Parameter>
          <Parameter name="geometry_field">shape</Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
