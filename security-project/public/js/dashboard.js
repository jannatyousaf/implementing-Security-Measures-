window.addEventListener("load", loadDashboard);

document.getElementById("logoutBtn").addEventListener("click", confirmLogout);

function showPopup(message, success = true) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.style.background = success ? "green" : "red";
  popup.innerText = message;

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 3000);
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

function confirmLogout() {
  if (confirm("Are you sure you want to logout?")) {
    logout();
  }
}

function logout() {
  localStorage.removeItem("token");
  showPopup("Logged out successfully", true);

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
}

async function loadDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    showPopup("Please login first", false);

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

    return;
  }

  // Decode token
  const user = parseJwt(token);

  if (user && user.email) {
    document.getElementById("welcomeText").innerText =
      `Welcome ${user.email} 👋`;

    document.getElementById("userEmail").innerText = user.email;
  }

  const res = await fetch("/api/dashboard", {
    headers: {
      Authorization: token,
    },
  });

  const text = await res.text();

  if (!res.ok) {
    showPopup(text, false);
    return;
  }
  // Fetch total users
  const userRes = await fetch("/api/users/count", {
    headers: {
       "x-api-key": "mysecretkey123"
    },
  });

  const userData = await userRes.json();
  document.getElementById("totalUsers").innerText = userData.count;
  document.getElementById("data").innerText = text;
  showPopup("Dashboard loaded successfully 🎉", true);
}
