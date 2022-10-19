# Minimap Creator

Minimap Creator is a HTTP server for creating minimaps.

![Slovakia, Košický región](sample.png)

## Preparation

1. clone the project
1. [download map data](https://drive.google.com/file/d/1r1l2KTpI1ksuoRiyakHRi9GXlJB4Je1D/view?usp=sharing) or prepare it on your own (see Nodes below) and put it to the project directory
1. [download simplified land polygons](https://osmdata.openstreetmap.de/download/simplified-land-polygons-complete-3857.zip) and unpack it to project directory
1. install dependencies
   ```bash
   npm i
   ```
1. build the project
   ```bash
   npm run build
   ```
1. start the server
   ```bash
   PORT=8080 npm start
   ```

## Map generation

Query parameters, all are optional:

- `lat`, `lon` - pin latitude and longitude, default no pin
- `width` - image width, default 800, or computed from `country` and `height` if specified
- `height` - image height, default 400, or computed from `country` and `width` if specified
- `scale` - graphics scaling factor, default 1
- `features` - comma separated features:
  - `regions` - Slovakia regions
  - `districts` - Slovakia districts
  - `roads` - roads
  - `borders` - global borders (admin_level=2 for country borders, admin_level=4 for region borders); see https://wiki.openstreetmap.org/wiki/Tag:boundary=administrative#10_admin_level_values_for_specific_countries
  - `cities` - show places of type `city` and `town`. Deprecated, use `place-types`.
  - `landcover` - forests, water bodies, urban areas
- `place-types` - which places to render, comma separated values of: `city`, `town`, `village`. It can also contain a single value `capital` to only display capitals.
- `country` - country to zoom to and to highlight
- `regionId` - ID of the region to highlight (Slovakia only)
- `districtId` - ID of the district to highlight (Slovakia only)
- `placeId` - ID of the place (obec) for the pin (Slovakia only)
- `minor-borders` - country codes and _admin levels_ to show as minor borders, format: `cc:level,cc:level,...`
- `micro-borders` - country codes and _admin levels_ to show as micro borders, format: `cc:level,cc:level,...`
- `border-width-factor` - scale of the borders width, default 1
- `highlight-admin-area` - OSM ID or name of the area to highlight
- `bbox` - explicit bounding box to render (minLon,minLat,maxLon,maxLat)
- `margin` - map margin in pixels, default 5
- `format` - output format, one of `png` (default), `jpeg`, `svg`, `pdf`

Examples:

```bash
curl 'http://localhost:8080?country=sk&features=regions&regionId=4' | display
```

```bash
curl 'http://localhost:8080?country=sk&features=regions,districts&districtId=204' | display
```

```bash
curl 'http://localhost:8080?country=sk&features=regions,cities,roads&lat=48.5&lon=19.1' | display
```

```bash
curl 'http://localhost:8080?country=sk&features=regions,cities,roads&placeId=522422' | display
```

```bash
curl 'http://localhost:8080?country=sk&features=regions,cities,roads&placeId=522422&scale=1&width=1200&height=600' | display
```

```bash
curl 'http://localhost:8080?country=sk&features=regions,districts&format=svg' > map.svg
```

```bash
curl -G 'http://localhost:8080' \
  --data-urlencode "features=borders,landcover,roads" \
  --data-urlencode "placeId=522422" \
  --data-urlencode "country=sk" \
  --data-urlencode "width=1200" \
  --data-urlencode "scale=1" \
  --data-urlencode "margin=20" \
  --data-urlencode "minor-borders=hu:4,uk:4,at:4,pl:4,sk:4,cz:4" \
  --data-urlencode "micro-borders=sk:8" \
  --data-urlencode "place-types=city,town" \
  --data-urlencode "highlight-admin-area=Prešovský kraj" | display
```

Generated map must be enclosed with the following attribution:

- borders: GKÚ Bratislava (CC-BY 4.0) (only if Slovakia borders from www.geoportal.sk is used)
- other map features: OpenStreetMap contributors (ODbL 1.0)

## Notes

### Preparing Slovakia borders

Obtain source data from https://www.geoportal.sk/sk/zbgis/na-stiahnutie/ ("Tretia úroveň generalizácie" is enough):

```bash
for layer of ku_3 obec_3 okres_3 kraj_3 sr_3; do
  ogr2ogr -t_srs epsg:3857 -f 'geojson' $layer.geojson USJ_hranice_3.gpkg $layer
done
```

### Preparing map data

1. Obtain latest [planet.osm.pbf](https://planet.openstreetmap.org/pbf/planet-latest.osm.pbf) from planet.openstreetmap.org.
1. Import the data:
   ```bash
   imposm import -connection postgis://minimap:minimap@localhost/minimap -mapping mapping.yaml -read slovakia-latest.osm.pbf -write -overwritecache
   imposm import -connection postgis://minimap:minimap@localhost/minimap -mapping mapping.yaml -deployproduction
   ```
1. Process the data with GRASS GIS using the following script:
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
   ```
1. Process the data in PostGIS:
   ```bash
   psql -h localhost minimap minimap < process.sql
   ```
1. Export the data from PostGIS to `map.sqlite`:
   ```
   ogr2ogr -F SQLITE map.sqlite PG:"host=localhost port=5432 dbname=minimap user=minimap password=minimap" -dsco SPATIALITE=YES roads osm_places admin_areas landcover
   ```

### More resources / ideas

- https://github.com/eurostat/RegionSimplify
  - java -jar regionsimplify-1.4.1/RegionSimplify.jar -i admin.gpkg -s 9244649
- https://gis.stackexchange.com/questions/439271/simplify-multipolygon-removing-small-gaps-in-postgis/439274
- https://gadm.org/
