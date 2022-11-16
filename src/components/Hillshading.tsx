import {
  Datasource,
  Layer,
  Parameter,
  RasterSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

type Props = { opacity: number };

export function Hillshading({ opacity }: Props) {
  return (
    <>
      <Style name="hillshading">
        <Rule>
          <RasterSymbolizer scaling="lanczos" opacity={opacity} />
        </Rule>
      </Style>

      <Layer name="hillshading" srs="+init=epsg:3035">
        <StyleName>hillshading</StyleName>

        <Datasource>
          <Parameter name="type">gdal</Parameter>
          <Parameter name="file">hillshading.tif</Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
