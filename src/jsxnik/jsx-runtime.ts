export function jsx(
  elem: (props: Record<string, unknown>) => JSX.Element,
  props: Record<string, unknown>
) {
  if (elem instanceof Function) {
    return elem(props);
  } else if (typeof elem === "string") {
    return { elem, props };
  } else {
    throw new Error("unexpected elem type");
  }
}

export const jsxs = jsx;

export default {
  jsx,
  jsxs,
};
