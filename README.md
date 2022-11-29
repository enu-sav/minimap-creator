# Minimap Creator

Minimap Creator is a HTTP server for creating minimaps.

![Slovakia, Košický región](sample.png)

## Preparation

1. clone the project
1. [download map data](https://drive.google.com/drive/folders/1nSxT4YOUBVoU_7Dt-qbiwodZmCSelP8f?usp=sharing) or prepare it on your own (see Nodes below) and put it to the project directory
1. [download simplified land polygons](https://osmdata.openstreetmap.de/download/simplified-land-polygons-complete-3857.zip) and unpack it to project directory
1. save hillshading data as `hillshading.tif` (and `hillshading.tif.ovr`)
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
  - `roads` - roads
  - `borders` - global borders (admin_level=2 for country borders, admin_level=4 for region borders); see https://wiki.openstreetmap.org/wiki/Tag:boundary=administrative#10_admin_level_values_for_specific_countries
  - `cities` - show places of type `city` and `town`. Deprecated, use `place-types`.
  - `landcover` - forests, water bodies, urban areas
- `place-types` - which places to render, comma separated values of: `city`, `town`, `village`. It can also contain a single value `capital` to only display capitals.
- `country` - country to zoom to and to highlight
- `major-borders` - country codes and _admin levels_ to show as major borders, format: `cc:level,cc:level,...`; default `:2` (`admin_level=2` for every country)
- `minor-borders` - country codes and _admin levels_ to show as minor borders, format: `cc:level,cc:level,...`
- `micro-borders` - country codes and _admin levels_ to show as micro borders, format: `cc:level,cc:level,...`
- `border-width-factor` - scale of the borders width, default 1
- `highlight-admin-area` - OSM ID or name (local or slovak) of the area to highlight
- `hillshading-opacity` - opacity of the hillshading in range from 0 (no shading, default) to 1 (full shading)
- `watershed-name` - name of watershed to render
- `bbox` - explicit bounding box to render (minLon,minLat,maxLon,maxLat)
- `margin` - map margin in pixels, default 5
- `format` - output format, one of `png` (default), `jpeg`, `svg`, `pdf`

Examples:

Highlight administrative area and show place marker:

```bash
curl 'http://localhost:8080?features=borders,landcover,roads&placeId=522422&country=sk&width=1200&scale=1&margin=20&minor-borders=hu:4,uk:4,at:4,pl:4,sk:4,cz:4&micro-borders=sk:8&place-types=city,town&highlight-admin-area=Ko%C5%A1ick%C3%BD%20kraj&hillshading-opacity=0.5' | display
```

Watershed _Hornád_:

```bash
curl 'http://localhost:8080?features=borders,landcover&country=sk&width=1200&scale=1&margin=20&minor-borders=hu:4,uk:4,at:4,pl:4,sk:4,cz:4&micro-borders=sk:8&place-types=city,town&hillshading-opacity=0.5&watershed-name=hornad' | display
```

Generated map must be enclosed with the following attribution: _OpenStreetMap contributors (ODbL 1.0)_

## Notes

### Preparing map data

1. Obtain latest [planet.osm.pbf](https://planet.openstreetmap.org/pbf/planet-latest.osm.pbf) from planet.openstreetmap.org.
1. Import the data:
   ```bash
   imposm import -connection postgis://minimap:minimap@localhost/minimap -mapping mapping.yaml -read europe-latest.osm.pbf -write -overwritecache
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
   ```bash
   ogr2ogr -F SQLITE map.sqlite PG:"host=localhost port=5432 dbname=minimap user=minimap password=minimap" -dsco SPATIALITE=YES roads osm_places admin_areas landcover
   ```

### Watershed

Download geopackage(s) from https://land.copernicus.eu/imagery-in-situ/eu-hydro/eu-hydro-river-network-database?tab=download (for example _EU-Hydro-Danube-GeoPackage_)

Extract waterways of a watershed for a particular river - find its last segment `object_id`. For _Hornád_ it is `RL35137645`, _Bodva_ `RL35139104`, _Slaná (Sajó)_ `RL35136833`.

```bash
scripts/gen_waterways.sh hornad RL35137645
```

Make watershed polygon:

1. FlowAccumulationFullWorkflow
1. ExtractStreams (100000)
1. add point to sink
1. Watershed
1. Polygonnize (gdal)
1. SmoothVectors (10)
1. Simplify (10)

### More resources / ideas

- https://github.com/eurostat/RegionSimplify
  - java -jar regionsimplify-1.4.1/RegionSimplify.jar -i admin.gpkg -s 9244649
- https://gis.stackexchange.com/questions/439271/simplify-multipolygon-removing-small-gaps-in-postgis/439274
- https://gadm.org/
