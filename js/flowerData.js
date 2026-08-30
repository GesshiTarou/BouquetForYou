// 花データの読み込みと整形。
// もとは Supabase の flowers テーブルを fetch していたが、
// GitHub Pages / file:// でそのまま動くよう data/flowers.js を直読みしている
// （data/flowers.js が window.FLOWER_DATA をセットする）。
// data の構造は Supabase のネストした select 結果と同じ形。

(function (global) {
    'use strict';

    function toHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    // Supabase 由来のネスト構造を、テーブル表示で扱いやすいフラットな形に変換する。
    function mapFlower(f) {
        const langObj = (f.languages && f.languages[0]) || {};
        const master = langObj.languagesMaster || {};

        return {
            name: f.name,
            description: f.description || '説明はありません。',
            variants: (f.variants || [])
                .map((v) => {
                    const c = Array.isArray(v.colors) ? v.colors[0] : v.colors;
                    if (!c) return null;
                    return {
                        r: c.R,
                        g: c.G,
                        b: c.B,
                        hex: toHex(c.R, c.G, c.B),
                        from: v.from,
                        to: v.to,
                        method: v.method || '不明',
                    };
                })
                .filter(Boolean),
            language: langObj.language || '-',
            origin: master.source || '不明',
            originUrl: master.url || null,
            sceneDetails: (f.scenes || [])
                .map((s) => ({ name: s.scenesMaster && s.scenesMaster.scene, note: s.note }))
                .filter((s) => s.name),
            scenes: (f.scenes || [])
                .map((s) => s.scenesMaster && s.scenesMaster.scene)
                .filter(Boolean),
            minDistance: 999999,
        };
    }

    global.loadFlowers = function loadFlowers() {
        const rows = global.FLOWER_DATA;
        if (!Array.isArray(rows)) {
            throw new Error('花データ (data/flowers.js) が読み込まれていません。');
        }
        return rows.map(mapFlower);
    };
})(window);
