v.in.ogr input="PG:host=localhost dbname=minimap user=minimap password=minimap" layer=osm_admin output=admin
v.generalize --overwrite input=admin output=admin_gen500 method=douglas threshold=500
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

v.to.lines input=adm2 output=adm2_lines --overwrite
v.out.ogr output_type=line input=adm2_lines type=line layer=2 output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL


v.out.ogr output_type=line input=adm2 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL
v.out.ogr output_type=line input=adm3 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL -a
v.out.ogr output_type=line input=adm4 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL -a
v.out.ogr output_type=line input=adm5 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL -a
v.out.ogr output_type=line input=adm6 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL -a
v.out.ogr output_type=line input=adm7 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL -a
v.out.ogr output_type=line input=adm8 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL -a
v.out.ogr output_type=line input=adm9 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL -a
v.out.ogr output_type=line input=adm10 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL -a
v.out.ogr output_type=line input=adm11 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_ls format=PostgreSQL -a




v.out.ogr input=adm2 type=area output="PG:host=localhost dbname=minimap user=minimap password=minimap" output_layer=admin_TMP format=PostgreSQL
