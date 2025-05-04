// Chart.js - Biểu đồ Crypto Trend
window.addEventListener("load", () => {
  const ctx = document.getElementById("cryptoChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "BTC Price",
        data: [34000, 38000, 42000, 40000, 46000, 44000],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
});

// ============================
// Quản lý Users
// ============================

const apiUrl = "https://68162d2832debfe95dbda9b5.mockapi.io/users";
let sortKey = null;
let sortAsc = true;
let currentEditId = null;

let currentPage = 1;
const usersPerPage = 5;
let allUsers = [];

function loadUsers(filter = "") {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      allUsers = data;

      const tbody = document.querySelector("#userTable tbody");
      tbody.innerHTML = "";

      // Lọc user
      let filtered = data.filter(user =>
        user.username.toLowerCase().includes(filter.toLowerCase())
      );

      // Sắp xếp
      if (sortKey) {
        filtered.sort((a, b) => {
          let valA = a[sortKey] || "";
          let valB = b[sortKey] || "";
          if (typeof valA === "string") valA = valA.toLowerCase();
          if (typeof valB === "string") valB = valB.toLowerCase();

          if (valA < valB) return sortAsc ? -1 : 1;
          if (valA > valB) return sortAsc ? 1 : -1;
          return 0;
        });
      }

      // Phân trang
      const start = (currentPage - 1) * usersPerPage;
      const end = start + usersPerPage;
      const paginated = filtered.slice(start, end);

      // Render
      paginated.forEach(user => {
        tbody.innerHTML += `
          <tr>
            <td><img src="${user.avatar}" class="avatar-cell" alt="avatar" /></td>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
              <button onclick="editUser('${user.id}')">✏️ Sửa</button>
              <button onclick="deleteUser('${user.id}')">🗑️ Xóa</button>
            </td>
          </tr>
        `;
      });

      // Cập nhật chỉ số trang
      document.getElementById("pageIndicator").innerText = `Trang ${currentPage}`;
    });
}

// Thêm user
document.getElementById("addUserForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: name,
      email,
      avatar: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70 + 1)
    })
  }).then(() => {
    this.reset();
    loadUsers();
  });
});

// Xoá user
function deleteUser(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(() => loadUsers());
}

// Mở popup sửa
function editUser(id) {
  fetch(`${apiUrl}/${id}`)
    .then(res => res.json())
    .then(user => {
      document.getElementById("editName").value = user.username;
      document.getElementById("editEmail").value = user.email;
      document.getElementById("editAvatar").value = user.avatar || "";
      currentEditId = id;
      document.getElementById("editPopup").style.display = "flex";
    });
}

// Đóng popup
function closePopup() {
  document.getElementById("editPopup").style.display = "none";
  currentEditId = null;
}

// Cập nhật user
document.getElementById("editUserForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const newName = document.getElementById("editName").value;
  const newEmail = document.getElementById("editEmail").value;
  const newAvatar = document.getElementById("editAvatar").value;

  if (!currentEditId) return;

  fetch(`${apiUrl}/${currentEditId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: newName, email: newEmail, avatar: newAvatar })
  }).then(() => {
    closePopup();
    loadUsers();
  });
});

// Tìm kiếm
document.getElementById("searchInput").addEventListener("input", function () {
  currentPage = 1;
  loadUsers(this.value);
});

// Sắp xếp
function sortTable(key) {
  if (sortKey === key) {
    sortAsc = !sortAsc;
  } else {
    sortKey = key;
    sortAsc = true;
  }
  loadUsers();
}

// Chuyển trang
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    loadUsers();
  }
}
function nextPage() {
  const totalPages = Math.ceil(allUsers.length / usersPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    loadUsers();
  }
}

// Khởi chạy
loadUsers();
