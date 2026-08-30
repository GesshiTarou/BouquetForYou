// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// GitHub Pages (project site): https://GesshiTarou.github.io/BouquetForYou
export default defineConfig({
	site: 'https://GesshiTarou.github.io',
	base: '/BouquetForYou',
	// 出力を about.html 形式にする（もとの search.html / detail.html?id= との互換のため）
	build: { format: 'file' },
});
