create
or replace function ZRes (z integer) returns float returns null on null input language sql immutable parallel safe as $ func $
select
  (40075016.6855785 /(256 * 2 ^ z));

$ func $;

create
or replace function ZRes (z float) returns float returns null on null input language sql immutable parallel safe as $ func $
select
  (40075016.6855785 /(256 * 2 ^ z));

$ func $;

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

alter table
  osm_landuse
alter column
  "type" type varchar(8);
