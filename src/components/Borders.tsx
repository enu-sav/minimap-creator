import {
  Datasource,
  Filter,
  Layer,
  Parameter,
  PolygonSymbolizer,
  Rule,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";
import { colors } from "../colors";
import { RichLineSymbolizer } from "./RichLineSymbolizer";

type Props = {
  highlight?: string | number;
  minor?: Record<string, number>;
  micro?: Record<string, number>;
  widthFactor?: number;
};

function Lower({
  value,
  ...rest
}: {
  value: Record<string, number>;
} & Parameters<typeof RichLineSymbolizer>[0]) {
  return (
    <Rule>
      <Filter>
        {Object.entries(value)
          .map(
            ([cc, level]) =>
              `([admin_level] = ${level} and [country_code] = "${cc}")`
          )
          .join(" or ")}
      </Filter>

      <RichLineSymbolizer {...rest} />
    </Rule>
  );
}

export function Borders({ highlight, minor, micro, widthFactor = 1 }: Props) {
  const condition =
    "admin_level = 2" +
    [
      ...new Set([
        ...Object.entries(minor ?? {}),
        ...Object.entries(micro ?? {}),
      ]),
    ]
      .map(
        ([cc, level]) =>
          ` OR admin_level = ${level} AND [country_code] = '${cc}'`
      )
      .join("");

  return (
    <>
      <Style name="borders">
        {highlight !== undefined && (
          <Rule>
            {isNaN(Number(highlight)) ? (
              <Filter>[name] = "{highlight}"</Filter>
            ) : (
              <Filter>[osm_id] = {highlight}</Filter>
            )}
            <PolygonSymbolizer fill={colors.areaHighlight} />
          </Rule>
        )}

        {micro && (
          <Lower
            value={micro}
            width={0.75 * widthFactor}
            color={colors.border}
          />
        )}

        {minor && (
          <Lower
            value={minor}
            width={1.5 * widthFactor}
            color={colors.border}
          />
        )}

        <Rule>
          <Filter>[admin_level] = 2</Filter>

          <RichLineSymbolizer color={colors.border} width={3 * widthFactor} />
        </Rule>
      </Style>

      <Layer name="borders" srs="+init=epsg:3857">
        <StyleName>borders</StyleName>

        <Datasource base="db">
          <Parameter name="table">
            (SELECT ogc_fid, osm_id, country_code, admin_level, name, geometry
            FROM admin_areas WHERE {condition}) AS foo
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
