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
      <Layer srs="+init=epsg:4326" clearLabelCache opacity={0.8}>
        <StyleName>mapScaleBg</StyleName>

        <Datasource>
          <Parameter name="type">geojson</Parameter>
          <Parameter name="inline">{JSON.stringify(scale)}</Parameter>
        </Datasource>
      </Layer>

      <Layer srs="+init=epsg:4326" clearLabelCache>
        <StyleName>mapScale</StyleName>

        <Datasource>
          <Parameter name="type">geojson</Parameter>
          <Parameter name="inline">{JSON.stringify(scale)}</Parameter>
        </Datasource>
      </Layer>

      <Style name="mapScaleBg">
        <Rule>
          <LineSymbolizer
            stroke="white"
            strokeWidth={27}
            strokeLinecap="butt"
            offset={-9}
            geometryTransform="translate(-3, 0)"
          />

          <LineSymbolizer
            stroke="white"
            strokeWidth={27}
            strokeLinecap="butt"
            offset={-9}
            geometryTransform="translate(3, 0)"
          />
        </Rule>
      </Style>

      <Style name="mapScale">
        <Rule>
          {/* <LineSymbolizer stroke="white" strokeWidth={8} strokeLinecap="butt" /> */}

          {/* <MarkersSymbolizer
            offset={-9}
            placement="vertex-first"
            file="images/tick.svg"
          />

          <MarkersSymbolizer
            offset={-9}
            placement="vertex-last"
            file="images/tick-r.svg"
          /> */}

          <LineSymbolizer stroke="black" strokeWidth={3} strokeLinecap="butt" />

          <TextSymbolizer
            fontsetName="regular"
            size={16}
            fill="black"
            placement="line"
            allowOverlap
            dy={-6}
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