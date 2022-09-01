import { Filter, PolygonSymbolizer, Rule, Style } from "jsxnik/mapnikConfig";
import { colors } from "../colors";
import { GeoJsonLayer } from "./GeoJsonLayer";
import { RichLineSymbolizer } from "./RichLineSymbolizer";

type Props = {
  districtId?: number;
};

export function SkDistricts({ districtId }: Props) {
  return (
    <>
      {districtId !== undefined && (
        <>
          <Style name="districtFill">
            <Rule>
              <Filter>[IDN3] = {districtId}</Filter>
              <PolygonSymbolizer fill={colors.areaHighlight} />
            </Rule>
          </Style>

          <GeoJsonLayer
            name="district"
            file="geodata/okres_3.geojson"
            style="districtFill"
          />
        </>
      )}

      <Style name="district">
        <Rule>
          <RichLineSymbolizer color={colors.border} width={1} />
        </Rule>
      </Style>

      <GeoJsonLayer name="district" file="geodata/okres_3.geojson" />
    </>
  );
}
