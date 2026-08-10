import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

function colorVariable(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  assert.ok(match, `Missing --color-${name} in globals.css`);
  return match[1].toLowerCase();
}

function relativeLuminance(hex: string): number {
  const channels = hex.slice(1).match(/.{2}/g);
  assert.ok(channels, `Invalid hex color: ${hex}`);
  const [red, green, blue] = channels.map((value) => {
    const channel = Number.parseInt(value, 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: string, second: string): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

const brandOrange = colorVariable('orange');
const orangeText = colorVariable('orange-text');
const ink = colorVariable('ink');
const surfaceDark = colorVariable('surface-dark');
const lightSurfaces = ['surface', 'background', 'surface-muted'] as const;

assert.equal(brandOrange, '#f84d25', 'Primary Venkoi orange must remain #F84D25');

for (const surface of lightSurfaces) {
  const background = colorVariable(surface);
  const ratio = contrastRatio(orangeText, background);
  assert.ok(
    ratio >= 4.5,
    `Orange text ${orangeText} has insufficient contrast (${ratio.toFixed(2)}:1) on ${surface} ${background}`
  );
  console.log(`orange-text on ${surface}: ${ratio.toFixed(2)}:1`);
}

const brandOrangeOnInk = contrastRatio(brandOrange, ink);
assert.ok(
  brandOrangeOnInk >= 4.5,
  `Brand orange ${brandOrange} has insufficient contrast (${brandOrangeOnInk.toFixed(2)}:1) on Ink ${ink}`
);
console.log(`brand-orange on ink: ${brandOrangeOnInk.toFixed(2)}:1`);

const inkOnBrandOrange = contrastRatio(ink, brandOrange);
assert.ok(
  inkOnBrandOrange >= 4.5,
  `Ink ${ink} has insufficient contrast (${inkOnBrandOrange.toFixed(2)}:1) on brand orange ${brandOrange}`
);
console.log(`ink on brand-orange: ${inkOnBrandOrange.toFixed(2)}:1`);

const brandOrangeOnSurfaceDark = contrastRatio(brandOrange, surfaceDark);
assert.ok(
  brandOrangeOnSurfaceDark >= 4.5,
  `Brand orange ${brandOrange} has insufficient contrast (${brandOrangeOnSurfaceDark.toFixed(2)}:1) on surface-dark ${surfaceDark}`
);
console.log(`brand-orange on surface-dark: ${brandOrangeOnSurfaceDark.toFixed(2)}:1`);

const whiteOnBrandOrange = contrastRatio(colorVariable('surface'), brandOrange);
console.log(`white on brand-orange (not for normal text): ${whiteOnBrandOrange.toFixed(2)}:1`);

console.log('Accessibility color regression checks passed.');
