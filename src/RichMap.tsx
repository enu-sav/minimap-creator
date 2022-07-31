import * as turf from "@turf/turf";
import { FeatureCollection } from "@turf/turf";
import { readFileSync } from "fs";
import { GeoJsonLayer } from "./GeoJsonLayer";
import {
  Map,
  Datasource,
  Filter,
  Font,
  FontSet,
  Layer,
  LineSymbolizer,
  MarkersSymbolizer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  ShieldSymbolizer,
  Style,
  StyleName,
} from "./mapnikConfig";

type Props = {
  regionId?: number;
  districtId?: number;
  placeId?: number;
  featureSet: Set<string>;
  pin?: { lat: number; lon: number };
};

const places = JSON.parse(
  readFileSync("geodata/obec_3.geojson", "utf-8")
) as FeatureCollection;

function RichLineSymbolizer({
  width,
  color,
}: {
  width: number;
  color: string;
}) {
  return (
    <LineSymbolizer
      stroke={color}
      stroke-width={width}
      stroke-linejoin="round"
      stroke-linecap="round"
      simplify={0.5}
      simplify-algorithm="douglas-peucker"
    />
  );
}

export function RichMap({
  regionId,
  districtId,
  placeId,
  featureSet,
  pin,
}: Props) {
  const place =
    placeId !== undefined
      ? places.features.find(
          (feature) => feature.properties?.["IDN4"] === placeId
        )
      : undefined;

  return (
    <Map
    // background-color="#eee"
    >
      <FontSet name="regular">
        <Font face-name="PT Sans Regular" />
      </FontSet>

      <Datasource name="db">
        {/* <Parameter name="type">postgis</Parameter>
        <Parameter name="host">localhost</Parameter>
        <Parameter name="dbname">minimap</Parameter>
        <Parameter name="user">minimap</Parameter>
        <Parameter name="password">minimap</Parameter> */}

        <Parameter name="type">sqlite</Parameter>
        <Parameter name="file">slovakia.sqlite</Parameter>
      </Datasource>

      <Style name="bgFill">
        <Rule>
          <PolygonSymbolizer fill="#ccc" />
        </Rule>
      </Style>

      {regionId !== undefined && (
        <Style name="regionFill">
          <Rule>
            <Filter>[IDN2] = {regionId}</Filter>
            <PolygonSymbolizer fill="#c00" />
          </Rule>
        </Style>
      )}

      <Style name="region">
        <Rule>
          <RichLineSymbolizer color="#808" width={1.5} />
        </Rule>
      </Style>

      {districtId !== undefined && (
        <Style name="districtFill">
          <Rule>
            <Filter>[IDN3] = {districtId}</Filter>
            <PolygonSymbolizer fill="#c00" />
          </Rule>
        </Style>
      )}

      <Style name="district">
        <Rule>
          <RichLineSymbolizer color="#808" width={1} />
        </Rule>
      </Style>

      <Style name="borders">
        <Rule>
          <Filter>[admin_level] = 2</Filter>

          <RichLineSymbolizer color="#ff00ff" width={2} />
        </Rule>

        <Rule>
          <Filter>[admin_level] = 4</Filter>

          <RichLineSymbolizer color="#ff00ff" width={1} />
        </Rule>
      </Style>

      <Style name="roads">
        <Rule>
          <Filter>[type] = 'motorway'</Filter>

          <RichLineSymbolizer color="#734a08" width={1.5} />
        </Rule>

        <Rule>
          <Filter>[type] = 'trunk' || [type] = 'primary'</Filter>

          <RichLineSymbolizer color="#734a08" width={1} />
        </Rule>
      </Style>

      <Style name="places">
        <Rule>
          <Filter>[type] = 'city' &amp;&amp; [capital] = 'yes'</Filter>

          <ShieldSymbolizer
            fontset-name="regular"
            file="images/capital.svg"
            margin={20}
            size={20}
            halo-fill="white"
            halo-radius={2}
            halo-opacity={0.75}
            unlock-image={true}
            dy={-10}
            shield-dy={0}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'city'</Filter>

          <ShieldSymbolizer
            fontset-name="regular"
            file="images/city.svg"
            margin={20}
            size={20}
            halo-fill="white"
            halo-radius={2}
            halo-opacity={0.75}
            unlock-image={true}
            dy={-10}
            shield-dy={0}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'town'</Filter>

          <ShieldSymbolizer
            fontset-name="regular"
            file="images/town.svg"
            margin={20}
            size={16}
            halo-fill="white"
            halo-radius={2}
            halo-opacity={0.75}
            unlock-image={true}
            dy={-10}
            shield-dy={0}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>
      </Style>

      <Style name="pin">
        <Rule>
          <MarkersSymbolizer
            file="images/pin.svg"
            allow-overlap={true}
            ignore-placement={true}
            stroke-width={0}
            fill="#d00"
          />
        </Rule>
      </Style>

      {/* <Layer name="borders" srs="+init=epsg:3857">
        <StyleName>borders</StyleName>

        <Datasource base="db">
          <Parameter name="table">osm_admin</Parameter>
        </Datasource>
      </Layer> */}

      <GeoJsonLayer name="bgFill" file="geodata/sr_3.geojson" />

      {districtId !== undefined && (
        <GeoJsonLayer
          name="district"
          file="geodata/okres_3.geojson"
          style="districtFill"
        />
      )}

      {regionId !== undefined && (
        <GeoJsonLayer
          name="region"
          file="geodata/kraj_3.geojson"
          style="regionFill"
        />
      )}

      {featureSet.has("districts") && (
        <GeoJsonLayer name="district" file="geodata/okres_3.geojson" />
      )}

      {featureSet.has("regions") && (
        <GeoJsonLayer name="region" file="geodata/kraj_3.geojson" />
      )}

      {featureSet.has("roads") && (
        <Layer name="roads" srs="+init=epsg:3857" opacity={0.5}>
          <StyleName>roads</StyleName>

          <Datasource base="db">
            <Parameter name="table">osm_roads_gen1_merged</Parameter>
          </Datasource>
        </Layer>
      )}

      {featureSet.has("cities") && (
        <Layer name="places" srs="+init=epsg:3857">
          <StyleName>places</StyleName>

          <Datasource base="db">
            <Parameter name="table">
              (SELECT * FROM osm_places ORDER BY z_order DESC, population DESC)
              AS foo
            </Parameter>
          </Datasource>
        </Layer>
      )}

      {pin && (
        <Layer name="pin" srs="+init=epsg:4326">
          <StyleName>pin</StyleName>

          <Datasource>
            <Parameter name="type">geojson</Parameter>

            <Parameter name="inline">
              {JSON.stringify(turf.point([pin.lon, pin.lat]))}
            </Parameter>
          </Datasource>
        </Layer>
      )}

      {place !== undefined && (
        <Layer name="place" srs="+init=epsg:4326">
          <StyleName>pin</StyleName>

          <Datasource>
            <Parameter name="type">geojson</Parameter>

            <Parameter name="inline">
              {JSON.stringify(turf.centroid(place))}
            </Parameter>
          </Datasource>
        </Layer>
      )}
    </Map>
  );
}
