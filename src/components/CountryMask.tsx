import { Datasource, Layer, Parameter, StyleName } from "jsxnik/mapnikConfig";

type Props = { country: string; sourceSimplifyFactor: number };

export function CountryMask({ country, sourceSimplifyFactor }: Props) {
  return (
    <Layer srs="+init=epsg:3857" compOp="dst-out">
      <StyleName>mask</StyleName>

      <Datasource base="db">
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
                    ST_BuildArea(ST_Union(ST_SimplifyPreserveTopology(aaa1.geometry, {sourceSimplifyFactor})))
                  FROM
                    admin_areas
                    JOIN bbb USING (osm_id)
                    JOIN aaa1 USING (id)
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
