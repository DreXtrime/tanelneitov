'use strict';

/* State */
let xpOn = false, minimized = false;
const body = document.body;
const card = document.getElementById('card');
const winChip = document.getElementById('winChip');

tick();
setInterval(tick, 15000);

// Desktop icons
const icons = [
    {
        id: 'recycle',
        label: 'Recycle Bin',
        img: 'public/recycle_bin.png',
        alt: 'Recycle bin',
        position: {top: '50px', right: '22px'},
        window: {
            title: 'Recycle Bin',
            width: '320px',
            content: `
                <div class="window-body" style="margin:0; padding:0;">
                    <div style="padding: 4px 8px; font-family: var(--font-xp); font-size: 11px; color: #666; border-bottom: 1px solid #ccc;">
                        2 object(s)
                    </div>
                    <a href="https://www.linkedin.com/in/tanel-erik-neitov/" target="_blank"
                       style="display:flex; align-items:center; gap:10px; padding:8px 12px; text-decoration:none; color:inherit;">
                        <img src="public/linkedin.svg"
                             style="width:32px; height:32px; flex-shrink:0;" alt="linkedin icon">
                        <div style="font-family: var(--font-xp); font-size: 12px;">
                            <div style="color:#000; font-weight:600;">linkedin_profile.url</div>
                            <div style="color:#666; font-size:11px;">Date: 20/06/2025</div>
                        </div>
                    </a>
                    <a href="https://github.com/DreXtrime/tanelneitov" target="_blank"
                       style="display:flex; align-items:center; gap:10px; padding:8px 12px; text-decoration:none; color:inherit;">
                        <img src="public/github.svg"
                             style="width:32px; height:32px; flex-shrink:0;" alt="missing image icon">
                        <div style="font-family: var(--font-xp); font-size: 12px;">
                            <div style="color:#000; font-weight:600;">github_repo_for_this_site.url</div>
                            <div style="color:#666; font-size:11px;">Date: 17/10/2026</div>
                        </div>
                    </a>
                </div>
            `
        }
    },
    {
        id: 'about',
        label: 'about_me.txt',
        img: 'public/about.webp',
        alt: 'icon of a notepad',
        position: {bottom: '600px', right: '22px'},
        window: {
            title: 'Notepad - about_me.txt',
            width: '600px',
            content: `
                <pre style="
                    font-size: 14px;
                    color: inherit;
                    padding: 8px;
                    white-space: pre-wrap;
                    line-height: 1.6;
                    background: none;
                    border: none;
                    margin: 0;
                    overflow-wrap: break-word;
                    word-break: break-word;
                    max-width: 100%;
    ">I like building things and setting up the infra to run it, based in Tallinn.

Good at planning and pretty good at bringing those plans to life if I'd say so myself. 

At home I keep a small homelab for local LLMs, media storage and transcoding, and photo backups. It started as little project and kind of never stopped.
</pre>
<img src="public/about_pic.webp" style="width: 64px; display:block;" alt="cat dancing">
        `
        }
    },
    {
        id: 'cat',
        label: 'cat.gif',
        img: 'public/cat.webp',
        alt: 'Icon of a cat with its paws up',
        position: {bottom: '50px', right: '22px'},
        window: {
            title: 'cat.gif',
            width: '200px',
            content: `<img src="public/cat.gif" style="width:100%; display:block;" alt="cat dancing">`
        }
    },
    {
        id: 'disco',
        label: 'Disco.exe',
        img: 'public/discoball.svg',
        alt: 'Disco ball',
        position: {bottom: '150px', right: '22px'},
        onOpen: () => body.classList.add('disco-mode'),
        onClose: () => body.classList.remove('disco-mode'),
        window: {
            title: 'Disco',
            width: '320px',
            content: `<img src="public/discoball.gif" style="width:100%; display:block;" alt="spinning disco ball">`
        }
    },
    {
        id: 'certificate',
        label: 'Certificate.png',
        img: 'public/certificate_icon.png',
        alt: 'Certificate.webp',
        position: {bottom: '250px', right: '22px'},
        window: {
            title: 'A Certificate from kood// about my studies. Thank you to the staff and fellow students!',
            width: '920px',
            content: `<img src="public/certificate.webp" style="width:100%; display:block;" alt="certificate of kood">`
        }
    },

];

/* Populate the icons on desktop */
icons.forEach(icon => {
    const el = document.createElement('div');
    el.className = 'd-icon';
    el.style.cssText = Object.entries(icon.position)
        .map(([k, v]) => `${k}:${v}`).join(';');
    el.innerHTML =
        `<img src="${icon.img}" alt="${icon.alt}">
        <span>${icon.label}</span>`;
    el.addEventListener('click', () => openWindow(icon));
    document.getElementById('desktop-icons').appendChild(el);
});

/* Handle window dragging */
function makeDraggable(windowEl) {
    const titleBar = windowEl.querySelector('.title-bar');
    let drag = false, ox = 0, oy = 0, sl = 0, st = 0;

    titleBar.addEventListener('mousedown', e => {
        if (e.target.closest('.title-bar-controls')) return;
        drag = true;
        ox = e.clientX;
        oy = e.clientY;
        sl = parseFloat(windowEl.style.left) || windowEl.getBoundingClientRect().left;
        st = parseFloat(windowEl.style.top) || windowEl.getBoundingClientRect().top;
        windowEl.style.left = sl + 'px';
        windowEl.style.top = st + 'px';
        windowEl.style.bottom = 'auto';
        windowEl.style.right = 'auto';
        e.preventDefault();
    });

    window.addEventListener('mousemove', e => {
        if (!drag) return;
        windowEl.style.left = (sl + e.clientX - ox) + 'px';
        windowEl.style.top = (st + e.clientY - oy) + 'px';
    });

    window.addEventListener('mouseup', () => drag = false);
}

/* handle opening/closing windows from the icons */
function openWindow(icon) {
    const existing = document.getElementById(`window-${icon.id}`);
    if (existing) {
        existing.classList.add('visible');
        if (icon.onOpen) icon.onOpen();
        return;
    }

    const win = document.createElement('div');
    win.className = 'window xp-window visible';
    win.id = `window-${icon.id}`;
    win.style.cssText = `position:fixed; z-index:800; width:${icon.window.width};` +
        Object.entries(icon.position).map(([k, v]) => `${k}:${v}`).join(';');

    win.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">${icon.window.title}</div>
            <div class="title-bar-controls">
                <button aria-label="Close"></button>
            </div>
        </div>
        <div class="window-body" style="margin:0; padding:4px;">
            ${icon.window.content}
        </div>
    `;

    win.querySelector('[aria-label="Close"]').addEventListener('click', e => {
        e.stopPropagation();
        if (icon.onClose) icon.onClose();
        win.classList.remove('visible');
    });

    if (icon.onOpen) icon.onOpen();

    document.body.appendChild(win);
    makeDraggable(win);
}

/* Clock */
function tick() {
    const d = new Date();
    document.getElementById('clock').textContent =
        String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0');
}

/* Activate XP */
function activateXP() {
    if (xpOn) return;
    xpOn = true;
    const scrollTop = window.scrollY;
    const r = card.getBoundingClientRect();
    card.style.cssText = `position:fixed;left:${r.left}px;top:5px;width:${r.width}px;`;
    body.classList.add('xp-active');
    document.querySelector('.card-body').scrollTop = scrollTop;
}

/* Deactivate */
function deactivateXP(e) {
    if (e) e.stopPropagation();
    if (!xpOn) return;
    xpOn = false;
    minimized = false;
    body.classList.remove('xp-active', 'xp-minimized');
    body.classList.remove('disco-mode');

    document.querySelectorAll('.xp-window').forEach(win => {
        win.classList.remove('visible');
    });

    setTimeout(() => {
        if (!xpOn) {
            card.style.cssText = '';
        }
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

