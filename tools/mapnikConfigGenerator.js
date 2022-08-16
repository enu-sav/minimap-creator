const ref = require("./mapnik-config-reference.json");

console.log(`export const Style = "Style" as unknown as (props: {`);
processProperties(ref.style);
console.log("}) => JSX.Element;");
console.log();

console.log(`export const Layer = "Layer" as unknown as (props: {`);
processProperties(ref.layer);
console.log("  children?: JSX.Element;");
console.log("}) => JSX.Element;");
console.log();

if (false)
  for (const name in ref.symbolizers) {
    const el = camelize(name) + (name === "map" ? "" : "Symbolizer");

    console.log(`export const ${el} = "${el}" as unknown as (props: {`);

    const symbolizer = ref.symbolizers[name];

    processProperties(symbolizer);

    if (name === "map" || name === "shield") {
      console.log("  children?: JSX.Element;");
    }

    console.log("}) => JSX.Element;");
    console.log();
  }

function processProperties(symbolizer) {
  for (const prop in symbolizer) {
    const property = symbolizer[prop];

    const { type } = property;

    const t = Array.isArray(type)
      ? type.map((item) => `"${item}"`).join(" | ")
      : type === "float" || type === "unsigned"
      ? "number"
      : type === "color" || type === "functions" || type === "uri"
      ? "string"
      : type;

    console.log(`  /**`);
    console.log(`   * ${property.doc.replace(/\\"/g, '"')}`);
    console.log(
      `   * Expression: ${property["expression"] ? "true" : "false"}`
    );
    if (property.range) {
      console.log(`   * Range: ${property["range"]}`);
    }
    console.log(`   * Default value: ${property["default-value"]}`);
    console.log(`   * Default meaning: ${property["default-meaning"]}`);
    console.log(`   */`);
    console.log(`  "${prop}"?: ${t};`);
    console.log();
  }
}

function camelize(name) {
  return name
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}
