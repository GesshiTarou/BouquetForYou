// エントリポイント。データ読み込み → テーブル/フィルタ/カラーバーの初期化と、
// フィルタ・カラーソートの適用を受け持つ。
// 依存: data/flowers.js, js/flowerData.js, js/colorBar.js, js/flowerTable.js, js/filters.js
//       （すべて素のスクリプトとして window に関数を生やす。読み込み順は index.html を参照）

(function (global) {
    'use strict';

    const { getFlattenedData, colorDistance, monthInRange, setupFilters } = global.FlowerFilters;

    const NO_DISTANCE = 999999;

    // カラーソート用の隠し列などのインデックス
    const COL_NAME = 0;
    const COL_DISTANCE = 4;

    const state = {
        dataTable: null,
        flowers: [],
        selection: { months: [], scenes: [], origins: [] },
        isColorSorting: false,
        selectedColor: null,
    };

    let colorBar;

    function applyFilters() {
        const { dataTable, flowers, selection } = state;
        if (!dataTable) return;

        const currentOrder = dataTable.order();
        const isNameSorting = currentOrder.length > 0 && currentOrder[0][0] === COL_NAME;

        // カラーソート中は variant ごとに行を展開する。名前ソートに切り替えたら通常表示に戻す。
        let displayData;
        if (state.isColorSorting && !isNameSorting) {
            displayData = getFlattenedData(flowers);
        } else {
            displayData = flowers.map((item) => Object.assign({}, item));
            if (isNameSorting) state.isColorSorting = false;
        }

        const filtered = displayData.filter((item) => {
            if (selection.scenes.length > 0 && !selection.scenes.some((s) => item.scenes.includes(s))) {
                return false;
            }
            if (selection.origins.length > 0 && !selection.origins.includes(item.origin)) {
                return false;
            }
            if (selection.months.length > 0) {
                const v = item.singleV || (item.variants && item.variants[0]);
                if (!v || !selection.months.some((m) => monthInRange(m, v))) return false;
            }
            return true;
        });

        if (state.isColorSorting && state.selectedColor) {
            filtered.forEach((d) => {
                const v = d.singleV || (d.variants && d.variants[0]);
                d.minDistance = v ? colorDistance(state.selectedColor, v) : NO_DISTANCE;
            });
        } else {
            filtered.forEach((d) => {
                d.minDistance = NO_DISTANCE;
            });
        }

        dataTable.clear().rows.add(filtered);

        if (state.isColorSorting && !isNameSorting) {
            dataTable.order([COL_DISTANCE, 'asc']).draw();
        } else {
            dataTable.draw();
        }
    }

    function main() {
        colorBar = global.initColorBar((rgb) => {
            state.isColorSorting = true;
            state.selectedColor = rgb;
            applyFilters();
        });

        try {
            state.flowers = global.loadFlowers();
        } catch (err) {
            console.error(err);
            document.querySelector('.table-container').innerHTML =
                `<p class="load-error">花のデータを読み込めませんでした。<br>${err.message}</p>`;
            return;
        }

        state.dataTable = global.initFlowerTable(state.flowers);

        setupFilters({
            flowers: state.flowers,
            selection: state.selection,
            onChange: applyFilters,
            onReset: () => {
                state.isColorSorting = false;
                state.selectedColor = null;
                colorBar.clearPin();
                state.dataTable.order([COL_NAME, 'asc']);
            },
        });
    }

    $(main);
})(window);
