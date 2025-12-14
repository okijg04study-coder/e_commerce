const API = 'http://127.0.0.1:5000/api';

// =======================
// CEK LOGIN ADMIN
// =======================
fetch(`${API}/check-login`, {
  credentials: 'include'
})
.then(res => res.json())
.then(data => {
  if (!data.logged_in || data.role !== 'admin') {
    alert('Akses ditolak! Silakan login sebagai admin.');
    window.location.href = 'login.html';
  } else {
    loadProducts();
  }
});

// =======================
// LOAD SEMUA PRODUK
// =======================
function loadProducts() {
  fetch(`${API}/products`, {
    credentials: 'include'
  })
  .then(res => res.json())
  .then(products => {
    const tbody = document.getElementById('productTable');
    tbody.innerHTML = '';

    products.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>Rp ${p.price.toLocaleString()}</td>
          <td>${p.category}</td>
          <td>
            <button onclick="editProduct(${p.id})">Edit</button>
            <button onclick="deleteProduct(${p.id})">Hapus</button>
          </td>
        </tr>
      `;
    });
  });
}

// =======================
// TAMBAH PRODUK
// =======================
document.getElementById('addProductForm').addEventListener('submit', e => {
  e.preventDefault();

  const data = {
    name: name.value,
    price: price.value,
    category: category.value,
    image: image.value
  };

fetch('http://127.0.0.1:5000/api/admin/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // ⭐ WAJIB
  body: JSON.stringify(product)
})
  .then(res => res.json())
  .then(() => {
    alert('Produk berhasil ditambahkan');
    e.target.reset();
    loadProducts();
  });
});

// =======================
// EDIT PRODUK
// =======================
function editProduct(id) {
  const name = prompt('Nama baru:');
  const price = prompt('Harga baru:');
  const category = prompt('Kategori baru:');
  const image = prompt('URL gambar baru:');

  fetch(`${API}/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, price, category, image })
  })
  .then(res => res.json())
  .then(() => {
    alert('Produk berhasil diupdate');
    loadProducts();
  });
}

// =======================
// HAPUS PRODUK
// =======================
function deleteProduct(id) {
  if (!confirm('Yakin ingin menghapus produk ini?')) return;

  fetch(`${API}/admin/products/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  .then(res => res.json())
  .then(() => {
    alert('Produk dihapus');
    loadProducts();
  });
}

// =======================
// LOGOUT
// =======================
function logout() {
  fetch(`${API}/logout`, {
    credentials: 'include'
  })
  .then(() => {
    window.location.href = 'login.html';
  });
}
