const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

fetch(`http://127.0.0.1:5000/api/products/${productId}`)
  .then(res => res.json())
  .then(p => {
    const detail = document.getElementById('detail');

    detail.innerHTML = `
      <img src="${p.image}" class="detail-img">
      <div class="detail-info">
        <h1>${p.name}</h1>
        <p class="price">Rp ${p.price.toLocaleString()}</p>
        <p>Kategori: ${p.category}</p>
        <button>Beli Sekarang</button>
      </div>
    `;
  })
  .catch(err => console.error(err));
