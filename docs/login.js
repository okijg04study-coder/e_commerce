const API = 'http://127.0.0.1:5000/api';

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://127.0.0.1:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // ⭐ WAJIB
  body: JSON.stringify({
    username,
    password
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.message === 'Login berhasil') {
      if (data.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    } else {
      alert(data.message);
    }
  })
  .catch(() => alert('Server error'));
});
