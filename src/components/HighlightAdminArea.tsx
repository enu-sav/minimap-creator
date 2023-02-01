import {
  Datasource,
  Layer,
  Parameter,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { RichPolygonSymbolizer } from "./RichPolygonSymbolizer";

type Props = {
  area: string | number;
  color: string;
  simplify: number;
  sourceSimplifyFactor: number;
};

export function HighlightAdminArea({
  area,
  color,
  simplify,
  sourceSimplifyFactor,
}: Props) {
  if (typeof area === "string") {
    area = area.replaceAll("$quot$", "!");
  }

  return (
    <>
      <Style name="highlightAdminArea">
        <Rule>
          <RichPolygonSymbolizer color={color} simplify={simplify} />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857">
        <StyleName>highlightAdminArea</StyleName>

        <Datasource base="db">
          {/* prettier-ignore */}
          <Parameter name="table">
            (
              SELECT
                ST_BuildArea(ST_Union(ST_SimplifyPreserveTopology(aaa1.geometry, {sourceSimplifyFactor}))) AS geometry
              FROM
                admin_areas
                JOIN bbb USING (osm_id)
                JOIN aaa1 USING (id)
              WHERE
                {isNaN(Number(area)) ? ` name = $quot$${area}$quot$ OR name_sk = $quot$${area}$quot$`: ` -osm_id = ${area}`}
              LIMIT
                1
            ) AS foo
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
