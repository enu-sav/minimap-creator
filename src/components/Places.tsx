import {
  Datasource,
  DebugSymbolizer,
  Filter,
  Layer,
  Parameter,
  Rule,
  ShieldSymbolizer,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

const commonProps: Partial<Parameters<typeof ShieldSymbolizer>[0]> = {
  fontsetName: "regular",
  margin: 0,
  haloFill: "white",
  haloRadius: 2,
  haloOpacity: 0.75,
  unlockImage: true,
  dy: -10,
  shieldDy: 0,
};

export function Places() {
  return (
    <>
      <Style name="places">
        <Rule>
          <Filter>[type] = 'city' &amp;&amp; [capital] = 'yes'</Filter>

          <ShieldSymbolizer
            {...commonProps}
            file="images/capital.svg"
            size={20}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'city'</Filter>

          <ShieldSymbolizer {...commonProps} file="images/city.svg" size={20}>
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'town'</Filter>

          <ShieldSymbolizer {...commonProps} file="images/town.svg" size={16}>
            [name]
          </ShieldSymbolizer>
        </Rule>
      </Style>

      <Layer name="places" srs="+init=epsg:3857">
        <StyleName>places</StyleName>

        <Datasource base="db">
          <Parameter name="key_field">id</Parameter>

          <Parameter name="table">
            (SELECT id, coalesce(NULLIF(name_sk, ''), name) AS name, geometry,
            type, capital FROM osm_places ORDER BY z_order DESC, population
            DESC) AS foo
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
