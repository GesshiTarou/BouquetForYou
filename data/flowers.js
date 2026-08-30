// 花データ。もとは Supabase の flowers テーブルから取得していたもの。
// GitHub Pages / file:// でそのまま動くよう、fetch せず素のスクリプトで直読みする。
// 構造は Supabase のネストした select 結果と同じ形。将来 Supabase に戻すときは
// js/flowerData.js の loadFlowers() を差し替える。
window.FLOWER_DATA = [
  {
    "id": 1,
    "name": "バラ",
    "description": "花束の主役として最も選ばれる花。色ごとに花言葉が大きく変わるため、贈る相手や気持ちに合わせて選びやすい。",
    "variants": [
      { "method": "国産", "from": 4, "to": 11, "colors": { "R": 200, "G": 16, "B": 46 } },
      { "method": "輸入", "from": 1, "to": 12, "colors": { "R": 244, "G": 154, "B": 194 } },
      { "method": "輸入", "from": 1, "to": 12, "colors": { "R": 245, "G": 245, "B": 240 } },
      { "method": "国産", "from": 5, "to": 10, "colors": { "R": 245, "G": 206, "B": 66 } }
    ],
    "languages": [
      { "language": "愛情", "languagesMaster": { "source": "西洋花言葉", "url": "https://ja.wikipedia.org/wiki/%E3%83%90%E3%83%A9" } }
    ],
    "scenes": [
      { "note": "赤いバラは「あなたを愛しています」を意味し、プロポーズの定番。", "scenesMaster": { "scene": "プロポーズ" } },
      { "note": "本数で意味が変わるため、記念日の年数に合わせるのも人気。", "scenesMaster": { "scene": "結婚記念日" } }
    ]
  },
  {
    "id": 2,
    "name": "チューリップ",
    "description": "春を代表する球根花。丸みのあるフォルムで、カジュアルな花束にもフォーマルなアレンジにもなじむ。",
    "variants": [
      { "method": "国産", "from": 3, "to": 5, "colors": { "R": 235, "G": 110, "B": 45 } },
      { "method": "国産", "from": 3, "to": 5, "colors": { "R": 244, "G": 154, "B": 194 } },
      { "method": "国産", "from": 2, "to": 4, "colors": { "R": 245, "G": 206, "B": 66 } }
    ],
    "languages": [
      { "language": "思いやり", "languagesMaster": { "source": "日本花言葉", "url": "https://ja.wikipedia.org/wiki/%E3%83%81%E3%83%A5%E3%83%BC%E3%83%AA%E3%83%83%E3%83%97" } }
    ],
    "scenes": [
      { "note": "卒業や異動の季節に出回るため、送別の花束によく使われる。", "scenesMaster": { "scene": "送別会" } },
      { "note": "明るい色合いが多く、子どもへの贈り物にも向く。", "scenesMaster": { "scene": "誕生日" } }
    ]
  },
  {
    "id": 3,
    "name": "ガーベラ",
    "description": "発色がよく、花もちも比較的よい定番花。茎が長く、束ねたときに顔がそろいやすい。",
    "variants": [
      { "method": "国産", "from": 1, "to": 12, "colors": { "R": 235, "G": 110, "B": 45 } },
      { "method": "国産", "from": 1, "to": 12, "colors": { "R": 244, "G": 154, "B": 194 } },
      { "method": "国産", "from": 1, "to": 12, "colors": { "R": 245, "G": 206, "B": 66 } }
    ],
    "languages": [
      { "language": "希望", "languagesMaster": { "source": "西洋花言葉", "url": "https://ja.wikipedia.org/wiki/%E3%82%AC%E3%83%BC%E3%83%99%E3%83%A9" } }
    ],
    "scenes": [
      { "note": "前向きな花言葉から、発表会や送り出しの場面で選ばれやすい。", "scenesMaster": { "scene": "発表会" } },
      { "note": "元気な印象で、お祝い全般に合わせやすい。", "scenesMaster": { "scene": "誕生日" } }
    ]
  },
  {
    "id": 4,
    "name": "カスミソウ",
    "description": "小さな白花が霞のように広がる定番の脇役。主役の花を引き立て、ドライフラワーにもしやすい。",
    "variants": [
      { "method": "輸入", "from": 1, "to": 12, "colors": { "R": 245, "G": 245, "B": 240 } },
      { "method": "国産", "from": 5, "to": 7, "colors": { "R": 244, "G": 154, "B": 194 } }
    ],
    "languages": [
      { "language": "清らかな心", "languagesMaster": { "source": "西洋花言葉", "url": "https://ja.wikipedia.org/wiki/%E3%82%AB%E3%82%B9%E3%83%9E%E3%82%BD%E3%82%A6" } }
    ],
    "scenes": [
      { "note": "白一色でまとめると清楚な印象になり、卒業の贈り物に向く。", "scenesMaster": { "scene": "卒業" } }
    ]
  },
  {
    "id": 5,
    "name": "ヒマワリ",
    "description": "夏を象徴する大輪花。1本でも存在感があり、明るい印象の花束をつくりやすい。",
    "variants": [
      { "method": "国産", "from": 6, "to": 9, "colors": { "R": 245, "G": 206, "B": 66 } },
      { "method": "国産", "from": 7, "to": 8, "colors": { "R": 175, "G": 92, "B": 40 } }
    ],
    "languages": [
      { "language": "あなただけを見つめる", "languagesMaster": { "source": "ギリシャ神話", "url": "https://ja.wikipedia.org/wiki/%E3%83%92%E3%83%9E%E3%83%AF%E3%83%AA" } }
    ],
    "scenes": [
      { "note": "一途な花言葉から、告白やプロポーズにも使われる。", "scenesMaster": { "scene": "プロポーズ" } },
      { "note": "父の日(6月)の定番花として流通する。", "scenesMaster": { "scene": "父の日" } }
    ]
  },
  {
    "id": 6,
    "name": "カーネーション",
    "description": "母の日の定番花。花もちがよく、色数が豊富で花束の色調整に使いやすい。",
    "variants": [
      { "method": "国産", "from": 1, "to": 12, "colors": { "R": 214, "G": 44, "B": 84 } },
      { "method": "輸入", "from": 1, "to": 12, "colors": { "R": 244, "G": 154, "B": 194 } },
      { "method": "輸入", "from": 1, "to": 12, "colors": { "R": 245, "G": 245, "B": 240 } }
    ],
    "languages": [
      { "language": "無垢で深い愛", "languagesMaster": { "source": "日本花言葉", "url": "https://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%BC%E3%83%8D%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3" } }
    ],
    "scenes": [
      { "note": "赤やピンクは母の日、白は亡くなった母を偲ぶ意味で使われる。", "scenesMaster": { "scene": "母の日" } }
    ]
  },
  {
    "id": 7,
    "name": "スイートピー",
    "description": "ふわりと立ち上がる花びらと甘い香りが特徴。冬から春にかけて出回るパステル系の花。",
    "variants": [
      { "method": "国産", "from": 12, "to": 4, "colors": { "R": 244, "G": 154, "B": 194 } },
      { "method": "国産", "from": 12, "to": 4, "colors": { "R": 168, "G": 158, "B": 213 } }
    ],
    "languages": [
      { "language": "門出", "languagesMaster": { "source": "西洋花言葉", "url": "https://ja.wikipedia.org/wiki/%E3%82%B9%E3%82%A4%E3%83%BC%E3%83%88%E3%83%94%E3%83%BC" } }
    ],
    "scenes": [
      { "note": "「門出」「別離」の花言葉から、卒業・送別のシーズンに人気。", "scenesMaster": { "scene": "卒業" } },
      { "note": "flying の語感から、新生活を送り出す場面で選ばれる。", "scenesMaster": { "scene": "送別会" } }
    ]
  },
  {
    "id": 8,
    "name": "トルコキキョウ",
    "description": "フリルの多い花びらで華やかさがありながら上品。夏の高温期でも比較的もちがよい。",
    "variants": [
      { "method": "国産", "from": 5, "to": 9, "colors": { "R": 168, "G": 158, "B": 213 } },
      { "method": "国産", "from": 5, "to": 9, "colors": { "R": 245, "G": 245, "B": 240 } },
      { "method": "国産", "from": 6, "to": 8, "colors": { "R": 130, "G": 140, "B": 200 } }
    ],
    "languages": [
      { "language": "優美", "languagesMaster": { "source": "日本花言葉", "url": "https://ja.wikipedia.org/wiki/%E3%83%88%E3%83%AB%E3%82%B3%E3%82%AD%E3%82%AD%E3%83%A7%E3%82%A6" } }
    ],
    "scenes": [
      { "note": "上品な佇まいで、目上の人へのお祝いやお見舞いに向く。", "scenesMaster": { "scene": "お見舞い" } },
      { "note": "花もちがよく、長く飾れることから開店祝いにも使われる。", "scenesMaster": { "scene": "誕生日" } }
    ]
  },
  {
    "id": 9,
    "name": "ダリア",
    "description": "大輪で立体感があり、1本で花束の中心をつくれる。秋の深い色合いが特に人気。",
    "variants": [
      { "method": "国産", "from": 6, "to": 11, "colors": { "R": 150, "G": 30, "B": 60 } },
      { "method": "国産", "from": 9, "to": 11, "colors": { "R": 235, "G": 110, "B": 45 } },
      { "method": "国産", "from": 6, "to": 10, "colors": { "R": 244, "G": 154, "B": 194 } }
    ],
    "languages": [
      { "language": "華麗", "languagesMaster": { "source": "西洋花言葉", "url": "https://ja.wikipedia.org/wiki/%E3%83%80%E3%83%AA%E3%82%A2" } }
    ],
    "scenes": [
      { "note": "存在感があり、記念日など特別な日の花束の主役になる。", "scenesMaster": { "scene": "結婚記念日" } }
    ]
  },
  {
    "id": 10,
    "name": "アネモネ",
    "description": "黒い花芯とビビッドな花色のコントラストが印象的。冬から早春にかけて出回る。",
    "variants": [
      { "method": "国産", "from": 12, "to": 4, "colors": { "R": 150, "G": 30, "B": 60 } },
      { "method": "国産", "from": 12, "to": 4, "colors": { "R": 120, "G": 81, "B": 169 } },
      { "method": "国産", "from": 1, "to": 3, "colors": { "R": 245, "G": 245, "B": 240 } }
    ],
    "languages": [
      { "language": "はかない恋", "languagesMaster": { "source": "ギリシャ神話", "url": "https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%8D%E3%83%A2%E3%83%8D" } }
    ],
    "scenes": [
      { "note": "切ない花言葉が多いため、贈るより自宅で楽しむ人が多い。", "scenesMaster": { "scene": "誕生日" } }
    ]
  }
];
