CREATE
OR replace FUNCTION ZRes (z INTEGER) RETURNS FLOAT RETURNS NULL ON NULL input LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
SELECT
  (40075016.6855785 /(256 * 2 ^ z));

$$;

CREATE
OR replace FUNCTION ZRes (z FLOAT) RETURNS FLOAT RETURNS NULL ON NULL input LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
SELECT
  (40075016.6855785 /(256 * 2 ^ z));

$$;

UPDATE
  osm_admin
SET
  country_code = a.country_code
FROM
  (
    SELECT
      DISTINCT ON(y.id) x.country_code,
      y.id
    FROM
      osm_admin x
      JOIN osm_admin y ON ST_intersects(x.geometry, y.geometry)
      AND x.admin_level = 2
      AND x.country_code <> ''
      AND y.admin_level > 2
    ORDER BY
      y.id,
      st_area(st_intersection(x.geometry, y.geometry)) DESC
  ) a
WHERE
  admin_level > 2
  AND a.id = osm_admin.id;

UPDATE
  osm_landusages
SET
  TYPE = (
    CASE
      WHEN TYPE IN ('scrub', 'wood', 'vineyard', 'forest') THEN 'forest'
      WHEN TYPE IN ('basin', 'reservoir', 'water') THEN 'water'
      WHEN TYPE IN (
        'cemetery',
        'commercial',
        'depot',
        'industrial',
        'quarry',
        'residential',
        'retail'
      ) THEN 'human'
      ELSE NULL
    END
  );

DROP TABLE simplify_vw_z7_;

CREATE TABLE simplify_vw_z7_ AS (
  SELECT
    type,
    ST_MakeValid(
      ST_SnapToGrid(
        ST_SimplifyVW(geometry, power(zres(9), 2)),
        0.001
      )
    ) AS geometry
  FROM
    osm_landuse
);

CREATE INDEX ON simplify_vw_z7_ USING GIST (geometry);

DROP TABLE osm_landcover_gen_z7_;

CREATE TABLE osm_landcover_gen_z7_ AS (
  SELECT
    type,
    ST_MakeValid((ST_Dump(ST_Union(geometry))).geom) AS geometry
  FROM
    (
      SELECT
        type,
        ST_ClusterDBSCAN(geometry, eps := 0, minpoints := 1) OVER () AS cid,
        geometry
      FROM
        simplify_vw_z7_
    ) union_geom
  GROUP BY
    type,
    cid
);

CREATE INDEX ON osm_landcover_gen_z7_ USING GIST (geometry);

DELETE FROM
  osm_landcover_gen_z7_
WHERE
  ST_Area(geometry) < power(zres(7), 2);

ALTER TABLE
  osm_landcover_gen_z7_
ALTER column
  "type" TYPE VARCHAR(8);
