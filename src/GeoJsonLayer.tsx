type Props = {
  name: string;
  file: string;
  style?: string;
};

const Layer = "Layer";
const StyleName = "StyleName";
const Datasource = "Datasource";
const Parameter = "Parameter";

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
