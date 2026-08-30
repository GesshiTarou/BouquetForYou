/* 色の知覚的な近さ（CIELAB / CIE76 距離）を計算するユーティリティ。
   カラーバーで選んだ色相に近い順に花を並べ替えるために使う。
   window.FlowerColor として公開する。 */
(function (global) {
  'use strict';

  // sRGB (0-255) -> linear
  function srgbToLinear(c) {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  // linear RGB -> XYZ (D65)
  function rgbToXyz(r, g, b) {
    const rl = srgbToLinear(r);
    const gl = srgbToLinear(g);
    const bl = srgbToLinear(b);
    return {
      x: rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375,
      y: rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750,
      z: rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041,
    };
  }

  // XYZ -> Lab
  function xyzToLab(x, y, z) {
    const eps = 0.008856;
    const kap = 903.3;
    const xn = 0.95047;
    const yn = 1.0;
    const zn = 1.08883;
    const f = (t) => (t > eps ? Math.cbrt(t) : (kap * t + 16) / 116);
    const fx = f(x / xn);
    const fy = f(y / yn);
    const fz = f(z / zn);
    return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
  }

  // "#rrggbb" -> Lab
  function hexToLab(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const xyz = rgbToXyz(r, g, b);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
  }

  // 色相 (0-360) -> Lab（彩度/明度を抑えめの HSL s=0.5 l=0.6 として変換）
  function hueToLab(hue) {
    const h = hue / 360;
    const s = 0.5;
    const l = 0.6;
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    const xyz = rgbToXyz(r, g, b);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
  }

  // CIE76 距離
  function labDistance(a, b) {
    return Math.sqrt(
      (a.L - b.L) ** 2 +
      (a.a - b.a) ** 2 +
      (a.b - b.b) ** 2,
    );
  }

  // 花の色のうち、目標色に最も近いものの距離
  function flowerColorDistance(flower, targetLab) {
    if (!flower.colors || flower.colors.length === 0) return Infinity;
    return Math.min(
      ...flower.colors.map((c) => labDistance(hexToLab(c.code), targetLab)),
    );
  }

  global.FlowerColor = { hexToLab, hueToLab, labDistance, flowerColorDistance };
})(window);
