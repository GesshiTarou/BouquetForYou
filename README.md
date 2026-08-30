# BouquetForYou

「君に花束を贈るなら」— 花の名前・色・開花月・シーン・栽培方法・花言葉で
草花を絞り込み／並び替えできる静的サイト。

もとは素の HTML/CSS/JS で書かれていたものを **[Astro](https://astro.build)** に移植し、
**GitHub Pages** に自動デプロイする構成にしている。

- 公開 URL: https://GesshiTarou.github.io/BouquetForYou
- リポジトリ: https://github.com/GesshiTarou/BouquetForYou

Node.js はローカルに入れず、すべて **Docker Compose** 上で実行する。

## 動かし方

```bash
docker compose up astro          # 開発サーバー（自動リロード）
```

→ http://localhost:4321/BouquetForYou/ を開く。停止は `Ctrl+C` または `docker compose down`。

```bash
docker compose run --rm build                     # 本番ビルド → dist/
docker compose run --rm --service-ports preview   # dist/ をローカルでプレビュー
```

## デプロイ

`main` ブランチに push すると `.github/workflows/deploy.yml`（`withastro/action`）が
ビルドして GitHub Pages に公開する。手動実行は Actions タブの
"Deploy to GitHub Pages" > Run workflow。

**初回のみ:** リポジトリの Settings > Pages > Build and deployment > Source を
**GitHub Actions** に変更する。

## 構成

```
astro.config.mjs      site / base（GitHub Pages 用）と build.format: 'file' を設定
src/
  layouts/
    BaseLayout.astro  全ページ共通の <head> / 固定ヘッダー / 固定フッター
  pages/
    index.astro       トップページ（メインビジュアル）        → index.html
    search.astro      草花をさがすページ（パレット + テーブル） → search.html
    detail.astro      草花の詳細ページ（detail.html?id=<id>） → detail.html
public/               ここ以下はビルド時にそのまま dist/ へコピーされる
  css/
    common.css        変数・リセット・ヘッダー・フッター・レスポンシブ（全ページ共通）
    home.css          index 固有
    search.css        search 固有（パレット・カラーバー・テーブル・バッジ）
    detail.css        detail 固有
  js/
    flowers.js        花データ。window.FLOWER_DATA にセット
    color.js          色の知覚的な近さ（CIELAB / CIE76 距離）。window.FlowerColor
    search.js         検索ページのロジック（絞り込み・並べ替え・描画・イベント）
    detail.js         詳細ページのロジック（?id= で対象を表示）
  assets/image/
    background.png    背景画像 / 検索ページのウォーターマーク
    logo_small.svg    タイトルロゴ
```

`js/` の各スクリプトは `fetch` / ES モジュールを使わない素の `<script>` で、
`BaseLayout.astro` の `scripts` prop に渡した順（flowers → color → search）で読み込む。
外部接続（Supabase 等）は未実装で、DB から取得する想定のデータは `js/flowers.js` に置いている。

## データを増やす・編集する

`public/js/flowers.js` の `window.FLOWER_DATA` 配列を編集する。1件の形:

```js
{
  id: 1,
  name: "バラ",
  variety: "ハイブリッドティー",
  cultivation_method: "ハウス",        // "ハウス" | "露地"
  shipping_start_month: 1,             // 出回り開始月 (1-12)
  shipping_end_month: 12,              // 出回り終了月。start > end は年をまたぐ
  shape: "球状", size_max: 10, size_min: 5,
  colors: [{ name: "赤", code: "#c0504d" }],
  scenes: ["結婚式", "誕生日"],
  meanings: ["愛情", "美"]
}
```

- シーン／栽培方法のフィルタボタンは、データに含まれる値から自動生成される。
- カラーバーは色相を選ぶと、各花の `colors` の中で最も近い色との距離順に並べ替える。

Supabase に切り替えるときは `public/js/search.js` の `loadFlowers()` を差し替えるだけで済む。
