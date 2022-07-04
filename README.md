
## Runing

```bash
npm i
PORT=8080 node .
```

## Map generation

Exmaples:
```bash
curl http://'localhost:8080?features=kraje&krajId=4' | display
```
```bash
curl http://'localhost:8080?features=kraje,okresy&okresId=204' | display
```
```bash
curl http://'localhost:8080?features=kraje,okresy&lat=48.5&lon=19.1' | display
```
```bash
curl http://'localhost:8080?features=kraje,okresy&lat=48.5&lon=19.1?format=svg' > map.svg
```

Supported formats: `png`, `jpeg`, `svg`, `pdf`

## Notes

Generating geodata from https://www.geoportal.sk/sk/zbgis/na-stiahnutie/ ("Tretia úroveň generalizácie" is enough)

```bash
for layer of ku_3 obec_3 okres_3 kraj_3 sr_3; do
  ogr2ogr -t_srs epsg:3857 -f 'geojson' $layer.geojson USJ_hranice_3.gpkg $layer
done
```
