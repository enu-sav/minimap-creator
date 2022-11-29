
#!/bin/bash

if [ $# -ne 2 ]; then
  echo "Usage: $0 <name> <basin_object_id>"
  exit 1
fi


NAME=$1 # eg. hornad
BASIN_OBJECT_ID=$2 # eg. RL35137645

ogr2ogr -sql "WITH RECURSIVE cte(objectid, object_id, shape, strahler) AS (
      SELECT
         objectid, object_id, shape, strahler
      FROM
         River_Net_l
      WHERE
         object_id = '${BASIN_OBJECT_ID}'
      UNION ALL SELECT
         River_Net_l.objectid, River_Net_l.object_id, River_Net_l.shape, River_Net_l.strahler
      FROM
         cte, River_Net_l
      WHERE
         River_Net_l.nextdownid = cte.object_id
   )
   SELECT objectid, shape, strahler FROM cte" -dsco SPATIALITE=YES -nln waterways_${NAME} waterways_${NAME}.sqlite euhydro_danube_v013.gpkg

ogr2ogr -sql "WITH RECURSIVE cte(objectid, object_id, shape, strahler, nextdownid) AS (
      SELECT
         objectid, object_id, shape, strahler, nextdownid
      FROM
         River_Net_l
      WHERE
         object_id = 'RL35142907'
      UNION ALL SELECT
         River_Net_l.objectid, River_Net_l.object_id, River_Net_l.shape, River_Net_l.strahler, River_Net_l.nextdownid
      FROM
         cte, River_Net_l
      WHERE
         cte.nextdownid = River_Net_l.object_id AND River_Net_l.object_id <> (SELECT nextdownid FROM River_Net_l WHERE object_id= '${BASIN_OBJECT_ID}')
   )
   SELECT objectid, shape, strahler FROM cte" -dsco SPATIALITE=YES -nln waterways_${NAME} waterways_${NAME}_main.sqlite euhydro_danube_v013.gpkg
