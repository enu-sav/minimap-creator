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
};

export function RichMap({
  regionId,
  districtId,
  placeId,
  featureSet,
  pin,
  country,
}: Props) {
  return (
    <Map backgroundColor={colors.water}>
      <Fonts />

      <Datasource name="db">
        <Parameter name="type">postgis</Parameter>
        <Parameter name="host">localhost</Parameter>
        <Parameter name="dbname">minimap</Parameter>
        <Parameter name="user">minimap</Parameter>
        <Parameter name="password">minimap</Parameter>

        {/* <Parameter name="type">sqlite</Parameter>
        <Parameter name="file">slovakia.sqlite</Parameter> */}
      </Datasource>

      <Datasource name="admin_db">
        <Parameter name="type">sqlite</Parameter>
        <Parameter name="file">admin.sqlite</Parameter>
      </Datasource>

      <Land />

      {featureSet.has("districts") && <SkDistricts districtId={districtId} />}

      {featureSet.has("regions") && <SkRegions regionId={regionId} />}

      {featureSet.has("landuse") && <Landcover />}

      {featureSet.has("roads") && <Roads />}

      {country !== undefined && <CountryMask country={country} />}

      {featureSet.has("osm_borders") && <Borders />}

      {featureSet.has("cities") && <Places />}

      <Pin pin={pin} placeId={placeId} />
    </Map>
  );
}
