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

echo "create table osm_roads_gen1_merged as (select type,class, st_linemerge(st_collect(geometry)) as geometry from osm_roads_gen1 group by type, class);" | psql -h localhost minimap minimap

ogr2ogr -F SQLITE slovakia.sqlite PG:"host=localhost port=5432 dbname=minimap user=minimap password=minimap" -dsco SPATIALITE=YES osm_roads_gen1_merged osm_places
```
