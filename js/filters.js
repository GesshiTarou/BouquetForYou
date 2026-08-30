// フィルタボタン（月・シーン・出典）の生成と、絞り込み・カラーソート用のヘルパー。

(function (global) {
    'use strict';

    // 1つの花を variant ごとの行に展開する（カラーソート時に色を1色ずつ並べるため）。
    function getFlattenedData(data) {
        const flat = [];
        data.forEach((f) => {
            f.variants.forEach((v) => {
                flat.push(Object.assign({}, f, { variants: [v], singleV: v }));
            });
        });
        return flat;
    }

    // 選択色と variant 色の RGB 距離の2乗。小さいほど近い色。
    function colorDistance(rgb, v) {
        return (
            Math.pow(rgb[0] - v.r, 2) +
            Math.pow(rgb[1] - v.g, 2) +
            Math.pow(rgb[2] - v.b, 2)
        );
    }

    // 月が variant の出回り期間 (from〜to、年をまたぐ場合あり) に含まれるか。
    function monthInRange(month, v) {
        return v.from <= v.to
            ? month >= v.from && month <= v.to
            : month >= v.from || month <= v.to;
    }

    function setupFilters(options) {
        const { flowers, selection, onChange, onReset } = options;
        buildMonthButtons(selection, onChange, onReset);
        buildTagButtons(
            '#scene-buttons',
            uniqueSorted(flowers.reduce((acc, f) => acc.concat(f.scenes), [])),
            selection.scenes,
            onChange,
        );
        buildTagButtons(
            '#origin-buttons',
            uniqueSorted(flowers.map((f) => f.origin)),
            selection.origins,
            onChange,
        );
    }

    function buildMonthButtons(selection, onChange, onReset) {
        const container = $('#month-buttons');
        for (let i = 1; i <= 12; i++) {
            $(`<button class="btn month-btn" data-month="${i}">${i}月</button>`)
                .appendTo(container)
                .on('click', function () {
                    $(this).toggleClass('active');
                    toggleValue(selection.months, i, $(this).hasClass('active'));
                    onChange();
                });
        }

        $('<button class="btn reset">全表示リセット</button>')
            .appendTo(container)
            .on('click', () => {
                selection.months.length = 0;
                selection.scenes.length = 0;
                selection.origins.length = 0;
                $('.btn').removeClass('active');
                onReset();
                onChange();
            });
    }

    function buildTagButtons(target, values, bucket, onChange) {
        values.forEach((value) => {
            $(`<button class="btn">${value}</button>`)
                .appendTo(target)
                .on('click', function () {
                    $(this).toggleClass('active');
                    toggleValue(bucket, value, $(this).hasClass('active'));
                    onChange();
                });
        });
    }

    function toggleValue(arr, value, isActive) {
        if (isActive) {
            arr.push(value);
        } else {
            const idx = arr.indexOf(value);
            if (idx !== -1) arr.splice(idx, 1);
        }
    }

    function uniqueSorted(arr) {
        return Array.from(new Set(arr)).sort();
    }

    global.FlowerFilters = {
        getFlattenedData,
        colorDistance,
        monthInRange,
        setupFilters,
    };
})(window);
