import { Datasource, Map, Parameter } from "jsxnik/mapnikConfig";
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
import { Coastline } from "./Coastline";
import { LandMask } from "./LandMask";
import { HighlightAdminArea } from "./HighlightAdminArea";

type Props = {
  features: string[];
  pin?: { lat: number; lon: number };
  country?: string;
  highlightAdminArea?: string | number;
  majorBorders?: Record<string, number>;
  minorBorders?: Record<string, number>;
  microBorders?: Record<string, number>;
  placeTypes: string[];
  places: string[];
  placeLabelPlacements?: string;
  placeLabelMargin?: number;
  borderWidthFactor?: number;
  coastlineWidthFactor?: number;
  waterwayWidthFactor?: number;
  placeSizeFactor?: number;
  hillshadingOpacity?: number;
  hillshadingSrs?: string;
  hillshadingVariant?: string;
  watershedName?: string;
  bbox: number[];
  pxLon: number;
  landcoverTypes: LandcoverTypes[];
  srs: string;
  colors: Record<ColorKey, string>;
  simplify: number;
  sourceSimplifyFactor: number;
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
  places,
  placeLabelPlacements,
  placeLabelMargin,
  borderWidthFactor,
  coastlineWidthFactor,
  waterwayWidthFactor,
  placeSizeFactor,
  hillshadingOpacity,
  hillshadingSrs,
  hillshadingVariant,
  watershedName,
  bbox,
  pxLon,
  landcoverTypes,
  srs,
  colors,
  simplify,
  sourceSimplifyFactor,
}: Props) {
  const coastlineBorders = features.includes("coastlineBorders");

  return (
    <Map backgroundColor={colors.water} srs={srs}>
      <Fonts />

      <Datasource name="db">
        <Parameter name="type">postgis</Parameter>
        <Parameter name="host">localhost</Parameter>
        {/* <Parameter name="dbname">minimap</Parameter>
        <Parameter name="user">minimap</Parameter>
        <Parameter name="password">minimap</Parameter> */}
        <Parameter name="port">5455</Parameter>
        <Parameter name="dbname">postgres</Parameter>
        <Parameter name="user">postgres</Parameter>
        <Parameter name="password">snakeoil</Parameter>
        <Parameter name="geometry_field">geometry</Parameter>
        <Parameter name="srid">3857</Parameter>
        <Parameter name="extent">
          -20037508.34 -20048966.1 20037508.34 20048966.1
        </Parameter>
      </Datasource>

      <Land color={colors.land} simplify={simplify} />

      {landcoverTypes.length > 0 && (
        <Landcover types={landcoverTypes} colors={colors} />
      )}

      {hillshadingOpacity && hillshadingSrs && hillshadingVariant && (
        <Hillshading
          opacity={hillshadingOpacity}
          srs={hillshadingSrs}
          variant={hillshadingVariant}
        />
      )}

      {features.includes("roads") && <Roads simplify={simplify} />}

      {highlightAdminArea && (
        <HighlightAdminArea
          area={highlightAdminArea}
          color={colors.areaHighlight}
          simplify={simplify}
          sourceSimplifyFactor={sourceSimplifyFactor}
        />
      )}

      {features.includes("borders") && (
        <Borders
          major={majorBorders}
          minor={minorBorders}
          micro={microBorders}
          widthFactor={borderWidthFactor}
          color={colors.border}
          simplify={simplify}
        />
      )}

      {coastlineBorders && (
        <>
          <LandMask srs={srs} waterColor={colors.water} />

          <Coastline
            color={colors.coastline}
            widthFactor={coastlineWidthFactor}
            simplify={simplify}
          />
        </>
      )}

      {watershedName ? (
        <>
          <Mask srs={srs} simplify={simplify}>
            <WatershedMask name={watershedName} />
          </Mask>

          <Waterways
            name={watershedName}
            widthFactor={waterwayWidthFactor}
            simplify={simplify}
          />
        </>
      ) : country ? (
        <Mask srs={srs} simplify={simplify}>
          <CountryMask
            country={country}
            sourceSimplifyFactor={sourceSimplifyFactor}
          />
        </Mask>
      ) : undefined}

      {(placeTypes.length > 0 || places.length > 0) && (
        <Places
          places={places}
          placeTypes={placeTypes}
          placements={placeLabelPlacements}
          sizeFactor={placeSizeFactor}
          countryCode={
            features.includes("limitPlacesToCountry") ? country : undefined
          }
          transliterate={features.includes("transliterate")}
          labelMargin={placeLabelMargin}
        />
      )}

      {features.includes("scale") && (
        <MapScale srs={srs} bbox={bbox} pxLon={pxLon} />
      )}

      {pin && <Pin pin={pin} color={colors.pin} />}
    </Map>
  );
}
