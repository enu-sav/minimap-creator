import { Datasource, Layer, Parameter, StyleName } from "jsxnik/mapnikConfig";

type Props = { country: string };

export function CountryMask({ country }: Props) {
  // TODO make buffer size dynamic

  return (
    <Layer srs="+init=epsg:3857" compOp="dst-out">
      <StyleName>mask</StyleName>

      <Datasource base="db">
        {/* prettier-ignore */}
        <Parameter name="table">
          (
            SELECT
              ST_Buffer(
                ST_Intersection(
                  (
                    SELECT
                      ST_Union(wkb_geometry)
                    FROM
                      simplified_land_polygons
                    WHERE
                      wkb_geometry && !bbox!
                  ),
                  (
                    SELECT
                      ST_BuildArea(ST_Union(aaa1.geometry)) AS geometry
                    FROM
                      admin_areas
                      JOIN bbb USING (osm_id)
                      JOIN aaa1 USING (id)
                    WHERE
                      admin_level = 2
                      AND country_code = '{country}'
                  )
                ),
                1000
              ) AS geometry
          ) AS foo
        </Parameter>
      </Datasource>
    </Layer>
  );
}
