import { Datasource, Map, Parameter } from "jsxnik/mapnikConfig";
import { colors } from "../colors";
import { Borders } from "./Borders";
import { Mask } from "./Mask";
import { Fonts } from "./Fonts";
import { Hillshading } from "./Hillshading";
import { Land } from "./Land";
import { Landcover } from "./Landcover";
import { Pin } from "./Pin";
import { Places } from "./Places";
import { Roads } from "./Roads";
import { Waterways } from "./Waterways";
import { CountryMask } from "./CountryMask";
import { WatershedMask } from "./WatershedMask";

type Props = {
  featureSet: Set<string>;
  pin?: { lat: number; lon: number };
  country?: string;
  highlightAdminArea?: string | number;
  majorBorders?: Record<string, number>;
  minorBorders?: Record<string, number>;
  microBorders?: Record<string, number>;
  placeTypes?: string[];
  borderWidthFactor?: number;
  hillshadingOpacity?: number;
  watershedName?: string;
};

export function RichMap({
  featureSet,
  pin,
  country,
  highlightAdminArea,
  majorBorders,
  minorBorders,
  microBorders,
  placeTypes,
  borderWidthFactor,
  hillshadingOpacity,
  watershedName,
}: Props) {
  return (
    <Map backgroundColor={colors.water}>
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

      {featureSet.has("landcover") && <Landcover />}

      {hillshadingOpacity && <Hillshading opacity={hillshadingOpacity} />}

      {featureSet.has("roads") && <Roads />}

      {watershedName ? (
        <>
          <Mask>
            <WatershedMask name={watershedName} />
          </Mask>

          <Waterways name={watershedName} />
        </>
      ) : country ? (
        <Mask>
          <CountryMask country={country} />
        </Mask>
      ) : undefined}

      {featureSet.has("borders") && (
        <Borders
          highlight={highlightAdminArea}
          major={majorBorders}
          minor={minorBorders}
          micro={microBorders}
          widthFactor={borderWidthFactor}
        />
      )}

      {(featureSet.has("cities") || placeTypes != null) && (
        <Places placeTypes={placeTypes} />
      )}

      {pin && <Pin pin={pin} />}
    </Map>
  );
}
