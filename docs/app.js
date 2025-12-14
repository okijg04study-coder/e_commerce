const productsContainer = document.getElementById('products');
const searchInput = document.getElementById('search');
const categoryCards = document.querySelectorAll('.category-card');

let selectedCategory = 'all';

logoutBtn.onclick = () => {
  fetch('http://127.0.0.1:5000/api/logout', {
    credentials: 'include'
  }).then(() => location.reload());
};

fetch('http://127.0.0.1:5000/api/check-login', {
  credentials: 'include'
})
.then(res => res.json())
.then(data => {
  if (data.logged_in) {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('adminBtn').style.display = 'inline';
    document.getElementById('logoutBtn').style.display = 'inline';
  }
});

function loadProducts() {
  const search = searchInput.value;

  let url = 'http://127.0.0.1:5000/api/products?';

  if (search) url += `search=${search}&`;
  if (selectedCategory) url += `category=${selectedCategory}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      productsContainer.innerHTML = '';

      if (data.length === 0) {
        productsContainer.innerHTML = '<p>Produk tidak ditemukan</p>';
        return;
      }

      data.forEach(p => {
        productsContainer.innerHTML += `
        <a href="detail.html?id=${p.id}" class="card-link">
            <div class="card">
            <img src="${p.image}">
            <h3>${p.name}</h3>
            <p>Rp ${p.price.toLocaleString()}</p>
            </div>
        </a>
        `;
      });
    });
}

// search
searchInput.addEventListener('keyup', loadProducts);

// klik kategori
categoryCards.forEach(card => {
  card.addEventListener('click', () => {
    categoryCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    selectedCategory = card.dataset.category;
    loadProducts();
  });
});

// load awal
loadProducts();
