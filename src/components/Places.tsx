import {
  Datasource,
  Filter,
  Layer,
  Parameter,
  Rule,
  ShieldSymbolizer,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

export function Places() {
  return (
    <>
      <Style name="places">
        <Rule>
          <Filter>[type] = 'city' &amp;&amp; [capital] = 'yes'</Filter>

          <ShieldSymbolizer
            fontsetName="regular"
            file="images/capital.svg"
            margin={20}
            size={20}
            haloFill="white"
            haloRadius={2}
            haloOpacity={0.75}
            unlockImage={true}
            dy={-10}
            shieldDy={0}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'city'</Filter>

          <ShieldSymbolizer
            fontsetName="regular"
            file="images/city.svg"
            margin={20}
            size={20}
            haloFill="white"
            haloRadius={2}
            haloOpacity={0.75}
            unlockImage={true}
            dy={-10}
            shieldDy={0}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'town'</Filter>

          <ShieldSymbolizer
            fontsetName="regular"
            file="images/town.svg"
            margin={20}
            size={16}
            haloFill="white"
            haloRadius={2}
            haloOpacity={0.75}
            unlockImage={true}
            dy={-10}
            shieldDy={0}
          >
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
