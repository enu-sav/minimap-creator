import { Filter, PolygonSymbolizer, Rule, Style } from "jsxnik/mapnikConfig";
import { colors } from "../colors";
import { GeoJsonLayer } from "./GeoJsonLayer";

type Props = {
  regionId: number;
};

export function Region({ regionId }: Props) {
  return (
    <>
      <Style name="regionFill">
        <Rule>
          <Filter>[IDN2] = {regionId}</Filter>
          <PolygonSymbolizer fill={colors.areaHighlight} />
        </Rule>
      </Style>

      <GeoJsonLayer
        name="region"
        file="geodata/kraj_3.geojson"
        style="regionFill"
      />
    </>
  );
}
