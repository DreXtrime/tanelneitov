'use strict';

/* Clock */
function tick() {
    const d = new Date();
    document.getElementById('clock').textContent =
        String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0');
}

tick();
setInterval(tick, 15000);

/* State */
let xpOn = false, minimized = false;
const body = document.body;
const card = document.getElementById('card');
const winChip = document.getElementById('winChip');

/* Activate XP */
function activateXP() {
    if (xpOn) return;
    xpOn = true;
    const r = card.getBoundingClientRect();
    card.style.cssText = `position:fixed;left:${r.left}px;top:5px;width:${r.width}px;`;
    body.classList.add('xp-active');
}

/* Deactivate */
function deactivateXP(e) {
    if (e) e.stopPropagation();
    if (!xpOn) return;
    xpOn = false;
    minimized = false;
    body.classList.remove('xp-active', 'xp-minimized');
    e.stopPropagation();
    document.getElementById('catPopup').classList.remove('visible');
    document.getElementById('recyclePopup').classList.remove('visible');
    body.classList.remove('disco-mode');
    setTimeout(() => {
        if (!xpOn) card.style.cssText = '';
    }, 420);
}

/* Minimize */
function setMinimized(v) {
    minimized = v;
    body.classList.toggle('xp-minimized', minimized);
}

document.getElementById('btnMin').addEventListener('click', e => {
    e.stopPropagation();
    setMinimized(!minimized);
});
document.getElementById('btnClose').addEventListener('click', deactivateXP);
winChip.addEventListener('click', () => {
    if (minimized) setMinimized(false);
});

/* Trigger */

// background click to activate XP is too obvious possibly
// document.getElementById('bg').addEventListener('click', activateXP);
document.getElementById('startBtn').addEventListener('click', deactivateXP);
document.getElementById('startBtn2').addEventListener('click', activateXP);
card.addEventListener('click', e => e.stopPropagation());
document.getElementById('taskbar').addEventListener('click', e => e.stopPropagation());

/* Drag */
let drag = false, ox = 0, oy = 0, sl = 0, st = 0;
document.getElementById('winBar').addEventListener('mousedown', e => {
    if (!xpOn || e.target.closest('.win-btns')) return;
    drag = true;
    ox = e.clientX;
    oy = e.clientY;
    sl = parseFloat(card.style.left) || 0;
    st = parseFloat(card.style.top) || 0;
    e.preventDefault();
});
window.addEventListener('mousemove', e => {
    if (!drag) return;
    card.style.left = (sl + e.clientX - ox) + 'px';
    card.style.top = (st + e.clientY - oy) + 'px';
});
window.addEventListener('mouseup', () => drag = false);

/* Disco */
function toggleDisco() {
    body.classList.toggle('disco-mode');
}

document.getElementById('discoLink')?.addEventListener('click', e => {
    e.preventDefault();
    toggleDisco();
});
document.getElementById('iconDisco').addEventListener('click', toggleDisco);

/* Cat icon */
document.querySelector('.icon-cat').addEventListener('click', () => {
    document.getElementById('catPopup').classList.toggle('visible');
});

document.getElementById('catClose').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('catPopup').classList.remove('visible');
});

/* Recycle bin */
document.getElementById('iconRecycle').addEventListener('click', () => {
    document.getElementById('recyclePopup').classList.toggle('visible');
});

document.getElementById('recycleClose').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('recyclePopup').classList.remove('visible');
});
