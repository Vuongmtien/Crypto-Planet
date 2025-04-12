function updatePortfolioOverview() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      document.getElementById("account-email").innerText = user.email;
  
      // Tổng tài sản demo
      const total = 25000 + 7000;
      document.getElementById("total-balance").innerText = `$${total.toLocaleString()}`;
    }
  }
  
  document.addEventListener("DOMContentLoaded", updatePortfolioOverview);
  function updateTablePrice(id, newPrice) {
    const el = document.getElementById(id);
    if (!el) return;
  
    const currentPrice = parseFloat(el.textContent.replace(/[^\d.]/g, ''));
    if (isNaN(currentPrice) || currentPrice === newPrice) return;
  
    const className = newPrice > currentPrice ? "price-up" : "price-down";
  
    el.classList.add(className);
    el.textContent = `${newPrice.toFixed(2)} USD`;
  
    setTimeout(() => {
      el.classList.remove("price-up", "price-down");
    }, 1000);
  }
 
    setInterval(() => {
        updateTablePrice("price-ada", getRandomPrice(0.6, 0.8));
        updateChangePercent("change-ada");
      
        updateTablePrice("price-avax", getRandomPrice(18, 22));
        updateChangePercent("change-avax");
      
        updateTablePrice("price-bnb", getRandomPrice(580, 620));
        updateChangePercent("change-bnb");
      
        updateTablePrice("price-btc", getRandomPrice(600, 650));
        updateChangePercent("change-btc");
      
        updateTablePrice("price-eth", getRandomPrice(1800, 2000));
        updateChangePercent("change-eth");
      
        updateTablePrice("price-sol", getRandomPrice(20, 30));
        updateChangePercent("change-sol");
      }, 4000);
      
  
  function getRandomPrice(min, max) {
    return Math.random() * (max - min) + min;
  }
  function updateChangePercent(id) {
    const el = document.getElementById(id);
    if (!el) return;
  
    const isUp = Math.random() > 0.4;
    const percent = (Math.random() * 5).toFixed(2); // VD: 0.87%
  
    el.textContent = `${isUp ? "+" : "-"}${percent}%`;
  
    el.classList.add(isUp ? "percent-up" : "percent-down");
  
    setTimeout(() => {
      el.classList.remove("percent-up", "percent-down");
    }, 1000);
  }
        