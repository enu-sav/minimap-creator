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
  country: string;
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
      strokeWidth={width}
      strokeLinejoin="round"
      strokeLinecap="round"
      // simplify={0.5}
      // simplifyAlgorithm="douglas-peucker"
    />
  );
}

export function RichMap({
  regionId,
  districtId,
  placeId,
  featureSet,
  pin,
  country,
}: Props) {
  const place =
    placeId !== undefined
      ? places.features.find(
          (feature) => feature.properties?.["IDN4"] === placeId
        )
      : undefined;

  return (
    <Map backgroundColor="#88f">
      <FontSet name="regular">
        <Font faceName="PT Sans Regular" />
      </FontSet>

      <Datasource name="db">
        <Parameter name="type">postgis</Parameter>
        <Parameter name="host">localhost</Parameter>
        <Parameter name="dbname">minimap</Parameter>
        <Parameter name="user">minimap</Parameter>
        <Parameter name="password">minimap</Parameter>

        {/* <Parameter name="type">sqlite</Parameter>
        <Parameter name="file">slovakia.sqlite</Parameter> */}
      </Datasource>

      <Style name="bgFill">
        <Rule>
          <PolygonSymbolizer fill="#e6edd5" />
        </Rule>
      </Style>

      <Style name="countryMask">
        <Rule>
          <PolygonSymbolizer fill="#000" />
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
            <PolygonSymbolizer fill="#fecc00" />
          </Rule>
        </Style>
      )}

      <Style name="district">
        <Rule>
          <RichLineSymbolizer color="#c7c" width={1} />
        </Rule>
      </Style>

      <Style name="land">
        <Rule>
          <PolygonSymbolizer fill="#eee" />
        </Rule>
      </Style>

      <Style name="landuse">
        {featureSet.has("forests") && (
          <Rule>
            <Filter>
              [type] = 'forest' or [type] = 'wood' or [type] = 'scrub'
            </Filter>
            <PolygonSymbolizer fill="#9d9" />
          </Rule>
        )}

        {featureSet.has("water_areas") && (
          <Rule>
            <Filter>
              [type] = 'water' or [type] = 'basin' or [type] = 'reservoir'
            </Filter>
            <PolygonSymbolizer fill="#88f" />
          </Rule>
        )}
      </Style>

      <Style name="borders">
        <Rule>
          <Filter>[admin_level] = 2</Filter>

          <RichLineSymbolizer color="#808" width={3} />
        </Rule>

        <Rule>
          <Filter>[admin_level] = 4</Filter>

          <RichLineSymbolizer color="#808" width={1} />
        </Rule>

        {/* <Rule>
          <Filter>[admin_level] = 8</Filter>

          <RichLineSymbolizer color="#808" width={1} />
        </Rule> */}
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
            fontsetName="regular"
            file="images/capital.svg"
            margin={20}
            size={20}
            haloFill="white"
            haloRadius={2}
            haloOpacity={0.75}
            unlockImage={true}
            dy={-10}
            shieldDy={0}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'city'</Filter>

          <ShieldSymbolizer
            fontsetName="regular"
            file="images/city.svg"
            margin={20}
            size={20}
            haloFill="white"
            haloRadius={2}
            haloOpacity={0.75}
            unlockImage={true}
            dy={-10}
            shieldDy={0}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'town'</Filter>

          <ShieldSymbolizer
            fontsetName="regular"
            file="images/town.svg"
            margin={20}
            size={16}
            haloFill="white"
            haloRadius={2}
            haloOpacity={0.75}
            unlockImage={true}
            dy={-10}
            shieldDy={0}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>
      </Style>

      <Style name="pin">
        <Rule>
          <MarkersSymbolizer
            file="images/pin.svg"
            allowOverlap={true}
            ignorePlacement={true}
            strokeWidth={0}
            fill="#d00"
          />
        </Rule>
      </Style>

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

      <Layer name="land" srs="+init=epsg:3857">
        <StyleName>land</StyleName>

        <Datasource>
          <Parameter name="type">shape</Parameter>
          <Parameter name="file">
            simplified-land-polygons-complete-3857/simplified_land_polygons.shp
          </Parameter>
        </Datasource>
      </Layer>

      <Layer name="landuse" srs="+init=epsg:3857">
        <StyleName>landuse</StyleName>

        <Datasource base="db">
          <Parameter name="table">osm_landusages_gen0</Parameter>
        </Datasource>
      </Layer>

      <Layer
        name="countryMask"
        srs="+init=epsg:4326"
        compOp="src-over"
        opacity={0.25}
      >
        <StyleName>countryMask</StyleName>

        <Datasource>
          <Parameter name="type">geojson</Parameter>
          <Parameter name="inline">
            {`
              {
                "type": "Polygon",
                "coordinates": [
                  [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]
                ]
              }
          `}
          </Parameter>
        </Datasource>

        <Layer name="countryMask1" srs="+init=epsg:3857" compOp="dst-out">
          <StyleName>countryMask</StyleName>

          <Datasource base="db">
            <Parameter name="table">
              (SELECT geometry FROM osm_admin_gen0 WHERE admin_level = 2 AND
              country_code = '{country}') AS foo
            </Parameter>
          </Datasource>
        </Layer>
      </Layer>

      {featureSet.has("roads") && (
        <Layer name="roads" srs="+init=epsg:3857">
          <StyleName>roads</StyleName>

          <Datasource base="db">
            <Parameter name="table">osm_roads_gen0</Parameter>
          </Datasource>
        </Layer>
      )}

      {featureSet.has("osm_borders") && (
        <Layer name="borders" srs="+init=epsg:3857">
          <StyleName>borders</StyleName>

          <Datasource base="db">
            <Parameter name="table">
              (select admin_level, st_makevalid(geometry) as geometry from
              osm_admin_gen0 where admin_level in (2, 4)) AS foo
            </Parameter>
          </Datasource>
        </Layer>
      )}

      {featureSet.has("cities") && (
        <Layer name="places" srs="+init=epsg:3857">
          <StyleName>places</StyleName>

          <Datasource base="db">
            <Parameter name="table">
              (SELECT coalesce(NULLIF(name_sk, ''), name) AS name, geometry,
              type, capital FROM osm_places ORDER BY z_order DESC, population
              DESC) AS foo
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
