import assert from "node:assert/strict";
import fs from "node:fs";

const dimensions = (file) => {
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.toString("ascii", 1, 4), "PNG", file);
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
};

for (const [file, size] of [
  ["public/icons/favicon-32x32.png", 32],
  ["public/icons/apple-touch-icon.png", 180],
  ["public/icons/icon-192.png", 192],
  ["public/icons/icon-512.png", 512],
  ["public/icons/icon-maskable-192.png", 192],
  ["public/icons/icon-maskable-512.png", 512],
]) assert.deepEqual(dimensions(file), [size, size], file);

const favicon = fs.readFileSync("public/favicon.svg", "utf8");
assert.match(favicon, /^<svg[\s\S]*<\/svg>\s*$/);
for (const term of ["本と薔薇と光", "#17383b", "#87dfcd"])
  assert(favicon.includes(term), term);

for (const file of ["site.png", "career.png", "ai-design-foundations.png"])
  assert.deepEqual(dimensions("public/og/" + file), [1200, 630], file);

const manifest = JSON.parse(fs.readFileSync("dist/site.webmanifest", "utf8"));
for (const icon of manifest.icons) {
  assert(icon.src.startsWith("/ai-design-foundations/icons/"), icon.src);
  assert(fs.existsSync("dist" + icon.src.replace("/ai-design-foundations", "")), icon.src);
}
const home = fs.readFileSync("dist/index.html", "utf8");
for (const path of ["favicon.svg", "icons/favicon-32x32.png", "icons/apple-touch-icon.png", "site.webmanifest"])
  assert(home.includes("/ai-design-foundations/" + path), path);
console.log("Verified SVG favicon, 6 raster icons, 3 OGP images, manifest and HTML head assets.");
