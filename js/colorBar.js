// 上部の虹色バー（カラーピッカー）。
// クリックされた位置の色を拾って onPick(rgb) で通知し、選択位置にピンを描く。

(function (global) {
    'use strict';

    const GRADIENT_STOPS = [
        '#FF0000', '#FF8000', '#FFFF00', '#00FF00',
        '#00FFFF', '#0000FF', '#FF00FF', '#FF0000',
    ];
    const SIDE_PADDING = 20; // CSS 側の left/right 20px と合わせる

    global.initColorBar = function initColorBar(onPick) {
        const colorCanvas = document.getElementById('color-canvas');
        const colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true });
        const pinCanvas = document.getElementById('pin-canvas');
        const pinCtx = pinCanvas.getContext('2d');

        function syncSizes() {
            const width = colorCanvas.parentElement.clientWidth;
            colorCanvas.width = width - SIDE_PADDING * 2;
            colorCanvas.height = 12;

            const grad = colorCtx.createLinearGradient(0, 0, colorCanvas.width, 0);
            GRADIENT_STOPS.forEach((c, i) => grad.addColorStop(i / (GRADIENT_STOPS.length - 1), c));
            colorCtx.fillStyle = grad;
            colorCtx.fillRect(0, 0, colorCanvas.width, 12);

            pinCanvas.width = width;
            pinCanvas.height = 40;
        }

        function drawPin(barX, r, g, b) {
            pinCtx.clearRect(0, 0, pinCanvas.width, pinCanvas.height);
            const x = barX + SIDE_PADDING;
            const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

            pinCtx.beginPath();
            pinCtx.arc(x, 20, 15, 0, Math.PI * 2);
            pinCtx.fillStyle = '#FFFFFF';
            pinCtx.fill();

            pinCtx.beginPath();
            pinCtx.arc(x, 20, 11, 0, Math.PI * 2);
            pinCtx.fillStyle = hex;
            pinCtx.fill();
        }

        function clearPin() {
            pinCtx.clearRect(0, 0, pinCanvas.width, pinCanvas.height);
        }

        window.addEventListener('resize', syncSizes);
        syncSizes();

        colorCanvas.addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const scaleX = colorCanvas.width / rect.width;
            const canvasX = (e.clientX - rect.left) * scaleX;

            const pixel = colorCtx.getImageData(canvasX, 6, 1, 1).data;
            if (pixel[3] === 0) return;

            drawPin(canvasX / scaleX, pixel[0], pixel[1], pixel[2]);
            onPick([pixel[0], pixel[1], pixel[2]]);
        });

        return { clearPin };
    };
})(window);
