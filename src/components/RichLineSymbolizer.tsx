import { LineSymbolizer } from "jsxnik/mapnikConfig";

type Props = {
  width: number | string;
  color: string;
  simplify: number;
};

export function RichLineSymbolizer({ width, color, simplify }: Props) {
  return (
    <LineSymbolizer
      stroke={color}
      strokeWidth={width}
      strokeLinejoin="round"
      strokeLinecap="round"
      simplify={simplify}
      simplifyAlgorithm="visvalingam-whyatt"
    />
  );
}
