const API_URL = "https://68162d2832debfe95dbda9b5.mockapi.io/users";

// ====== ĐĂNG KÝ USER ======
async function handleSignup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!username || !email || !password) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const avatar = `https://i.pravatar.cc/150?u=${email}`;
  const role = "user";

  try {
    const resCheck = await fetch(API_URL);
    const users = await resCheck.json();
    const exists = users.find(u => u.email === email);
    if (exists) {
      alert("Email đã tồn tại. Vui lòng dùng email khác.");
      return;
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, avatar, role })
    });

    if (res.ok) {
      alert("Đăng ký thành công!");
      switchPopup('sign-up-popup', 'sign-in-popup');
    } else {
      alert("Đăng ký thất bại!");
    }
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    alert("Đăng ký thất bại!");
  }
}

// ====== ĐĂNG NHẬP USER ======
async function handleLogin() {
  const email = document.querySelector('#sign-in-popup input[type="email"]').value.trim();
  const password = document.querySelector('#sign-in-popup input[type="password"]').value.trim();

  try {
    const res = await fetch(API_URL);
    const users = await res.json();

    const matchedUser = users.find(u => u.email === email && u.password === password);

    if (!matchedUser) {
      alert("Email hoặc mật khẩu không đúng!");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(matchedUser));
    localStorage.setItem("userEmail", matchedUser.email);

    alert("Đăng nhập thành công!");
    updateLoginStatus();
    closePopup('sign-in-popup');
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    alert("Lỗi đăng nhập.");
  }
}

// ====== CẬP NHẬT GIAO DIỆN USER SAU LOGIN ======
function updateLoginStatus() {
  const userData = localStorage.getItem("currentUser");
  if (userData) {
    const user = JSON.parse(userData);
    const loginInfo = document.getElementById("user-email");
    if (loginInfo) {
      loginInfo.innerText = `👋 Xin chào, ${user.email}`;
      setTimeout(() => loginInfo.classList.add("show"), 50);
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.style.display = "inline-block";

    const signInBtn = document.querySelector('[data-popup="sign-in-popup"]');
    const signUpBtn = document.querySelector('[data-popup="sign-up-popup"]');
    if (signInBtn) signInBtn.style.display = "none";
    if (signUpBtn) signUpBtn.style.display = "none";
  }
}

// ====== SỰ KIỆN DOM LOADED ======
document.addEventListener("DOMContentLoaded", () => {
  updateLoginStatus();
  updateAllPrices();
  setInterval(updateAllPrices, 30000);

  // Gán sự kiện đăng ký
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleSignup();
    });
  }

  // Gán sự kiện logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userEmail");

      const loginInfo = document.getElementById("user-email");
      if (loginInfo) {
        loginInfo.innerText = "Chưa đăng nhập";
        loginInfo.classList.remove("show");
      }

      const signInBtn = document.querySelector('[data-popup="sign-in-popup"]');
      const signUpBtn = document.querySelector('[data-popup="sign-up-popup"]');
      if (signInBtn) signInBtn.style.display = "inline-block";
      if (signUpBtn) signUpBtn.style.display = "inline-block";

      logoutBtn.style.display = "none";
    });
  }
});


// ====== CẬP NHẬT GIÁ COIN ======
function updatePrice(id, newPrice) {
  const priceElement = document.getElementById(id);
  if (!priceElement) return;

  const oldPriceText = priceElement.textContent.replace(/[^0-9.-]+/g, '');
  const oldPrice = parseFloat(oldPriceText);

  if (!isNaN(oldPrice) && oldPrice !== newPrice) {
    const isUp = newPrice > oldPrice;
    const className = isUp ? 'price-up' : 'price-down';

    priceElement.classList.add(className);
    setTimeout(() => priceElement.classList.remove(className), 1000);

    priceElement.innerHTML = `$${newPrice.toLocaleString()}`;
  }
}

setInterval(() => {
  updatePrice("price-btc", getRandomPrice(38400, 38700));
  updatePrice("price-bnb", getRandomPrice(38300, 38600));
  updatePrice("price-eth", getRandomPrice(38100, 38500));
  updatePrice("price-xrp", getRandomPrice(38200, 38550));
}, 3000);

function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ====== API COINGECKO ======
async function fetchMarketData() {
  const coinGeckoIDs = [
    "bitcoin", "ethereum", "binancecoin", "solana",
    "cardano", "dogecoin", "ripple", "tron",
    "tether", "usd-coin", "avalanche-2"
  ];
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinGeckoIDs.join(",")}`;
  const res = await fetch(url);
  return await res.json();
}

function updateCoinPriceUI(coinId, price, change) {
  const priceEl = document.getElementById(`price-${coinId}`);
  const changeEl = document.getElementById(`change-${coinId}`);

  if (priceEl) priceEl.textContent = `${price.toLocaleString()} USD`;
  if (changeEl) {
    changeEl.textContent = `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
    changeEl.classList.remove("up", "down");
    changeEl.classList.add(change >= 0 ? "up" : "down");
  }
}

function updateFE1CardPrice(coinId, price, change) {
  const card = document.getElementById(`price-${coinId}`);
  if (card) {
    card.innerHTML = `$${price.toLocaleString()} <span class="crypto-change ${change >= 0 ? 'positive' : 'negative'}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</span>`;
  }
}

async function updateAllPrices() {
  const data = await fetchMarketData();
  data.forEach(coin => {
    const id = coin.id;

    updateCoinPriceUI(id, coin.current_price, coin.price_change_percentage_24h);
    updateFE1CardPrice(id, coin.current_price, coin.price_change_percentage_24h);
  });
}
