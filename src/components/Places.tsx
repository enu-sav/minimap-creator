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

const commonProps: Partial<Parameters<typeof ShieldSymbolizer>[0]> = {
  fontsetName: "regular",
  margin: 20,
  haloFill: "white",
  haloRadius: 2,
  haloOpacity: 0.75,
  unlockImage: true,
  shieldDy: 0,
};

type Props = {
  placeTypes?: string[];
};

export function Places({ placeTypes = ["city", "town"] }: Props) {
  if (placeTypes.some((p) => /[^a-z]/.test(p))) {
    throw new Error("invalid place type");
  }

  return (
    <>
      <Style name="places">
        <Rule>
          <Filter>[capital] = 'yes'</Filter>

          <ShieldSymbolizer
            {...commonProps}
            file="images/capital.svg"
            size={20}
            dy={-12}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'city' &amp;&amp; [capital] != 'yes'</Filter>

          <ShieldSymbolizer
            {...commonProps}
            file="images/city.svg"
            size={20}
            dy={-10}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'town' &amp;&amp; [capital] != 'yes'</Filter>

          <ShieldSymbolizer
            {...commonProps}
            file="images/town.svg"
            size={16}
            dy={-8}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'village' &amp;&amp; [capital] != 'yes'</Filter>

          <ShieldSymbolizer
            {...commonProps}
            file="images/village.svg"
            size={14}
            dy={-7}
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
            {`
              (
                SELECT id, coalesce(NULLIF(name_sk, ''), name) AS name, geometry, type, capital
                FROM osm_places
                WHERE
                  ${
                    placeTypes.includes("capital")
                      ? "capital = 'yes'"
                      : `type IN (${placeTypes
                          .map((p) => `'${p}'`)
                          .join(", ")})`
                  }
                ORDER BY z_order DESC, population DESC
              ) AS foo
            `}
          </Parameter>
        </Datasource>
      </Layer>
    </>
  );
}
