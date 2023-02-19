import {
  Datasource,
  Layer,
  Parameter,
  RasterSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

type Props = { opacity: number; srs: string; variant: string };

export function Hillshading({ opacity, srs, variant }: Props) {
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
          <Parameter name="file">{`data/hillshading-${variant}.tif`}</Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
