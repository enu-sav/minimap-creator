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

type Props = {
  placeTypes?: string[];
  sizeFactor?: number;
};

export function Places({
  placeTypes = ["city", "town"],
  sizeFactor = 1,
}: Props) {
  if (placeTypes.some((p) => /[^a-z]/.test(p))) {
    throw new Error("invalid place type");
  }

  const commonProps: Partial<Parameters<typeof ShieldSymbolizer>[0]> = {
    fontsetName: "regular",
    margin: 20,
    haloFill: "white",
    haloRadius: 2 * sizeFactor,
    haloOpacity: 0.75,
    unlockImage: true,
    shieldDy: 0,
  };

  return (
    <>
      <Style name="places">
        <Rule>
          <Filter>[capital] = 'yes'</Filter>

          <ShieldSymbolizer
            {...commonProps}
            file="images/capital.svg"
            transform={`scale(${sizeFactor})`}
            size={20 * sizeFactor}
            dy={-12 * sizeFactor}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'city' &amp;&amp; [capital] != 'yes'</Filter>

          <ShieldSymbolizer
            {...commonProps}
            file="images/city.svg"
            transform={`scale(${sizeFactor})`}
            size={20 * sizeFactor}
            dy={-10 * sizeFactor}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'town' &amp;&amp; [capital] != 'yes'</Filter>

          <ShieldSymbolizer
            {...commonProps}
            file="images/town.svg"
            transform={`scale(${sizeFactor})`}
            size={16 * sizeFactor}
            dy={-8 * sizeFactor}
          >
            [name]
          </ShieldSymbolizer>
        </Rule>

        <Rule>
          <Filter>[type] = 'village' &amp;&amp; [capital] != 'yes'</Filter>

          <ShieldSymbolizer
            {...commonProps}
            file="images/village.svg"
            transform={`scale(${sizeFactor})`}
            size={14 * sizeFactor}
            dy={-7 * sizeFactor}
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
