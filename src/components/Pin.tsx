import * as turf from "@turf/turf";
import { FeatureCollection } from "@turf/turf";
import { readFileSync } from "fs";
import {
  Datasource,
  Layer,
  MarkersSymbolizer,
  Parameter,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { colors } from "../colors";

type Props = {
  placeId?: number;
  pin?: { lat: number; lon: number };
};

const places = JSON.parse(
  readFileSync("geodata/obec_3.geojson", "utf-8")
) as FeatureCollection;

export function Pin({ placeId, pin }: Props) {
  const place =
    placeId !== undefined
      ? places.features.find(
          (feature) => feature.properties?.["IDN4"] === placeId
        )
      : undefined;

  return (
    <>
      <Style name="pin">
        <Rule>
          <MarkersSymbolizer
            file="images/pin.svg"
            allowOverlap={true}
            ignorePlacement={true}
            strokeWidth={0}
            fill={colors.pin}
          />
        </Rule>
      </Style>

      {pin !== undefined && (
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
    </>
  );
}
