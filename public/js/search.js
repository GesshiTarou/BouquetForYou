/* 検索ページ (search.html) のロジック。
   依存: js/flowers.js (window.FLOWER_DATA), js/color.js (window.FlowerColor)
   読み込み順は search.html を参照。 */
(function (global) {
  'use strict';

  const { hueToLab, flowerColorDistance } = global.FlowerColor;

  /* =============================================
     データ読み込み
     もとは Supabase 接続想定。今は window.FLOWER_DATA を直読み。
     Supabase に切り替えるときはこの関数だけ差し替える。
     ============================================= */
  function loadFlowers() {
    const rows = global.FLOWER_DATA;
    if (!Array.isArray(rows)) {
      throw new Error('花データ (js/flowers.js) が読み込まれていません。');
    }
    return rows.slice();
  }

  /* =============================================
     STATE
     ============================================= */
  let allFlowers = [];
  let sortCol = null; // 'name' | 'variety'
  let sortDir = 'asc'; // 'asc' | 'desc'
  let colorHue = null; // null = 未選択, 0-360
  let isDragging = false;

  const filters = {
    nameVariety: '',
    months: new Set(),
    scenes: new Set(),
    cultivation: new Set(),
    meaning: '',
  };

  // よく参照する DOM 要素（init で代入）
  let els = {};

  /* =============================================
     絞り込み & 並べ替え
     ============================================= */
  function getFilteredSorted() {
    let result = allFlowers.slice();

    // 名前 / 品種
    const nv = filters.nameVariety.trim();
    if (nv) {
      result = result.filter(
        (f) => f.name.includes(nv) || (f.variety && f.variety.includes(nv)),
      );
    }

    // 開花月（OR）
    if (filters.months.size > 0) {
      result = result.filter((f) => {
        for (const m of filters.months) {
          const s = f.shipping_start_month;
          const e = f.shipping_end_month;
          if (s <= e) {
            if (m >= s && m <= e) return true;
          } else if (m >= s || m <= e) {
            // 年をまたぐ（例: 10月〜3月）
            return true;
          }
        }
        return false;
      });
    }

    // シーン（グループ内 OR、他条件とは AND）
    if (filters.scenes.size > 0) {
      result = result.filter((f) => f.scenes.some((s) => filters.scenes.has(s)));
    }

    // 栽培方法（グループ内 OR、他条件とは AND）
    if (filters.cultivation.size > 0) {
      result = result.filter((f) => filters.cultivation.has(f.cultivation_method));
    }

    // 花言葉
    const mf = filters.meaning.trim();
    if (mf) {
      result = result.filter((f) => f.meanings.some((m) => m.includes(mf)));
    }

    // 並べ替え：カラーバー選択中は色の近い順、そうでなければ列ソート
    if (colorHue !== null) {
      const targetLab = hueToLab(colorHue);
      result.sort(
        (a, b) => flowerColorDistance(a, targetLab) - flowerColorDistance(b, targetLab),
      );
    } else if (sortCol) {
      result.sort((a, b) => {
        const av = (a[sortCol] || '').toString();
        const bv = (b[sortCol] || '').toString();
        const cmp = av.localeCompare(bv, 'ja');
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }

  function formatMonth(s, e) {
    if (s === 1 && e === 12) return '通年';
    const month = (m) => m + '月';
    if (s <= e) return `${month(s)} 〜 ${month(e)}`;
    return `${month(s)} 〜 ${month(e)}（年越し）`;
  }

  function renderTable() {
    const data = getFilteredSorted();

    if (data.length === 0) {
      els.tbody.innerHTML = '';
      els.noResults.style.display = 'block';
      return;
    }
    els.noResults.style.display = 'none';

    els.tbody.innerHTML = data
      .map(
        (f) => `
    <tr class="flower-row" data-id="${f.id}" tabindex="0" role="link" aria-label="${f.name} の詳細を表示">
      <td>${f.name}</td>
      <td>${f.variety || '—'}</td>
      <td>
        <div class="color-dots">
          ${f.colors
            .map(
              (c) =>
                `<span class="color-dot" style="background:${c.code}" title="${c.name}"></span>`,
            )
            .join('')}
        </div>
      </td>
      <td>
        <span class="badge cultivation">${f.cultivation_method || '—'}</span>
      </td>
      <td>${formatMonth(f.shipping_start_month, f.shipping_end_month)}</td>
      <td>
        ${f.scenes.map((s) => `<span class="badge scene">${s}</span>`).join('')}
      </td>
      <td class="meaning-cell">${f.meanings.join('、')}</td>
    </tr>
  `,
      )
      .join('');
  }

  /* =============================================
     ソートヘッダー
     ============================================= */
  function updateSortIcons() {
    ['name', 'variety'].forEach((col) => {
      const el = document.getElementById(`sort-${col}`);
      el.className = col === sortCol ? `sort-icon ${sortDir}` : 'sort-icon none';
    });
  }

  /* =============================================
     行クリック → 詳細ページ (detail.html) へ遷移
     ============================================= */
  function goToDetail(id) {
    if (id == null) return;
    window.location.href = 'detail.html?id=' + encodeURIComponent(id);
  }

  function setupRowNavigation() {
    els.tbody.addEventListener('click', (e) => {
      const tr = e.target.closest('tr.flower-row');
      if (tr) goToDetail(tr.dataset.id);
    });
    els.tbody.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const tr = e.target.closest('tr.flower-row');
      if (tr) {
        e.preventDefault();
        goToDetail(tr.dataset.id);
      }
    });
  }

  function setupSortHeaders() {
    document.querySelectorAll('.flower-table th.sortable').forEach((th) => {
      th.addEventListener('click', () => {
        const col = th.dataset.col;
        if (sortCol === col) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortCol = col;
          sortDir = 'asc';
        }
        updateSortIcons();
        renderTable();
      });
    });
  }

  /* =============================================
     カラーバー
     ============================================= */
  const HUE_NAMES = [
    [0, '赤'],
    [15, '赤橙'],
    [30, 'オレンジ'],
    [50, '黄'],
    [80, '黄緑'],
    [120, '緑'],
    [170, '青緑'],
    [210, '青'],
    [250, '青紫'],
    [270, '紫'],
    [300, 'マゼンタ'],
    [330, 'ピンク'],
    [355, '赤'],
  ];

  function getHueName(hue) {
    let best = HUE_NAMES[0][1];
    let minDist = 360;
    for (const [h, n] of HUE_NAMES) {
      const d = Math.abs(hue - h);
      const dd = Math.min(d, 360 - d);
      if (dd < minDist) {
        minDist = dd;
        best = n;
      }
    }
    return best;
  }

  function setColorBarFromRatio(ratio) {
    const { track, thumb, dot, label } = els;
    const thumbLeft = ratio * track.offsetWidth;
    thumb.style.left = track.offsetLeft + thumbLeft + 'px';
    colorHue = Math.round(ratio * 360);
    dot.style.background = `hsl(${colorHue}, 40%, 65%)`;
    dot.style.width = '12px';
    dot.style.height = '12px';
    label.textContent = getHueName(colorHue);
    renderTable();
  }

  function ratioFromEvent(e) {
    const rect = els.track.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }

  function setupColorBar() {
    const { wrapper, thumb, dot, label, resetBtn } = els;

    wrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      setColorBarFromRatio(ratioFromEvent(e));
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setColorBarFromRatio(ratioFromEvent(e));
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    wrapper.addEventListener(
      'touchstart',
      (e) => {
        isDragging = true;
        setColorBarFromRatio(ratioFromEvent(e));
      },
      { passive: true },
    );
    window.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging) return;
        setColorBarFromRatio(ratioFromEvent(e));
      },
      { passive: true },
    );
    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    resetBtn.addEventListener('click', () => {
      colorHue = null;
      thumb.style.left = '-10px';
      dot.style.background = 'transparent';
      label.textContent = '未選択';
      renderTable();
    });

    // つまみを初期位置（画面外）へ
    thumb.style.left = '-10px';
  }

  /* =============================================
     開花月ボタン
     ============================================= */
  function setupMonthButtons() {
    for (let m = 1; m <= 12; m++) {
      const btn = document.createElement('button');
      btn.className = 'month-btn';
      btn.textContent = m + '月';
      btn.dataset.month = m;
      btn.addEventListener('click', () => {
        if (filters.months.has(m)) {
          filters.months.delete(m);
          btn.classList.remove('active');
        } else {
          filters.months.add(m);
          btn.classList.add('active');
        }
        renderTable();
      });
      els.monthGrid.appendChild(btn);
    }
  }

  /* =============================================
     シーン / 栽培方法バッジ（データから生成）
     ============================================= */
  function buildBadgeGroup(container, items, type, filterSet) {
    items.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = `badge-toggle ${type}`;
      btn.textContent = item;
      btn.addEventListener('click', () => {
        if (filterSet.has(item)) {
          filterSet.delete(item);
          btn.classList.remove('active');
        } else {
          filterSet.add(item);
          btn.classList.add('active');
        }
        renderTable();
      });
      container.appendChild(btn);
    });
  }

  function setupBadgeFilters() {
    const allScenes = [...new Set(allFlowers.flatMap((f) => f.scenes))].sort();
    const allCultivation = [
      ...new Set(allFlowers.map((f) => f.cultivation_method)),
    ].sort();
    buildBadgeGroup(els.sceneGroup, allScenes, 'scene', filters.scenes);
    buildBadgeGroup(els.cultivationGroup, allCultivation, 'cultivation', filters.cultivation);
  }

  /* =============================================
     テキスト入力
     ============================================= */
  function setupTextInputs() {
    els.nameInput.addEventListener('input', (e) => {
      filters.nameVariety = e.target.value;
      renderTable();
    });
    els.meaningInput.addEventListener('input', (e) => {
      filters.meaning = e.target.value;
      renderTable();
    });
  }

  /* =============================================
     INIT
     ============================================= */
  function init() {
    els = {
      tbody: document.getElementById('flowerTableBody'),
      noResults: document.getElementById('noResults'),
      wrapper: document.getElementById('colorBarWrapper'),
      track: document.getElementById('colorBarTrack'),
      thumb: document.getElementById('colorBarThumb'),
      dot: document.getElementById('colorBarDot'),
      label: document.getElementById('colorBarLabel'),
      resetBtn: document.getElementById('colorBarReset'),
      monthGrid: document.getElementById('monthGrid'),
      sceneGroup: document.getElementById('sceneGroup'),
      cultivationGroup: document.getElementById('cultivationGroup'),
      nameInput: document.getElementById('nameInput'),
      meaningInput: document.getElementById('meaningInput'),
    };

    try {
      allFlowers = loadFlowers();
    } catch (err) {
      console.error(err);
      els.tbody.innerHTML = '';
      els.noResults.textContent = '花データを読み込めませんでした。';
      els.noResults.style.display = 'block';
      return;
    }

    setupRowNavigation();
    setupSortHeaders();
    setupColorBar();
    setupMonthButtons();
    setupBadgeFilters();
    setupTextInputs();
    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
