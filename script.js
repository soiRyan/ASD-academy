/* アスペ学園 — Main Script */

// ── Navigation toggle ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Active nav link ──
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

// ── Scroll animations ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('vis'), i * 75);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('[data-a]').forEach(el => observer.observe(el));

// ── FAQ accordion ──
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (!q) return;
  q.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

// ── Reservation form validation ──
const resForm = document.getElementById('resForm');
if (resForm) {
  resForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // clear errors
    resForm.querySelectorAll('.form-input,.form-select,.form-textarea').forEach(f => f.classList.remove('err'));
    resForm.querySelectorAll('.form-err').forEach(m => m.classList.remove('show'));

    function check(id, errId, cond, msg) {
      const f = document.getElementById(id);
      const m = document.getElementById(errId);
      if (f && !cond(f.value)) {
        f.classList.add('err');
        if (m) { m.textContent = msg; m.classList.add('show'); }
        valid = false;
      }
    }

    check('fname',   'fname-err',   v => v.trim().length >= 1, '名前を入力してください。');
    check('femail',  'femail-err',  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), '正しいメールアドレスを入力してください。');
    check('fdate',   'fdate-err',   v => v.trim() !== '', '希望日を選択してください。');
    check('fmember', 'fmember-err', v => v !== '', '希望メンバーを選択してください。');

    if (valid) {
      resForm.style.display = 'none';
      const s = document.getElementById('formSuccess');
      if (s) s.classList.add('show');
    }
  });
}

// ── Age check ──
const ageBtnYes = document.getElementById('ageBtnYes');
const ageBtnNo  = document.getElementById('ageBtnNo');
const ageDenied = document.getElementById('ageDenied');

if (ageBtnYes) {
  ageBtnYes.addEventListener('click', () => {
    sessionStorage.setItem('ageOk', '1');
    location.href = 'index.html';
  });
}
if (ageBtnNo && ageDenied) {
  ageBtnNo.addEventListener('click', () => {
    ageDenied.style.display = 'block';
    ageBtnNo.disabled  = true;
    ageBtnYes.disabled = true;
    ageBtnYes.style.opacity = '0.35';
  });
}

// ── Campus map interaction ──
function mapHighlight(room) {
  document.querySelectorAll('.map-room').forEach(r => r.classList.remove('hl'));
  document.querySelectorAll('.map-loc-card').forEach(c => { c.classList.remove('hl'); });

  document.querySelectorAll(`.map-room[data-room="${room}"]`).forEach(r => r.classList.add('hl'));
  const card = document.getElementById('loc-' + room);
  if (card) {
    card.classList.add('hl');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  setTimeout(() => {
    document.querySelectorAll('.map-room,.map-loc-card').forEach(el => el.classList.remove('hl'));
  }, 2600);
}

document.addEventListener('DOMContentLoaded', function(){

  const weekdays = ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"];
  const todayIndex = new Date().getDay();
  const todayName = weekdays[todayIndex];

  // プロフィールページの全スケジュール要素を取得
  const schedules = document.querySelectorAll('.schedule');

  schedules.forEach(scheduleDiv => {
    const scheduleData = JSON.parse(scheduleDiv.dataset.schedule);

    // 出勤表を作成
    const table = document.createElement('table');
    table.classList.add('profile-table');

    for(const day of weekdays){
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = day;
      const td = document.createElement('td');
      td.textContent = scheduleData[day] || "未設定";
      tr.appendChild(th);
      tr.appendChild(td);
      table.appendChild(tr);

      // 今日出勤なら h1 にバナー追加
      if(day === todayName && scheduleData[day] !== "休み"){
        const badge = document.createElement('span');
        badge.classList.add('today-badge');
        badge.textContent = "本日出勤";
        const nameEl = document.querySelector('h1');
        if(nameEl && !nameEl.querySelector('.today-badge')){
          nameEl.appendChild(badge);
        }
      }
    }

    scheduleDiv.appendChild(table);
  });

});