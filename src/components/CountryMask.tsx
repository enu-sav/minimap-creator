import { Datasource, Layer, Parameter, StyleName } from "jsxnik/mapnikConfig";

type Props = { country: string; sourceSimplifyFactor: number };

export function CountryMask({ country, sourceSimplifyFactor }: Props) {
  return (
    <Layer srs="+init=epsg:3857" compOp="dst-out">
      <StyleName>mask</StyleName>

      <Datasource base="db">
        <Parameter name="geometry_table">border_lines</Parameter>
        {/* prettier-ignore */}
        <Parameter name="table">
          (
            SELECT
              ST_Intersection(
                (
                  SELECT
                    ST_Union(ST_SimplifyPreserveTopology(wkb_geometry, {sourceSimplifyFactor}))
                  FROM
                    simplified_land_polygons
                  WHERE
                    wkb_geometry && !bbox!
                ),
                (
                  SELECT
                    ST_BuildArea(ST_Union(ST_SimplifyPreserveTopology(border_lines.geometry, {sourceSimplifyFactor})))
                  FROM
                    osm_admin_rels
                    JOIN admin_borders USING (osm_id)
                    JOIN border_lines USING (id)
                  WHERE
                    admin_level = 2
                    AND country_code = '{country}'
                )
              ) AS geometry
          ) AS foo
        </Parameter>
      </Datasource>
    </Layer>
  );
}
