import { PolygonSymbolizer } from "jsxnik/mapnikConfig";

type Props = {
  color: string;
  simplify?: number;
};

export function RichPolygonSymbolizer({ color, simplify }: Props) {
  return (
    <PolygonSymbolizer
      fill={color}
      simplify={simplify}
      simplifyAlgorithm="visvalingam-whyatt"
    />
  );
}
