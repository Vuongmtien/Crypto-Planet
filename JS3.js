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

function updateCoinCard(coinId, price, change, image) {
  const priceEl = document.getElementById(`price-${coinId}`);
  const changeEl = document.getElementById(`change-${coinId}`) || document.getElementById(`percent-${coinId}`);
  const imgEl = document.getElementById(`img-${coinId}`);

  if (priceEl && !isNaN(price)) {
    const oldPrice = parseFloat(priceEl.getAttribute("data-value")) || 0;
    const formatted = `${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD`;
    priceEl.textContent = formatted;
    priceEl.setAttribute("data-value", price);

    // So sánh và nháy màu
    if (oldPrice && oldPrice !== price) {
      const flashClass = price > oldPrice ? "price-up" : "price-down";
      priceEl.classList.add(flashClass);
      setTimeout(() => priceEl.classList.remove(flashClass), 600);
    }
  }

  if (changeEl && !isNaN(change)) {
    const fixed = change.toFixed(2);
    changeEl.textContent = `${change >= 0 ? "+" : ""}${fixed}%`;
  
    // Xoá class cũ trước khi thêm mới
    changeEl.classList.remove("percent-up", "percent-down", "price-flash");
  
    // Thêm class màu + hiệu ứng nhấp nháy
    const className = change >= 0 ? "percent-up" : "percent-down";
    changeEl.classList.add(className, "price-flash");
  
    // Xoá hiệu ứng sau 0.6s
    setTimeout(() => changeEl.classList.remove("price-flash"), 600);
  }
  

  if (imgEl && image) {
    imgEl.src = image;
    imgEl.alt = coinId;
  }
}


async function updateJS3Prices() {
  try {
    const data = await fetchMarketData();
    data.forEach(coin => {
      updateCoinCard(
        coin.id,
        coin.current_price,
        coin.price_change_percentage_24h,
        coin.image
      );
    });
  } catch (error) {
    console.error("❌ Lỗi gọi API CoinGecko:", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  updateJS3Prices();
  setInterval(updateJS3Prices, 3000); // cập nhật mỗi 3 giây
});
const email = localStorage.getItem('userEmail');
if (email) {
  document.getElementById('account-email').textContent = email;
}
const toggleBtn = document.getElementById('watchlistToggle');
const menu = document.getElementById('watchlistMenu');
const dropdown = document.getElementById("watchlistDropdown");

 // Ngăn chuyển trang khi click (chỉ mở menu)
 toggleBtn.addEventListener("click", function (e) {
  e.preventDefault();
  menu.classList.toggle("show");
});

// Đóng menu khi click ra ngoài
document.addEventListener("click", function (e) {
  if (!dropdown.contains(e.target)) {
    menu.classList.remove("show");
  }
});


// Bấm ra ngoài thì đóng
document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
    menu.classList.remove('show');
  }
});

