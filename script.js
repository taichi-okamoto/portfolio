// スムーズスクロール（<a href="#...">）
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const offset = 64;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });

    if (navLinks && hamburger) {
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
});

// ハンバーガーメニュー
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
}

// コンタクトフォーム送信 → Google スプレッドシートへ
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmpcg21hzTh20qMs8xDn6d9h69uKFfFte9N0jQediR5KQpqSMT3iQ3jJK4Ik6aXE7TYQ/exec';

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const submitButton = contactForm.querySelector('.btn-send');
  const statusMessage = contactForm.querySelector('.form-status');

  const setStatus = (message, type = '') => {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.className = `form-status${type ? ` is-${type}` : ''}`;
  };

  const setFieldError = (fieldName, message) => {
    const field = contactForm.elements[fieldName];
    const error = contactForm.querySelector(`[data-error-for="${fieldName}"]`);
    const group = field?.closest('.form-group');

    if (error) error.textContent = message;
    if (group) group.classList.toggle('is-error', Boolean(message));
  };

  const clearErrors = () => {
    ['name', 'email', 'message'].forEach((fieldName) => setFieldError(fieldName, ''));
    setStatus('');
  };

  const validateForm = () => {
    const fields = contactForm.elements;
    const values = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      message: fields.message.value.trim(),
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    clearErrors();

    if (!values.name) {
      setFieldError('name', 'お名前を入力してください。');
      isValid = false;
    }

    if (!values.email) {
      setFieldError('email', 'メールアドレスを入力してください。');
      isValid = false;
    } else if (!emailPattern.test(values.email)) {
      setFieldError('email', 'メールアドレスの形式を確認してください。');
      isValid = false;
    }

    if (!values.message) {
      setFieldError('message', 'ご相談内容を入力してください。');
      isValid = false;
    }

    return { isValid, values };
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { isValid, values } = validateForm();
    if (!isValid) {
      setStatus('入力内容を確認してください。', 'error');
      return;
    }

    const originalText = submitButton.textContent;
    submitButton.textContent = '送信中...';
    submitButton.disabled = true;
    setStatus('送信しています。しばらくお待ちください。');

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      submitButton.textContent = '送信しました';
      submitButton.style.background = '#7ABEAA';
      setStatus('送信しました。内容を確認して折り返しご連絡します。', 'success');
      contactForm.reset();
    } catch (err) {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.style.background = '';
      setStatus('送信に失敗しました。時間をおいて再度お試しください。', 'error');
    }
  });
}
