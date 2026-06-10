// スムーズスクロール（<a href="#...">）
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 64; // ヘッダー高さ
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    // モバイルメニューを閉じる
    navLinks.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ハンバーガーメニュー
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// コンタクトフォーム送信 → Google スプレッドシートへ
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmpcg21hzTh20qMs8xDn6d9h69uKFfFte9N0jQediR5KQpqSMT3iQ3jJK4Ik6aXE7TYQ/exec';

document.querySelector('.contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.btn-send');

  btn.textContent = '送信中…';
  btn.disabled = true;

  const payload = {
    name:    form.name.value,
    email:   form.email.value,
    message: form.message.value,
  };

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    btn.textContent = '送信しました！';
    btn.style.background = '#7ABEAA';
    form.reset();
  } catch (err) {
    btn.textContent = '送信に失敗しました。再度お試しください。';
    btn.style.background = '#E07B4F';
    btn.disabled = false;
  }
});
