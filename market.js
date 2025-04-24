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

function updateCoinPrice(coinId, price, change, image) {
  const priceEl = document.getElementById(`price-${coinId}`);
  const changeEl = document.getElementById(`percent-${coinId}`);
  const imgEl = document.getElementById(`img-${coinId}`);

  if (priceEl && !isNaN(price)) {
    const oldPrice = parseFloat(priceEl.getAttribute("data-value")) || 0;
    priceEl.textContent = `$${price.toFixed(2)}`;
    priceEl.setAttribute("data-value", price);

    priceEl.classList.remove("price-up", "price-down");
    const className = price > oldPrice ? "price-up" : "price-down";
    priceEl.classList.add(className);
    setTimeout(() => priceEl.classList.remove(className), 500);
  }

  if (changeEl && !isNaN(change)) {
    const changeFixed = change.toFixed(2);
    changeEl.textContent = `${change >= 0 ? "+" : ""}${changeFixed}%`;

    changeEl.classList.remove("percent-up", "percent-down", "price-flash");
    changeEl.classList.add(change >= 0 ? "percent-up" : "percent-down", "price-flash");
    setTimeout(() => changeEl.classList.remove("price-flash"), 500);
  }

  if (imgEl && image) {
    imgEl.src = image;
    imgEl.alt = coinId;
  }
}


async function updatePrices() {
  try {
    const data = await fetchMarketData();
    data.forEach(coin => {
      updateCoinPrice(coin.id, coin.current_price, coin.price_change_percentage_24h, coin.image);
    });
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu từ CoinGecko:", err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  updatePrices();
  setInterval(updatePrices, 1000); // cập nhật mỗi 1 giây
});
const email = localStorage.getItem('userEmail');
if (email) {
  document.getElementById('account-email').textContent = email;
}
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userEmail");
      window.location.reload();
    });
  }

  if (currentUser) {
    document.getElementById("userEmail").textContent = currentUser.email;
    document.getElementById("userBalance").textContent = `$${currentUser.balance?.toLocaleString() || "0"}`;
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    document.getElementById("userEmail").textContent = "Chưa đăng nhập";
    document.getElementById("userBalance").textContent = "0";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});


  const toggleBtn = document.getElementById('watchlistToggle');
  const menu = document.getElementById('watchlistMenu');
  


  // Bấm ra ngoài thì đóng
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
      menu.classList.remove('show');
    }
  });

