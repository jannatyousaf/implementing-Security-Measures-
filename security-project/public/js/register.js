document.getElementById('registerBtn').addEventListener('click', register);
document.getElementById('loginBtn').addEventListener('click', goToLogin);
async function getCsrfToken() {
  const res = await fetch('/api/csrf-token');
  const data = await res.json();
  return data.csrfToken;
}

function showPopup(message, success = true) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.style.background = success ? 'green' : 'red';
  popup.innerText = message;

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 3000);
}

async function register() {
  const csrfToken = await getCsrfToken();
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json',
              'CSRF-Token': csrfToken
    },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });

  const text = await res.text();

  if (res.ok) {
    showPopup(text, true);
  } else {
    showPopup(text, false);
  }
}

function goToLogin() {
  window.location.href = 'login.html';
}