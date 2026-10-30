import {
  Datasource,
  Layer,
  Parameter,
  RasterSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

type Props = { opacity: number; file: string; srs: string };

export function Hillshading({ opacity, file, srs }: Props) {
  return (
    <>
      <Style name="hillshading">
        <Rule>
          <RasterSymbolizer scaling="lanczos" opacity={opacity} />
        </Rule>
      </Style>

      <Layer srs={srs}>
        <StyleName>hillshading</StyleName>

        <Datasource>
          <Parameter name="type">gdal</Parameter>
          <Parameter name="file">{file}</Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
