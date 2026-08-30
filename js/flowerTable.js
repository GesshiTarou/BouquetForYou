// DataTables の初期化と、花名クリックで開く詳細カードの描画。

(function (global) {
    'use strict';

    const MONTH_UNIT = 100 / 12; // 期間バー1ヶ月あたりの幅(%)

    global.initFlowerTable = function initFlowerTable(list) {
        const dataTable = $('#flower-table').DataTable({
            data: list,
            paging: false,
            info: false,
            columns: [
                { data: 'name', title: '花の名前', className: 'clickable-name', width: '20%' },
                {
                    data: 'variants',
                    title: '色展開と流通',
                    orderable: false,
                    render: renderVariants,
                },
                {
                    data: 'scenes',
                    title: 'シーン',
                    orderable: false,
                    render: (scenes) =>
                        scenes.length
                            ? scenes.map((s) => `<span class="scene-badge">${s}</span>`).join('')
                            : '-',
                },
                { data: 'language', title: '花言葉', width: '20%' },
                { data: 'minDistance', visible: false, type: 'num' },
            ],
            order: [[0, 'asc']],
        });

        $('#flower-table tbody').on('click', 'td.clickable-name', function () {
            const tr = $(this).closest('tr');
            const row = dataTable.row(tr);

            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
                return;
            }

            // ほかに開いている詳細カードを閉じてから開く
            dataTable.rows().every(function () {
                if (this.child.isShown()) {
                    this.child.hide();
                    $(this.node()).removeClass('shown');
                }
            });
            row.child(formatDetail(row.data())).show();
            tr.addClass('shown');
        });

        return dataTable;
    };

    function renderVariants(variants) {
        let html = '<div style="display:flex; flex-direction:column; gap:8px;">';
        variants.forEach((v) => {
            let bars = '';
            if (v.from && v.to) {
                const left = (v.from - 1) * MONTH_UNIT;
                const width =
                    v.from <= v.to
                        ? (v.to - v.from + 1) * MONTH_UNIT
                        : (13 - v.from) * MONTH_UNIT;
                bars = `<div class="period-bar" style="left:${left}%; width:${width}%; background:#444;"><span>${v.from}</span><span>${v.to}</span></div>`;
            }
            html += `<div style="display:flex; align-items:center; gap:10px;">
                <div class="color-circle" style="background:${v.hex};"></div>
                <div style="font-size:10px; width:40px; color:#666;">${v.method}</div>
                <div class="period-graph-container">${bars}</div>
            </div>`;
        });
        return html + '</div>';
    }

    function formatDetail(d) {
        const flowerIntro = `<div class="detail-text">${d.description}</div>`;
        const originText = d.originUrl
            ? `<a href="${d.originUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: underline;">${d.origin}</a>`
            : d.origin;

        const languageHtml = `<li><strong>${d.language} (${originText}):</strong> 登録されている情報に基づいた解説です。</li>`;
        const sceneNotesHtml =
            d.sceneDetails.length > 0
                ? d.sceneDetails
                      .map((s) => `<li><strong>${s.name}:</strong> ${s.note || '解説なし'}</li>`)
                      .join('')
                : '<li>シーン別の詳細情報はありません。</li>';

        return `
            <div class="detail-card">
                <div class="detail-title">花の紹介</div>
                ${flowerIntro}
                <div class="detail-title">花言葉の由来・出典</div>
                <div class="detail-text"><ul style="margin: 0; padding-left: 20px; font-size: 13px;">${languageHtml}</ul></div>
                <div class="detail-title">シーン別のおすすめ理由</div>
                <div class="detail-text"><ul style="margin: 0; padding-left: 20px; font-size: 13px;">${sceneNotesHtml}</ul></div>
            </div>
        `;
    }
})(window);
