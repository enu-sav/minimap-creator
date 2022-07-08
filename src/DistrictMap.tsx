import * as turf from "@turf/turf";
import { GeoJsonLayer } from "./GeoJsonLayer";

const Map = "Map";
const Style = "Style";
const Rule = "Rule";
const Filter = "Filter";
const PolygonSymbolizer = "PolygonSymbolizer";
const LineSymbolizer = "LineSymbolizer";
const MarkersSymbolizer = "MarkersSymbolizer";
const Layer = "Layer";
const StyleName = "StyleName";
const Datasource = "Datasource";
const Parameter = "Parameter";

type Props = {
  krajId?: number;
  okresId?: number;
  featureSet: Set<string>;
  point?: { lat: number; lon: number };
};

export function DistrictMap({ krajId, okresId, featureSet, point }: Props) {
  return (
    <Map>
      <Style name="bgFill">
        <Rule>
          <PolygonSymbolizer fill="#ccc" />
        </Rule>
      </Style>

      <Style name="krajFill">
        <Rule>
          <Filter>[IDN2] = {krajId}</Filter>
          <PolygonSymbolizer fill="#c00" />
        </Rule>
      </Style>

      <Style name="kraj">
        <Rule>
          <LineSymbolizer
            stroke="#734a08"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </Rule>
      </Style>

      <Style name="okresFill">
        <Rule>
          <Filter>[IDN3] = {okresId}</Filter>
          <PolygonSymbolizer fill="#c00" />
        </Rule>
      </Style>

      <Style name="okres">
        <Rule>
          <LineSymbolizer
            stroke="#734a08"
            stroke-width="1"
            stroke-linejoin="round"
          />
        </Rule>
      </Style>

      <Style name="point">
        <Rule>
          <MarkersSymbolizer
            allow-overlap="true"
            ignore-placement="true"
            stroke-width="0"
            fill="blue"
            width="12"
            height="12"
          />
        </Rule>
      </Style>

      <GeoJsonLayer name="bgFill" file="geodata/sr_3.geojson" />

      {okresId !== undefined && (
        <GeoJsonLayer
          name="okres"
          file="geodata/okres_3.geojson"
          style="okresFill"
        />
      )}

      {krajId !== undefined && (
        <GeoJsonLayer
          name="kraj"
          file="geodata/kraj_3.geojson"
          style="krajFill"
        />
      )}

      {featureSet.has("okresy") && (
        <GeoJsonLayer name="okres" file="geodata/okres_3.geojson" />
      )}

      {featureSet.has("kraje") && (
        <GeoJsonLayer name="kraj" file="geodata/kraj_3.geojson" />
      )}

      {point && (
        <Layer name="point" srs="+init=epsg:4326">
          <StyleName>point</StyleName>

          <Datasource>
            <Parameter name="type">geojson</Parameter>

            <Parameter name="inline">
              {JSON.stringify(turf.point([point.lon, point.lat]))}
            </Parameter>
          </Datasource>
        </Layer>
      )}
    </Map>
  );
}
