
#!/bin/bash

if [ $# -ne 6 ]; then
  echo "Usage: $0 <name> <source_object_id> <sink_object_id> <parent_source_object_id> <parent_sink_object_id>"
  exit 1
fi


NAME=$1 # eg. hornad
BASIN=$2 # eg. danube
SOURCE_OBJECT_ID=$3 # eg. RL35142907
SINK_OBJECT_ID=$4 # eg. RL35137645
PARENT_SOURCE_OBJECT_ID=$5 # eg. RL35142029
PARENT_SINK_OBJECT_ID=$6 # eg. RL35142029

ogr2ogr -sql "WITH RECURSIVE cte(objectid, object_id, shape, strahler) AS (
      SELECT
         objectid, object_id, shape, strahler
      FROM
         River_Net_l
      WHERE
         object_id = '$SINK_OBJECT_ID'
      UNION ALL SELECT
         River_Net_l.objectid, River_Net_l.object_id, River_Net_l.shape, River_Net_l.strahler
      FROM
         cte, River_Net_l
      WHERE
         River_Net_l.nextdownid = cte.object_id
   )
   SELECT objectid, shape, strahler FROM cte" -dsco SPATIALITE=YES -nln waterways_${NAME} waterways_${NAME}.sqlite euhydro_${BASIN}_v013.gpkg &

ogr2ogr -sql "WITH RECURSIVE cte(objectid, object_id, shape, strahler, nextdownid) AS (
      SELECT
         objectid, object_id, shape, strahler, nextdownid
      FROM
         River_Net_l
      WHERE
         object_id = '$SOURCE_OBJECT_ID'
      UNION ALL SELECT
         River_Net_l.objectid, River_Net_l.object_id, River_Net_l.shape, River_Net_l.strahler, River_Net_l.nextdownid
      FROM
         cte, River_Net_l
      WHERE
         cte.nextdownid = River_Net_l.object_id AND River_Net_l.object_id <> (SELECT nextdownid FROM River_Net_l WHERE object_id = '$SINK_OBJECT_ID')
   )
   SELECT objectid, shape, strahler FROM cte" -dsco SPATIALITE=YES -nln waterways_${NAME} waterways_${NAME}_main.sqlite euhydro_${BASIN}_v013.gpkg &

ogr2ogr -sql "WITH RECURSIVE cte(objectid, object_id, shape, strahler, nextdownid) AS (
      SELECT
         objectid, object_id, shape, strahler, nextdownid
      FROM
         River_Net_l
      WHERE
         object_id = '$PARENT_SOURCE_OBJECT_ID'
      UNION ALL SELECT
         River_Net_l.objectid, River_Net_l.object_id, River_Net_l.shape, River_Net_l.strahler, River_Net_l.nextdownid
      FROM
         cte, River_Net_l
      WHERE
         cte.nextdownid = River_Net_l.object_id AND River_Net_l.object_id <> (SELECT nextdownid FROM River_Net_l WHERE object_id = '$PARENT_SINK_OBJECT_ID')
   )
   SELECT objectid, shape, strahler FROM cte" -dsco SPATIALITE=YES -nln waterways_${NAME} waterways_${NAME}_parent.sqlite euhydro_${BASIN}_v013.gpkg &

wait
