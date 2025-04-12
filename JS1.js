function handleLogin() {
    const email = document.querySelector('#sign-in-popup input[type="email"]').value;
    const password = document.querySelector('#sign-in-popup input[type="password"]').value;
  
    const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
  
    if (!storedUser) {
      alert("Không tìm thấy tài khoản. Vui lòng đăng ký trước!");
      return;
    }
  
    if (email === storedUser.email && password === storedUser.password) {
      alert("Đăng nhập thành công!");
  
      // Lưu người dùng đang đăng nhập
      localStorage.setItem("currentUser", JSON.stringify(storedUser));
  
      // Cập nhật giao diện
      updateLoginStatus();
  
      // Đóng popup
      closePopup('sign-in-popup');
    } else {
      alert("Email hoặc mật khẩu không đúng!");
    }
  }
  
  
  document.addEventListener("DOMContentLoaded", updateLoginStatus);
  function updateLoginStatus() {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const user = JSON.parse(userData);
      const loginInfo = document.getElementById("user-email");
      if (loginInfo) {
        loginInfo.innerText = `👋 Xin chào, ${user.email}`;
        setTimeout(() => loginInfo.classList.add("show"), 50); // ✨ Thêm hiệu ứng
      }
      document.getElementById("logout-btn").style.display = "inline-block";

    // ✅ Ẩn Sign In và Sign Up
    document.querySelector('[data-popup="sign-in-popup"]').style.display = "none";
    document.querySelector('[data-popup="sign-up-popup"]').style.display = "none";
  
    }
  }
  
  function handleSignup() {
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
  
    if (!username || !email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
  
    // Lưu thông tin user vào localStorage
    const userData = { username, email, password };
    localStorage.setItem("registeredUser", JSON.stringify(userData));
  
    alert("Đăng ký thành công!");
  
    // Chuyển sang form đăng nhập
    switchPopup('sign-up-popup', 'sign-in-popup');
  }
  document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.removeItem("currentUser"); // Xoá user
    document.getElementById("user-email").innerText = ""; // Xoá hiển thị email
    document.getElementById("logout-btn").style.display = "none"; // Ẩn logout
    document.querySelector('[data-popup="sign-in-popup"]').style.display = "inline-block"; // Hiện lại Sign In
    document.querySelector('[data-popup="sign-up-popup"]').style.display = "inline-block"; // Hiện lại Register
  });
  function updatePrice(id, newPrice) {
    const priceEl = document.getElementById(id);
    const currentPrice = parseFloat(priceEl.innerText.replace(/[^\d.]/g, ""));
  
    if (!currentPrice || currentPrice === newPrice) return;
  
    if (newPrice > currentPrice) {
      priceEl.classList.add("price-change-up");
    } else if (newPrice < currentPrice) {
      priceEl.classList.add("price-change-down");
    }
  
    priceEl.innerText = `$${newPrice.toLocaleString()}`;
  
    setTimeout(() => {
      priceEl.classList.remove("price-change-up", "price-change-down");
    }, 1000);
  }
  setInterval(() => {
    const randomPrice = 38000 + Math.floor(Math.random() * 1000);
    updatePrice("price-btc", randomPrice);
  }, 3000);
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
  }, 3000); // cập nhật mỗi 3 giây
  
  function getRandomPrice(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
         
    