## Building

```bash
npm i
npm run build
```

## Runing

```bash
PORT=8080 npm start
```

## Map generation

Query parameters, all are optional:

- `lat`, `lon` - pin latitude and longitude, default no pin
- `width`, `height` - image dimensions, default 800x400
- `scale` - graphics scaling factor, default 1
- `features` - comma separated features: `regions`, `districts`, `roads`, `cities`
- `regionId` - ID of the region to highlight
- `districtId` - ID of the district to highlight
- `placeId` - ID of the place (obec) for the pin
- `format` - output format, one of `png` (default), `jpeg`, `svg`, `pdf`

Examples:

```bash
curl 'http://localhost:8080?features=regions&regionId=4' | display
```

```bash
curl 'http://localhost:8080?features=regions,districts&districtId=204' | display
```

```bash
curl 'http://localhost:8080?features=regions,cities,roads&lat=48.5&lon=19.1' | display
```

```bash
curl 'http://localhost:8080?features=regions,cities,roads&placeId=522422' | display
```

```bash
curl 'http://localhost:8080?features=regions,cities,roads&placeId=522422&scale=1&width=1200&height=600' | display
```

```bash
curl 'http://localhost:8080?features=regions,districts&format=svg' > map.svg
```

Generated map must be enclosed with the following attribution:

- borders: GKÚ Bratislava (CC-BY 4.0)
- other map features: OpenStreetMap contributors (ODbL 1.0)

## Notes

### Preparing borders

Obtain source data from https://www.geoportal.sk/sk/zbgis/na-stiahnutie/ ("Tretia úroveň generalizácie" is enough):

```bash
for layer of ku_3 obec_3 okres_3 kraj_3 sr_3; do
  ogr2ogr -t_srs epsg:3857 -f 'geojson' $layer.geojson USJ_hranice_3.gpkg $layer
done
```

### Preparing data for Slovakia

Obtain source data from http://download.geofabrik.de/europe/slovakia.html.

```bash
imposm import -connection postgis://minimap:minimap@localhost/minimap -mapping mapping.yaml -read slovakia-latest.osm.pbf -write -overwritecache
imposm import -connection postgis://minimap:minimap@localhost/minimap -mapping mapping.yaml -deployproduction

echo "create table osm_roads_gen1_merged as (select type,class, st_linemerge(st_collect(geometry)) as geometry from osm_roads_gen1 group by type, class);" | psql -h localhost minimap minimap


ogr2ogr -F SQLITE slovakia.sqlite PG:"host=localhost port=5432 dbname=minimap user=minimap password=minimap" -dsco SPATIALITE=YES osm_roads_gen1_merged osm_places
```

v.in.ogr input="PG:host=localhost dbname=minimap user=minimap password=minimap" layer=osm_admin output=admin
v.generalize --overwrite input=admin output=admin_gen20 method=douglas threshold=20
v.generalize --overwrite input=admin_gen20 output=admin_gen100 method=douglas threshold=100
v.generalize --overwrite input=admin_gen100 output=admin_gen500 method=douglas threshold=500
v.extract input=admin_gen500 where=admin_level=2 output=adm2 dissolve_column=osm_id -d --overwrite
v.extract input=admin_gen500 where=admin_level=3 output=adm3 dissolve_column=osm_id -d --overwrite
v.extract input=admin_gen500 where=admin_level=4 output=adm4 dissolve_column=osm_id -d --overwrite
v.extract input=admin_gen500 where=admin_level=5 output=adm5 dissolve_column=osm_id -d --overwrite
v.extract input=admin_gen500 where=admin_level=6 output=adm6 dissolve_column=osm_id -d --overwrite
v.extract input=admin_gen500 where=admin_level=7 output=adm7 dissolve_column=osm_id -d --overwrite
v.extract input=admin_gen500 where=admin_level=8 output=adm8 dissolve_column=osm_id -d --overwrite
v.extract input=admin_gen500 where=admin_level=9 output=adm9 dissolve_column=osm_id -d --overwrite
v.extract input=admin_gen500 where=admin_level=10 output=adm10 dissolve_column=osm_id -d --overwrite
v.extract input=admin_gen500 where=admin_level=11 output=adm11 dissolve_column=osm_id -d --overwrite
v.out.ogr input=adm2 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin format=PostgreSQL
v.out.ogr input=adm3 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin format=PostgreSQL -a
v.out.ogr input=adm4 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin format=PostgreSQL -a
v.out.ogr input=adm5 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin format=PostgreSQL -a
v.out.ogr input=adm6 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin format=PostgreSQL -a
v.out.ogr input=adm7 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin format=PostgreSQL -a
v.out.ogr input=adm8 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin format=PostgreSQL -a
v.out.ogr input=adm9 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin format=PostgreSQL -a
v.out.ogr input=adm10 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin format=PostgreSQL -a
v.out.ogr input=adm11 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin format=PostgreSQL -a

ogr2ogr -f "GPKG" admin.gpkg PG:"dbname='minimap' host='localhost' port=5432 user='minimap' password='minimap'" -nln 'admin' -sql "SELECT \* FROM backup.osm_admin where admin_level = 9;"
java -jar regionsimplify-1.4.1/RegionSimplify.jar -i admin.gpkg -s 9244649

https://github.com/eurostat/RegionSimplify
https://gis.stackexchange.com/questions/439271/simplify-multipolygon-removing-small-gaps-in-postgis/439274
https://gadm.org/
