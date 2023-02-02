import {
  Datasource,
  Layer,
  Parameter,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { RichLineSymbolizer } from "./RichLineSymbolizer";

type Props = {
  major?: Record<string, number>;
  minor?: Record<string, number>;
  micro?: Record<string, number>;
  widthFactor?: number;
  color: string;
  simplify: number;
};

export function Borders({
  major = { "": 2 },
  minor,
  micro,
  widthFactor = 1,
  color,
  simplify,
}: Props) {
  const condition = [
    ...new Set([
      ...Object.entries(major ?? {}),
      ...Object.entries(minor ?? {}),
      ...Object.entries(micro ?? {}),
    ]),
  ]
    .map(
      ([cc, level]) =>
        `admin_level = ${level}` + (cc ? ` AND country_code = '${cc}'` : "")
    )
    .join(" OR ");

  const width =
    "CASE " +
    [
      ...new Set([
        ...Object.entries(major ?? {}).map((a) => [a[0], a[1], 3] as const),
        ...Object.entries(minor ?? {}).map((a) => [a[0], a[1], 1.5] as const),
        ...Object.entries(micro ?? {}).map((a) => [a[0], a[1], 0.5] as const),
      ]),
    ]
      .map(
        ([cc, level, width], i) =>
          `WHEN admin_level = ${level}` +
          (cc ? ` AND country_code = '${cc}'` : "") +
          " THEN " +
          width
      )
      .join(" ") +
    " ELSE 0 END";

  return (
    <>
      <Style name="borders">
        <Rule>
          <RichLineSymbolizer
            width={`[width] * ${widthFactor}`}
            color={color}
            simplify={simplify}
          />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857">
        <StyleName>borders</StyleName>

        <Datasource base="db">
          <Parameter name="geometry_table">border_lines</Parameter>
          {/* prettier-ignore */}
          <Parameter name="table">
            (
              SELECT
                width,
                ST_LineMerge(ST_Union(geometry)) AS geometry
              FROM
                (
                  (
                    SELECT
                      MAX({width}) AS width,
                      border_lines.geometry AS geometry
                    FROM
                      osm_admin_rels
                      JOIN admin_borders USING (osm_id)
                      JOIN border_lines USING (id)
                    WHERE
                      border_lines.geometry && !bbox!
                      AND {condition}{" "}
                    GROUP BY
                      border_lines.geometry
                  )
                ) AS subq
              GROUP BY
                width
            ) AS foo
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
