# BouquetForYou

「きみに花束を贈るなら」— 花の色・見かける時期・シーン・花言葉の出典で
花を絞り込み／並び替えできる静的サイト。

隣リポジトリ `FlowersForYou` の `tableTest/index.html`（最新版）を、
1枚の HTML から役割ごとのファイルに分割してリファクタリングしたもの。
Supabase など外部接続は実装せず、DB から読んでいたデータは
`data/flowers.js` に置き換えている。

`fetch` / ES モジュールを使わず、素の `<script>` を順番に読み込む構成にしてある。
そのため `file://` で直接開いても、GitHub Pages に置いても動く。

## 構成

```
index.html          画面のマークアップ。jQuery / DataTables を CDN 読み込み
css/styles.css      旧 <style> を丸ごと外出し
data/flowers.js     花データ。window.FLOWER_DATA にセット
                    （旧 Supabase の flowers テーブル相当。ネスト構造も同じ形）
js/
  flowerData.js     window.FLOWER_DATA を表示用の形に整形（旧 fetchFlowerData 相当）
  colorBar.js       上部の虹色バー（カラーピッカー）。クリック色の取得とピン描画
  flowerTable.js    DataTables の初期化と、花名クリックで開く詳細カード
  filters.js        月／シーン／出典ボタンの生成と、絞り込み・色距離のヘルパー
  main.js           エントリポイント。読み込み → 各種初期化 → フィルタ/カラーソート適用
```

`index.html` 末尾で `data/flowers.js` → `js/flowerData.js` → `colorBar.js`
→ `flowerTable.js` → `filters.js` → `main.js` の順に読み込む（この順序に依存）。

## 動かし方

`index.html` をブラウザで開くだけ。サーバー不要。
GitHub Pages はリポジトリ設定で対象ブランチ／`/ (root)` を指定すればそのまま公開できる。

## データを増やす・編集する

`data/flowers.js` の `window.FLOWER_DATA` 配列を編集する。1件の形:

```js
{
  id: 1,
  name: "バラ",
  description: "花の説明文",
  variants: [
    { method: "国産", from: 4, to: 11, colors: { R: 200, G: 16, B: 46 } }
  ],
  languages: [
    { language: "愛情", languagesMaster: { source: "西洋花言葉", url: "https://..." } }
  ],
  scenes: [
    { note: "このシーンでおすすめの理由", scenesMaster: { scene: "プロポーズ" } }
  ]
}
```

- `variants[].from` / `to`: 見かける月（1〜12）。`from > to` は年をまたぐ期間として扱う。
- `variants[].colors`: RGB（0〜255）。カラーバーでの並び替えに使う。
- `languages`: 先頭の1件のみ表示（花言葉と出典）。
- `scenes`: フィルタのシーンボタンと詳細カードに反映される。

## 実装していないもの

- Supabase クライアント（`@supabase/supabase-js`）と接続情報
- DB への書き込み／認証など外部通信全般

これらが必要になったら `js/flowerData.js` の `loadFlowers()` を
差し替えるだけで済むように、データ取得はこのファイルに閉じてある。
