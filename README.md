# BouquetForYou

「君に花束を贈るなら」— 花の名前・色・開花月・シーン・栽培方法・花言葉で
草花を絞り込み／並び替えできる静的サイト。

`BouquetForYou_old`（1枚 HTML にインライン CSS / JS がまとまっていたもの）を、
ページ・スタイル・スクリプト・データに分割してリファクタリングしたもの。
Supabase など外部接続は実装せず、DB から取得する想定だったデータは
`js/flowers.js`（`window.FLOWER_DATA`）に置き換えている。

`fetch` / ES モジュールを使わず素の `<script>` を順番に読み込む構成なので、
`file://` で直接開いても GitHub Pages に置いても動く。

## 構成

```
index.html          トップページ（ヘッダー・ロゴ・背景画像・ナビ・フッター）
search.html         草花をさがすページ（パレット + 一覧テーブル）
css/
  common.css        変数・リセット・ヘッダー・フッター・レスポンシブ（全ページ共通）
  home.css          index.html 固有（メインビジュアル周り）
  search.css        search.html 固有（パレット・カラーバー・テーブル・バッジ）
js/
  flowers.js        花データ。window.FLOWER_DATA にセット（旧 DUMMY_FLOWERS）
  color.js          色の知覚的な近さ（CIELAB / CIE76 距離）。window.FlowerColor
  search.js         検索ページのロジック（絞り込み・並べ替え・描画・イベント）
assets/image/
  background.png    背景画像 / 検索ページのウォーターマーク
  logo_small.svg    タイトルロゴ
```

`search.html` 末尾で `js/flowers.js` → `js/color.js` → `js/search.js` の順に読み込む。

## 動かし方

`index.html` をブラウザで開くだけ。サーバー不要。
GitHub Pages はリポジトリ設定で対象ブランチ + `/ (root)` を指定すればそのまま公開できる。

## データを増やす・編集する

`js/flowers.js` の `window.FLOWER_DATA` 配列を編集する。1件の形:

```js
{
  id: 1,
  name: "バラ",
  variety: "ハイブリッドティー",
  cultivation_method: "ハウス",        // "ハウス" | "露地"
  shipping_start_month: 1,             // 出回り開始月 (1-12)
  shipping_end_month: 12,              // 出回り終了月。start > end は年をまたぐ
  shape: "球状", size_max: 10, size_min: 5,  // 現状テーブル未使用
  colors: [{ name: "赤", code: "#c0504d" }],
  scenes: ["結婚式", "誕生日"],
  meanings: ["愛情", "美"]
}
```

- シーン／栽培方法のフィルタボタンは、データに含まれる値から自動生成される。
- カラーバーは色相を選ぶと、各花の `colors` の中で最も近い色との距離順に並べ替える。

## 元コードからの主な変更

- インライン `<style>` / `<script>` を `css/` `js/` に分離。共通ヘッダー／フッターを `common.css` に集約。
- `index.html` の `.main-content` にあったデバッグ用の赤枠（コメントで「本番では削除」と明記）を削除。
- `search.html` のウォーターマークが存在しない `background.svg` を参照していたのを `background.png` に修正。
- ナビの「草花のページ」を `search.html` にリンク、検索ページのロゴを `index.html` にリンク。

## 実装していないもの

- Supabase クライアントと接続情報、DB への書き込み／認証など外部通信全般

必要になったら `js/search.js` の `loadFlowers()` を差し替えるだけで済むように、
データ取得はこの関数に閉じてある。
