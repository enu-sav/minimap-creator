import { Datasource, Map, Parameter } from "jsxnik/mapnikConfig";
import { colors } from "../colors";
import { Borders } from "./Borders";
import { Mask } from "./Mask";
import { Fonts } from "./Fonts";
import { Hillshading } from "./Hillshading";
import { Land } from "./Land";
import { Landcover, LandcoverTypes } from "./Landcover";
import { Pin } from "./Pin";
import { Places } from "./Places";
import { Roads } from "./Roads";
import { Waterways } from "./Waterways";
import { CountryMask } from "./CountryMask";
import { WatershedMask } from "./WatershedMask";
import { MapScale } from "./MapScale";
import { CoastlinedCoutryBorders } from "./CoastlinedCoutryBorders";
import { LandMask } from "./LandMask";

type Props = {
  features: string[];
  pin?: { lat: number; lon: number };
  country?: string;
  highlightAdminArea?: string | number;
  majorBorders?: Record<string, number>;
  minorBorders?: Record<string, number>;
  microBorders?: Record<string, number>;
  placeTypes: string[];
  borderWidthFactor?: number;
  waterwayWidthFactor?: number;
  placeSizeFactor?: number;
  hillshadingOpacity?: number;
  watershedName?: string;
  bbox: number[];
  pxLon: number;
  landcoverTypes: LandcoverTypes[];
  srs: string;
};

export function RichMap({
  features,
  pin,
  country,
  highlightAdminArea,
  majorBorders,
  minorBorders,
  microBorders,
  placeTypes,
  borderWidthFactor,
  waterwayWidthFactor,
  placeSizeFactor,
  hillshadingOpacity,
  watershedName,
  bbox,
  pxLon,
  landcoverTypes,
  srs,
}: Props) {
  const coastlineBorders = features.includes("coastlineBorders");

  return (
    <Map backgroundColor={colors.water} srs={srs}>
      <Fonts />

      {/* <Datasource name="db">
        <Parameter name="type">postgis</Parameter>
        <Parameter name="host">localhost</Parameter>
        <Parameter name="dbname">minimap</Parameter>
        <Parameter name="user">minimap</Parameter>
        <Parameter name="password">minimap</Parameter>
      </Datasource> */}

      <Datasource name="db">
        <Parameter name="type">sqlite</Parameter>
        <Parameter name="file">map.sqlite</Parameter>
      </Datasource>

      <Land />

      {landcoverTypes.length > 0 && <Landcover types={landcoverTypes} />}

      {hillshadingOpacity && <Hillshading opacity={hillshadingOpacity} />}

      {features.includes("roads") && <Roads />}

      {features.includes("borders") && (
        <Borders
          highlight={highlightAdminArea}
          major={majorBorders}
          minor={minorBorders}
          micro={microBorders}
          widthFactor={borderWidthFactor}
          // noMajor={coastlineBorders}
        />
      )}

      {coastlineBorders && (
        <>
          <LandMask srs={srs} />

          <CoastlinedCoutryBorders widthFactor={borderWidthFactor} />
        </>
      )}

      {watershedName ? (
        <>
          <Mask srs={srs}>
            <WatershedMask name={watershedName} />
          </Mask>

          <Waterways name={watershedName} widthFactor={waterwayWidthFactor} />
        </>
      ) : country ? (
        <Mask srs={srs}>
          <CountryMask country={country} coastlineBorders={coastlineBorders} />
        </Mask>
      ) : undefined}

      {placeTypes.length > 0 && (
        <Places
          placeTypes={placeTypes}
          sizeFactor={placeSizeFactor}
          countryCode={
            features.includes("limitPlacesToCountry") ? country : undefined
          }
          transliterate={features.includes("transliterate")}
        />
      )}

      {features.includes("scale") && <MapScale bbox={bbox} pxLon={pxLon} />}

      {pin && <Pin pin={pin} />}
    </Map>
  );
}
