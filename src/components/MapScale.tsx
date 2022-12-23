import { computeDestinationPoint, getDistance } from "geolib";
import {
  Datasource,
  Layer,
  LineSymbolizer,
  Parameter,
  TextSymbolizer,
  Rule,
  Style,
  StyleName,
  MarkersSymbolizer,
} from "jsxnik/mapnikConfig";

type Params = {
  bbox: number[];
  pxLon: number;
};

const nf = Intl.NumberFormat("sk");

const mult: Record<string, number> = { 1: 2, 2: 2.5, 5: 2 };

export function MapScale({ bbox, pxLon }: Params) {
  let pt: number[];

  let d = 1;

  do {
    d *= mult[String(d).charAt(0)];

    const ptLL = computeDestinationPoint([bbox[0], bbox[1]], d, 90);

    pt = [ptLL.longitude, ptLL.latitude];
  } while (pxLon * (pt[0] - bbox[0]) < 100);

  const scale = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [bbox[0], bbox[1]],
            [pt[0], pt[1]],
          ],
        },
      },
    ],
  };

  return (
    <>
      <Layer name="mapScale" srs="+init=epsg:4326">
        <StyleName>mapScale</StyleName>

        <Datasource>
          <Parameter name="type">geojson</Parameter>
          <Parameter name="inline">{JSON.stringify(scale)}</Parameter>
        </Datasource>
      </Layer>

      <Style name="mapScale">
        <Rule>
          <LineSymbolizer stroke="white" strokeWidth={4} strokeLinecap="butt" />

          <MarkersSymbolizer
            placement="vertex-first"
            file="images/tick.svg"
            ignorePlacement
          />

          <MarkersSymbolizer
            placement="vertex-last"
            file="images/tick.svg"
            ignorePlacement
          />
          <LineSymbolizer stroke="black" strokeWidth={2} strokeLinecap="butt" />

          <TextSymbolizer
            fontsetName="regular"
            size="12"
            fill="black"
            haloFill="white"
            halo-radius="1"
            placement="line"
            allowOverlap={true}
            dy="-5"
          >
            {'"' +
              nf.format(Math.round(d > 999 ? d / 1000 : d)) +
              " " +
              (d > 999 ? "km" : "m") +
              '"'}
          </TextSymbolizer>
        </Rule>
      </Style>
    </>
  );
}
