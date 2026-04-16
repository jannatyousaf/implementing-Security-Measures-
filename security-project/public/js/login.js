document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('registerBtn').addEventListener('click', goToRegister);

function showPopup(message, success = true) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.style.background = success ? 'green' : 'red';
  popup.innerText = message;

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 3000);
}

async function login() {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });

  if (!res.ok) {
    const error = await res.text();
    showPopup(error, false);
    return;
  }

  const data = await res.json();
  localStorage.setItem('token', data.token);

  showPopup('Login successful', true);

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
}

function goToRegister() {
  window.location.href = 'register.html';
}