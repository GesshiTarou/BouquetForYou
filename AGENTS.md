## Development

Node.js はローカルに入れず、すべて Docker Compose 上で実行する。

- `docker compose up astro` … 開発サーバー（http://localhost:4321/BouquetForYou/）
- `docker compose run --rm build` … 本番ビルド（dist/）
- `docker compose run --rm --service-ports preview` … dist/ のプレビュー

コンテナ内で生成されたファイルが root 所有になった場合は
`docker run --rm -v "$PWD":/app alpine chown -R "$(id -u):$(id -g)" /app` で戻す。

ページは `src/pages/*.astro`、共通の骨格は `src/layouts/BaseLayout.astro`、
CSS/JS/画像は `public/` 配下（ビルド時にそのまま dist/ へコピーされる）。
`astro.config.mjs` の `site` / `base` は GitHub Pages 用に設定済み。

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
