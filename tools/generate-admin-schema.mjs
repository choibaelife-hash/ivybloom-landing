// Generate editor metadata from the existing Studio schemas. Never execute schema code.
import ts from "typescript";
import { readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
function value(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node))
    return node.elements.map(value).filter((v) => v !== undefined);
  if (
    ts.isCallExpression(node) &&
    /^(defineField|defineType|defineArrayMember)$/.test(
      node.expression.getText(),
    )
  )
    return value(node.arguments[0]);
  if (!ts.isObjectLiteralExpression(node)) return undefined;
  const result = {};
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = prop.name.getText().replaceAll('"', "").replaceAll("'", "");
    if (["components", "preview", "icon"].includes(key)) continue;
    if (key === "validation") {
      const rule = prop.initializer.getText();
      result.validationSource = rule;
      result.required = /\.required\(/.test(rule);
      continue;
    }
    const item = value(prop.initializer);
    if (item !== undefined) result[key] = item;
  }
  return result;
}
const schemas = {};
for (const name of ["journalPost"]) {
  const source = ts.createSourceFile(
    name + ".ts",
    await readFile(new URL(`sanity/schemas/${name}.ts`, root), "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  let result;
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(source) === "defineType"
    )
      result = value(node.arguments[0]);
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (result?.name !== name || !result.fields?.length)
    throw new Error(`Cannot read schema: ${name}`);
  schemas[name] = result;
}
const output = JSON.stringify(schemas, null, 2) + "\n";
const dest = new URL("lib/admin/schema.json", root);
if (process.argv.includes("--check")) {
  if ((await readFile(dest, "utf8")) !== output)
    throw new Error(
      "Admin schema is out of date. Run node tools/generate-admin-schema.mjs",
    );
} else await writeFile(dest, output);
console.log(
  Object.entries(schemas)
    .map(([name, s]) => `${name}: ${s.fields.length} fields`)
    .join("\n"),
);
