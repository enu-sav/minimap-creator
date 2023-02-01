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
};

export function HighlightAdminArea({ area, color, simplify }: Props) {
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
                ST_BuildArea(ST_Union(aaa1.geometry)) AS geometry
              FROM
                admin_areas
                JOIN bbb USING (osm_id)
                JOIN aaa1 USING (id)
              WHERE
                name = '{area}'
                OR name_sk = '{area}'
                {isNaN(Number(area)) ? "": `OR -osm_id = ${area}`}
              LIMIT
                1
            ) AS foo
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
