import { Datasource, Map, Parameter } from "jsxnik/mapnikConfig";
import { colors } from "../colors";
import { Borders } from "./Borders";
import { CountryMask } from "./CountryMask";
import { Fonts } from "./Fonts";
import { Land } from "./Land";
import { Landcover } from "./Landcover";
import { Pin } from "./Pin";
import { Places } from "./Places";
import { Roads } from "./Roads";
import { SkDistricts } from "./SkDistricts";
import { SkRegions } from "./SkRegions";

type Props = {
  regionId?: number;
  districtId?: number;
  placeId?: number;
  featureSet: Set<string>;
  pin?: { lat: number; lon: number };
  country?: string;
  highlightAdminArea?: string | number;
  minorBorders?: Record<string, number>;
  microBorders?: Record<string, number>;
  placeTypes?: string[];
};

export function RichMap({
  regionId,
  districtId,
  placeId,
  featureSet,
  pin,
  country,
  highlightAdminArea,
  minorBorders,
  microBorders,
  placeTypes,
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

      {featureSet.has("districts") && <SkDistricts districtId={districtId} />}

      {featureSet.has("regions") && <SkRegions regionId={regionId} />}

      {featureSet.has("roads") && <Roads />}

      {country !== undefined && <CountryMask country={country} />}

      {featureSet.has("borders") && (
        <Borders
          highlight={highlightAdminArea}
          minor={minorBorders}
          micro={microBorders}
        />
      )}

      {(featureSet.has("cities") || placeTypes != null) && (
        <Places placeTypes={placeTypes} />
      )}

      <Pin pin={pin} placeId={placeId} />
    </Map>
  );
}
