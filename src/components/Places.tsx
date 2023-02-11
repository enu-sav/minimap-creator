import {
  Datasource,
  Filter,
  Layer,
  Parameter,
  Placement,
  Rule,
  ShieldSymbolizer,
  Style,
  StyleName,
} from "jsxnik/mapnikConfig";

type Props = {
  places: string[];
  placeTypes: string[];
  placements?: string;
  sizeFactor?: number;
  countryCode?: string;
  transliterate?: boolean;
};

type PlaceProps = {
  placements?: string;
  icon: string;
  sizeFactor: number;
  size: number;
  dy: number;
};

function Place({ dy, size, icon, sizeFactor, placements = "U" }: PlaceProps) {
  const placementParams: Record<
    string,
    { dy: number; children: string; horizontalAlignment: string }
  > = {
    U: {
      dy: -dy * sizeFactor,
      children: "[name]",
      horizontalAlignment: "auto",
    },
    D: {
      dy: dy * sizeFactor,
      children: "[name]",
      horizontalAlignment: "auto",
    },
    L: {
      dy: 0,
      children: '[name] + "  "',
      horizontalAlignment: "left",
    },
    R: {
      dy: 0,
      children: '"  " + [name]',
      horizontalAlignment: "right",
    },
  };

  const first = placementParams[placements[0]];

  return (
    <ShieldSymbolizer
      fontsetName="regular"
      margin={0}
      haloFill="white"
      haloRadius={2 * sizeFactor}
      haloOpacity={0.75}
      unlockImage
      shieldDy={0}
      file={"images/" + icon + ".svg"}
      transform={`scale(${sizeFactor})`}
      size={size * sizeFactor}
      placementType="list"
      dy={first.dy}
      horizontalAlignment={first.horizontalAlignment}
    >
      {first.children}
      {placements
        .slice(1)
        .split("")
        .map((p) => (
          <Placement {...placementParams[p]} />
        ))}
    </ShieldSymbolizer>
  );
}

export function Places({
  places,
  placeTypes,
  placements,
  sizeFactor = 1,
  countryCode,
  transliterate,
}: Props) {
  if (placeTypes.some((p) => /[^a-z]/.test(p))) {
    throw new Error("invalid place type");
  }

  return (
    <>
      <Style name="places">
        <Rule>
          <Filter>[capital] = 'yes'</Filter>

          <Place
            sizeFactor={sizeFactor}
            icon="capital"
            size={20}
            dy={12}
            placements={placements}
          />
        </Rule>

        <Rule>
          <Filter>[type] = 'city' &amp;&amp; [capital] != 'yes'</Filter>

          <Place
            sizeFactor={sizeFactor}
            icon="city"
            size={20}
            dy={10}
            placements={placements}
          />
        </Rule>

        <Rule>
          <Filter>[type] = 'town' &amp;&amp; [capital] != 'yes'</Filter>

          <Place
            sizeFactor={sizeFactor}
            icon="city"
            size={16}
            dy={8}
            placements={placements}
          />
        </Rule>

        <Rule>
          <Filter>[type] = 'village' &amp;&amp; [capital] != 'yes'</Filter>

          <Place
            sizeFactor={sizeFactor}
            icon="city"
            size={14}
            dy={7}
            placements={placements}
          />
        </Rule>
      </Style>

      <Layer srs="+init=epsg:3857">
        <StyleName>places</StyleName>

        <Datasource base="db">
          <Parameter name="table">
            {`
              (
                SELECT coalesce(NULLIF(name_sk, ''), ${
                  transliterate ? "name_trl, " : ""
                }name) AS name, geometry, type, capital
                FROM osm_places
                WHERE
                  ${places
                    .map((place) =>
                      isNaN(Number(place))
                        ? ` name = $quot$${place}$quot$ OR name_sk = $quot$${place}$quot$ OR `
                        : ` osm_id = ${place} OR `
                    )
                    .join("")}
                  ${countryCode ? `country_code = '${countryCode}' AND ` : ""}
                  ${
                    placeTypes.length === 0
                      ? "false"
                      : placeTypes.includes("capital")
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
