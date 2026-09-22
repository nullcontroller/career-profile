import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pngSize = (buffer) => [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];

test("site icon assets have valid SVG and expected PNG dimensions", async () => {
  const svg = await readFile("public/favicon.svg", "utf8");
  assert.match(svg, /viewBox="0 0 64 64"/);
  assert(!svg.includes("<text"));
  const expected = new Map([
    ["public/icons/icon-192.png", [192, 192]],
    ["public/icons/icon-512.png", [512, 512]],
    ["public/icons/icon-maskable-192.png", [192, 192]],
    ["public/icons/icon-maskable-512.png", [512, 512]],
    ["public/icons/apple-touch-icon.png", [180, 180]],
    ["public/icons/favicon-32x32.png", [32, 32]],
  ]);
  for (const [path, size] of expected) {
    const png = await readFile(path);
    assert.deepEqual(pngSize(png), size, path);
  }
});

test("manifest endpoint keeps GitHub Pages base and required metadata", async () => {
  const source = await readFile("src/pages/site.webmanifest.ts", "utf8");
  for (const value of ['name: "立林 裕太朗 | Applied AI / System Architecture"', 'short_name: "立林 裕太朗"', 'display: "browser"', 'theme_color: "#17383b"', 'background_color: "#17383b"', "start_url: url()", "scope: url()"]) {
    assert(source.includes(value), value);
  }
  assert(source.includes("assetUrl"));
  assert(source.includes('purpose: "maskable"'));
});
