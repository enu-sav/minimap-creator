module "jsx-xml-jsx-runtime";

declare module "jsx-xml-jsx-runtime/jsx-runtime" {
  export default any;
}

declare module "mapnik";

declare namespace JSX {
  interface IntrinsicElements {}

  interface ElementChildrenAttribute {
    children: {};
  }

  interface Element {}
}
