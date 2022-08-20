declare module "mapnik";

declare namespace JSX {
  interface IntrinsicElements {}

  interface ElementChildrenAttribute {
    children: {};
  }

  type Element =
    | undefined
    | string
    | boolean
    | number
    | {
        elem: string;
        props: { children?: string | string[]; [key: string]: unknown };
      }
    | Element[];
}
