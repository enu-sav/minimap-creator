CREATE
OR replace FUNCTION ZRes (z INTEGER) RETURNS FLOAT RETURNS NULL ON NULL input LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $ $
SELECT
  (40075016.6855785 /(256 * 2 ^ z));

$ $;

CREATE
OR replace FUNCTION ZRes (z FLOAT) RETURNS FLOAT RETURNS NULL ON NULL input LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $ $
SELECT
  (40075016.6855785 /(256 * 2 ^ z));

$ $;

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
      JOIN osm_admin y ON ST_Intersects(x.geometry, y.geometry)
      AND x.admin_level = 2
      AND x.country_code <> ''
      AND y.admin_level > 2
    ORDER BY
      y.id,
      ST_Area(ST_Intersection(x.geometry, y.geometry)) DESC
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
      ) THEN 'urban'
      ELSE NULL
    END
  );

DROP TABLE simplify_landcover;

CREATE TABLE simplify_landcover AS (
  SELECT
    type,
    ST_MakeValid(
      ST_SnapToGrid(
        ST_SimplifyVW(geometry, power(zres(9), 2)),
        0.001
      )
    ) AS geometry
  FROM
    osm_landusages
);

CREATE INDEX ON simplify_landcover USING GIST (geometry);

DROP TABLE landcover;

CREATE TABLE landcover AS (
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
        simplify_landcover
    ) union_geom
  GROUP BY
    type,
    cid
);

CREATE INDEX ON landcover USING GIST (geometry);

DELETE FROM
  landcover
WHERE
  ST_Area(geometry) < power(zres(7), 2);

ALTER TABLE
  landcover
ALTER column
  "type" TYPE VARCHAR(8);

CREATE TABLE roads AS (
  SELECT
    type,
    ST_Simplify(ST_Linemerge(ST_Collect(geometry)), 100) AS geometry
  FROM
    (
      SELECT
        type,
        ST_ClusterDBSCAN(geometry, eps := 0, minpoints := 1) OVER () AS cid,
        geometry
      FROM
        osm_roads
    ) foo
  GROUP BY
    type,
    cid
);

CREATE INDEX roads_geom ON roads USING gist(geometry);

ALTER TABLE
  roads
ADD
  COLUMN ogc_fid SERIAL PRIMARY KEY;

ALTER TABLE
  landcover
ADD
  COLUMN ogc_fid SERIAL PRIMARY KEY;

ALTER TABLE
  osm_admin
ADD
  COLUMN ogc_fid SERIAL PRIMARY KEY;

CREATE temporary TABLE cc AS
SELECT
  osm_places.osm_id,
  osm_admin.country_code
FROM
  osm_places
  LEFT JOIN osm_admin ON ST_Contains(osm_admin.geometry, osm_places.geometry)
WHERE
  admin_level = 2;

CREATE INDEX cc_idx ON cc (osm_id);

ALTER TABLE
  osm_places
ADD
  column country_code CHAR(2);

UPDATE
  osm_places
SET
  country_code = (
    SELECT
      MAX(country_code)
    FROM
      cc
    WHERE
      osm_places.osm_id = cc.osm_id
    GROUP BY
      cc.osm_id
  );

-- comment out following lines to disable transliteration feature
-- first compile and install transliterate function from https://github.com/imagico/openstreetmap-carto-german/tree/master/utf8translit
CREATE FUNCTION transliterate(text) RETURNS text AS '$libdir/utf8translit',
'transliterate' LANGUAGE C STRICT;

ALTER TABLE
  osm_places
ADD
  column name_trl VARCHAR;

UPDATE
  osm_places
SET
  name_trl = CASE
    WHEN transliterate(name) = name THEN NULL
    ELSE initcap(transliterate(name))
  END;

-- end of transliteration support
CREATE temporary table tmp_admin_members as (
  SELECT
    geometry,
    array_agg(
      osm_id
      ORDER BY
        osm_id
    ) AS osm_ids
  FROM
    osm_admin_members
  WHERE
    member_type = 1
  GROUP BY
    member_id,
    geometry
);

CREATE TABLE border_lines AS (
  SELECT
    ST_SimplifyPreserveTopology(ST_LineMerge(ST_Union(geometry)), 100) AS geometry,
    osm_ids
  FROM
    tmp_admin_members
  GROUP BY
    osm_ids
);

ALTER TABLE
  border_lines
ADD
  COLUMN id SERIAL;

CREATE TABLE admin_borders AS
SELECT
  unnest(osm_ids) AS osm_id,
  id
FROM
  border_lines;

ALTER TABLE
  border_lines DROP COLUMN osm_ids;

CREATE INDEX border_lines_id_idx ON border_lines(id);

CREATE INDEX border_lines_geom_idx ON border_lines USING gist(geometry);

CREATE INDEX admin_borders_osm_id_idx ON admin_borders(osm_id);

CREATE INDEX admin_borders_id_idx ON admin_borders(id);

CREATE TABLE osm_admin_rels AS
SELECT
  osm_id,
  name,
  name_sk,
  admin_level,
  country_code
FROM
  osm_admin;

CREATE INDEX admin_borders_id_idx ON admin_borders(id);

CREATE INDEX osm_admin_rels_osm_id_idx ON osm_admin_rels(osm_id);

CREATE INDEX osm_admin_rels_name_idx ON osm_admin_rels(name);

CREATE INDEX osm_admin_rels_name_sk_idx ON osm_admin_rels(name_sk);

CREATE INDEX osm_admin_rels_admin_level_idx ON osm_admin_rels(admin_level);

CREATE INDEX osm_admin_rels_country_code_idx ON osm_admin_rels(country_code);
