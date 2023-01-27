import { LineSymbolizer } from "jsxnik/mapnikConfig";

type Props = {
  width: number | string;
  color: string;
};

export function RichLineSymbolizer({ width, color }: Props) {
  return (
    <LineSymbolizer
      stroke={color}
      strokeWidth={width}
      strokeLinejoin="round"
      strokeLinecap="round"
      // simplify={0.5}
      // simplifyAlgorithm="douglas-peucker"
    />
  );
}
