import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, relative } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const html = readFileSync(join(dist, "index.html"), "utf8");
assert.match(html, /<html lang="tr">/);
assert.doesNotMatch(
  html,
  /(?:src|href)=["'](?:\/|https?:\/\/)/,
  "Export must use relative runtime URLs",
);
let checked = 0;
for (const [, reference] of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
  if (reference.startsWith("#")) continue;
  assert.ok(
    statSync(resolve(dist, reference)).isFile(),
    `Missing HTML resource: ${reference}`,
  );
  checked++;
}
for (const filename of readdirSync(join(dist, "assets")).filter((f) =>
  f.endsWith(".css"),
)) {
  const css = readFileSync(join(dist, "assets", filename), "utf8");
  for (const [, ref] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    if (ref.startsWith("data:")) continue;
    assert.ok(!/^(\/|https?:)/.test(ref), `Non-relative CSS asset: ${ref}`);
    assert.ok(
      statSync(resolve(dist, "assets", ref)).isFile(),
      `Missing CSS asset: ${ref}`,
    );
    checked++;
  }
}
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
for (const path of walk(join(root, "public"))) {
  const target = join(dist, relative(join(root, "public"), path));
  assert.deepEqual(
    readFileSync(target),
    readFileSync(path),
    `Public asset differs: ${path}`,
  );
  checked++;
}
const files = walk(dist);
const bytes = files.reduce((sum, f) => sum + statSync(f).size, 0);
assert.ok(
  bytes < 2 * 1024 * 1024,
  `Export exceeded its 2 MiB path budget: ${bytes}`,
);
assert.ok(
  !files.some((f) => /node_modules|\.tgz$|\.map$/.test(f)),
  "Unnecessary dependency packaging found",
);
console.log(
  `PASS: ${checked} local asset checks; ${files.length} export files; ${bytes} bytes; relative URLs and identical public assets.`,
);
