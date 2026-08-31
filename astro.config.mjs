// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
// GitHub Pages (project site): https://GesshiTarou.github.io/BouquetForYou
export default defineConfig({
	site: 'https://GesshiTarou.github.io',
	base: '/BouquetForYou',
	// 出力を about.html 形式にする（もとの search.html / detail.html?id= との互換のため）
	build: { format: 'file' },
	// アイコン: astro-icon + Lucide セット（@iconify-json/lucide）
	// 使い方: import { Icon } from 'astro-icon/components';  <Icon name="lucide:flower" />
	integrations: [icon()],
});
