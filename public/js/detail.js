/* 詳細ページ (detail.html) のロジック。
   依存: js/flowers.js (window.FLOWER_DATA)
   detail.html?id=<花のid> で対象を表示する。 */
(function (global) {
  'use strict';

  function getFlowerById(id) {
    const rows = global.FLOWER_DATA;
    if (!Array.isArray(rows)) return null;
    return rows.find((f) => String(f.id) === String(id)) || null;
  }

  function formatMonth(s, e) {
    if (s === 1 && e === 12) return '通年';
    const month = (m) => m + '月';
    if (s <= e) return `${month(s)} 〜 ${month(e)}`;
    return `${month(s)} 〜 ${month(e)}（年越し）`;
  }

  function row(label, valueHtml) {
    return `
      <div class="detail-row">
        <dt>${label}</dt>
        <dd>${valueHtml}</dd>
      </div>`;
  }

  function render(f) {
    const body = document.getElementById('detailBody');
    if (!f) {
      body.innerHTML =
        '<p class="detail-notfound">指定された草花が見つかりませんでした。</p>';
      return;
    }

    document.title = `君に花束を贈るなら｜${f.name}`;

    const colors = f.colors
      .map(
        (c) =>
          `<span class="detail-color"><span class="color-dot" style="background:${c.code}"></span>${c.name}</span>`,
      )
      .join('');

    const scenes = f.scenes
      .map((s) => `<span class="badge scene">${s}</span>`)
      .join('');

    const meanings = f.meanings
      .map((m) => `<span class="detail-meaning">${m}</span>`)
      .join('');

    const size =
      f.size_min != null && f.size_max != null
        ? `${f.size_min}〜${f.size_max} cm`
        : '—';

    body.innerHTML = `
      <h1 class="detail-name">${f.name}</h1>
      <p class="detail-variety">${f.variety || ''}</p>
      <dl class="detail-list">
        ${row('色', `<div class="detail-colors">${colors}</div>`)}
        ${row('栽培方法', `<span class="badge cultivation">${f.cultivation_method || '—'}</span>`)}
        ${row('出回り時期', formatMonth(f.shipping_start_month, f.shipping_end_month))}
        ${row('花形', f.shape || '—')}
        ${row('大きさ', size)}
        ${row('シーン', `<div class="detail-badges">${scenes}</div>`)}
        ${row('花言葉', `<div class="detail-meanings">${meanings}</div>`)}
      </dl>`;
  }

  function init() {
    const id = new URLSearchParams(global.location.search).get('id');
    render(getFlowerById(id));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
