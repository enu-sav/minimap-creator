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
      ) THEN 'human' -- TODO rename to urban
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
    st_simplify(st_linemerge(st_collect(geometry)), 100) AS geometry
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

CREATE TABLE admin_areas AS
SELECT
  osm_id,
  cat,
  name,
  name_sk,
  admin_level,
  country_code,
  wkb_geometry AS geometry
FROM
  admin;

CREATE INDEX admin_areas_geom ON admin_areas USING gist(geometry);

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
  admin_areas
ADD
  COLUMN ogc_fid SERIAL PRIMARY KEY;

CREATE temporary TABLE cc AS
SELECT
  osm_places.osm_id,
  admin_areas.country_code
FROM
  osm_places
  LEFT JOIN admin_areas ON ST_Contains(admin_areas.geometry, osm_places.geometry)
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
create temporary table am as (
  select
    member_id,
    geometry,
    array_agg(osm_id) as osm_ids
  from
    osm_admin_members
  where
    member_type = 1
  group by
    member_id,
    geometry
);

create table aaa as (
  select
    st_linemerge(st_union(geometry)) as geometry,
    osm_ids
  from
    am
  group by
    osm_ids
);

alter table
  aaa
add
  column id serial;

create table bbb as
select
  unnest(osm_ids) as osm_id,
  id
from
  aaa;

-- TODO drop aaa.osm_ids
create index admin_areas_osm_id_idx on admin_areas(osm_id);

create index aaa_id_idx on aaa(id);

create index aaa_geom_idx on aaa using gist(geometry);

create index bbb_osm_id_idx on bbb(osm_id);

create table aaa1 as
select
  id,
  ST_SimplifyPreserveTopology(geometry, 100) as geometry
from
  aaa;

create index aaa1_id_idx on aaa1(id);

create index aaa1_geom_idx on aaa1 using gist(geometry);
