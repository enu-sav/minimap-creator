import { Filter, PolygonSymbolizer, Rule, Style } from "jsxnik/mapnikConfig";
import { GeoJsonLayer } from "./GeoJsonLayer";
import { RichLineSymbolizer } from "./RichLineSymbolizer";

type Props = {
  regionId?: number;
};

export function SkRegions({ regionId }: Props) {
  return (
    <>
      {regionId !== undefined && (
        <>
          <Style name="regionFill">
            <Rule>
              <Filter>[IDN2] = {regionId}</Filter>
              <PolygonSymbolizer fill="#c00" />
            </Rule>
          </Style>

          <GeoJsonLayer
            name="region"
            file="geodata/kraj_3.geojson"
            style="regionFill"
          />
        </>
      )}

      <Style name="region">
        <Rule>
          <RichLineSymbolizer color="#808" width={1.5} />
        </Rule>
      </Style>

      <GeoJsonLayer name="region" file="geodata/kraj_3.geojson" />
    </>
  );
}