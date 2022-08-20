export function serialize(obj: JSX.Element): string {
  if (Array.isArray(obj)) {
    throw new Error("unexpected array");
  }

  if (!obj || typeof obj === "boolean") {
    return "";
  }

  if (typeof obj === "string" || typeof obj === "number") {
    return escape(String(obj));
  }

  const {
    elem,
    props: { children, ...rest },
  } = obj;

  const text = !Array.isArray(children)
    ? serialize(children)
    : (children as any[])
        .filter((x) => x)
        .map((child: any) => serialize(child))
        .join("");

  const opening =
    "<" +
    elem +
    Object.entries(rest)
      .map(
        ([k, v]) =>
          ` ${k.replace(
            /[A-Z]/g,
            (letter) => `-${letter.toLowerCase()}`
          )}="${escape(String(v))}"`
      )
      .join("");

  return text === ""
    ? opening + "/>"
    : opening + ">" + text + "</" + elem + ">";
}

const map: Record<string, string> = {
  ">": "&gt;",
  "<": "&lt;",
  "'": "&apos;",
  '"': "&quot;",
  "&": "&amp;",
};

function escape(string: string) {
  return string.replace(
    new RegExp("([&\"<>'])", "g"),
    (str, item) => map[item]
  );
}
