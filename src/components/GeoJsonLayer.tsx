import { Datasource, Layer, Parameter, StyleName } from "jsxnik/mapnikConfig";

type Props = {
  name: string;
  file: string;
  style?: string;
};

export function GeoJsonLayer({ name, file, style }: Props) {
  return (
    <Layer name={name} srs="+init=epsg:4326">
      <StyleName>{style ?? name}</StyleName>

      <Datasource>
        <Parameter name="type">geojson</Parameter>

        <Parameter name="file">{file}</Parameter>
      </Datasource>
    </Layer>
  );
}
