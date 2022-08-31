import { Filter, PolygonSymbolizer, Rule, Style } from "jsxnik/mapnikConfig";
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
              <PolygonSymbolizer fill="#fecc00" />
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
          <RichLineSymbolizer color="#c7c" width={1} />
        </Rule>
      </Style>

      <GeoJsonLayer name="district" file="geodata/okres_3.geojson" />
    </>
  );
}
