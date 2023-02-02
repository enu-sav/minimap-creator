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
          <Parameter name="geometry_table">border_lines</Parameter>
          {/* prettier-ignore */}
          <Parameter name="table">
            (
              SELECT
                ST_BuildArea(ST_Union(ST_SimplifyPreserveTopology(border_lines.geometry, {sourceSimplifyFactor}))) AS geometry
              FROM
                osm_admin_rels
                JOIN admin_borders USING (osm_id)
                JOIN border_lines USING (id)
              WHERE
                {isNaN(Number(area)) ? ` name = $quot$${area}$quot$ OR name_sk = $quot$${area}$quot$ `: ` -osm_id = ${area} `}
              LIMIT
                1
            ) AS foo
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
