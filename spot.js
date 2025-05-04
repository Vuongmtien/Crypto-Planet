// ===== Watchlist Dropdown =====
const toggleBtn = document.getElementById('watchlistToggle');
const menu = document.getElementById('watchlistMenu');

document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
    menu.classList.remove('show');
  }
});

// ===== Global Variables =====
let currentPrice = 0;

// ===== Fetch Exchange Coin =====
async function fetchCoinData(coinId = 'bitcoin') {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const data = await res.json();
    currentPrice = data.market_data.current_price.usd;

    document.querySelector('.balance-row span').textContent = `$${currentPrice.toLocaleString()}`;
    document.querySelector('.balance-row img').src = data.image.small;
    document.querySelector('.balance-row img').alt = coinId.toUpperCase();

    updateConvertedPrice();
  } catch (err) {
    console.error("Coin fetch error:", err);
  }
}

// ===== Update Converted Price =====
function updateConvertedPrice() {
  const amount = parseFloat(document.getElementById("coinAmount").value);
  const result = isNaN(amount) ? 0 : amount * currentPrice;
  document.getElementById("convertedPrice").value = `$${result.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

// ===== Populate Coin Dropdown =====
async function populateCoinDropdown() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd");
    const coins = await res.json();

    const select = document.getElementById("coinSelect");
    select.innerHTML = "";

    coins.slice(0, 20).forEach((coin) => {
      const option = document.createElement("option");
      option.value = coin.id;
      option.textContent = coin.symbol.toUpperCase();
      select.appendChild(option);
    });

    fetchCoinData(select.value);
  } catch (err) {
    console.error("Dropdown load error:", err);
  }
}

// ===== Fetch Market Data =====
async function fetchMarketData() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,cardano,solana,tether,usd-coin,ripple,dogecoin,tron");
    const data = await res.json();
    updateWatchlist(data);
    updateTopGainers(data);
  } catch (err) {
    console.error("Market fetch error:", err);
  }
}

// ===== Update Watchlist =====
function updateWatchlist(coins) {
    const tbody = document.getElementById("watchlistBody");
  
    coins.forEach((coin) => {
      const rowId = `row-${coin.id}`;
      let row = document.getElementById(rowId);
  
      const price = `$${coin.current_price.toLocaleString()}`;
      const change = coin.price_change_percentage_24h.toFixed(2);
      const changeText = `${change >= 0 ? "+" : ""}${change}%`;
      const priceClass = change >= 0 ? "percent-up" : "percent-down";
  
      if (!row) {
        row = document.createElement("tr");
        row.id = rowId;
        row.innerHTML = `
          <td>
            <div class="flex items-center gap-2">
              <img src="${coin.image}" class="icon">
              ${coin.name} <span class="tag">${coin.symbol.toUpperCase()}</span>
            </div>
          </td>
          <td class="price text-right" data-value="${coin.current_price}">
            ${price}
          </td>
          <td class="change ${priceClass} text-center" data-value="${change}">
            ${changeText}
          </td>
          <td class="text-right">
            $${coin.high_24h.toLocaleString()}
          </td>
          <td class="text-right">
            $${coin.low_24h.toLocaleString()}
          </td>
          <td class="text-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Line_chart.svg" class="chart-preview">
          </td>
        `;
        tbody.appendChild(row);
      } else {
        const priceEl = row.querySelector(".price");
        const changeEl = row.querySelector(".change");
  
        const oldPrice = parseFloat(priceEl.dataset.value);
        const newPrice = coin.current_price;
        if (newPrice !== oldPrice) {
          priceEl.textContent = `$${newPrice.toLocaleString()}`;
          priceEl.dataset.value = newPrice;
          priceEl.classList.remove("price-up", "price-down");
          const className = newPrice > oldPrice ? "price-up" : "price-down";
          priceEl.classList.add(className);
          flash(priceEl);
        }
  
        const oldChange = parseFloat(changeEl.dataset.value);
        const newChange = coin.price_change_percentage_24h;
        if (newChange !== oldChange) {
          changeEl.textContent = `${newChange >= 0 ? "+" : ""}${newChange.toFixed(2)}%`;
          changeEl.dataset.value = newChange;
          changeEl.classList.remove("price-up", "price-down");
          const changeClass = newChange >= 0 ? "percent-up" : "percent-down";
          changeEl.classList.add(changeClass);
          flash(changeEl);
        }
      }
    });
  }
  

// ===== Update Top Gainers =====
function updateTopGainers(coins) {
  const container = document.getElementById("topGainersList");
  const top = coins
    .filter(c => c.price_change_percentage_24h != null)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  container.innerHTML = `
    <div class="tabs">
      <button class="tab active">Top Gainers</button>
      <button class="tab">Top Loser</button>
    </div>
    ${top.map(coin => `
      <div class="gainer-item">
        <img src="${coin.image}" class="mini-icon" alt="${coin.name}">
        <div class="info">
          <strong>${coin.name}</strong> <span class="tag">${coin.symbol.toUpperCase()}</span><br>
          <small class="price" data-value="${coin.current_price}">$${coin.current_price.toLocaleString()}</small>
        </div>
        <span class="gainer-change change ${coin.price_change_percentage_24h >= 0 ? 'percent-up' : 'percent-down'}">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </span>
      </div>
    `).join("")}
  `;
}

// ===== Flash Animation =====
function flash(el) {
  el.classList.remove("price-flash");
  void el.offsetWidth;
  el.classList.add("price-flash");
  setTimeout(() => el.classList.remove("price-flash"), 100);
}

// ===== Auto Fetch Loop =====
window.addEventListener("load", () => {
  populateCoinDropdown();
  fetchCoinData("bitcoin");
  fetchMarketData();
  setInterval(fetchMarketData, 1000);

  document.getElementById("coinSelect").addEventListener("change", function () {
    fetchCoinData(this.value);
  });

  document.getElementById("coinAmount").addEventListener("input", updateConvertedPrice);
});
