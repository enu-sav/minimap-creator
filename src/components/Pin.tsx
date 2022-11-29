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
  pin: { lat: number; lon: number };
};

export function Pin({ pin }: Props) {
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

      <Layer name="pin" srs="+init=epsg:4326">
        <StyleName>pin</StyleName>

        <Datasource>
          <Parameter name="type">geojson</Parameter>

          <Parameter name="inline">
            {JSON.stringify(turf.point([pin.lon, pin.lat]))}
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
