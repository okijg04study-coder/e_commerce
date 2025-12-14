from flask import Flask, jsonify, request, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from models import db, User, Product

app = Flask(__name__)
app.secret_key = 'secret123'

app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=False
)

CORS(app, supports_credentials=True)

# =========================
# KONFIGURASI DATABASE
# =========================
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# =========================
# HELPER
# =========================
def admin_only():
    return 'user_id' in session and session.get('role') == 'admin'

# =========================
# API PRODUK (PUBLIC)
# =========================
@app.route('/api/products')
def get_products():
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    sort = request.args.get('sort', '')

    query = Product.query

    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))

    if category:
        query = query.filter(Product.category == category)

    if sort == 'asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'desc':
        query = query.order_by(Product.price.desc())

    products = query.all()

    return jsonify([{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'category': p.category,
        'image': p.image
    } for p in products])

@app.route('/api/products/<int:id>')
def get_product_detail(id):
    product = Product.query.get_or_404(id)

    return jsonify({
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'category': product.category,
        'image': product.image
    })

# =========================
# AUTH
# =========================
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username sudah digunakan'}), 400

    user = User(
        username=data['username'],
        password=generate_password_hash(data['password']),
        role='admin'  # admin langsung
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Register berhasil'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()

    if user and check_password_hash(user.password, data['password']):
        session['user_id'] = user.id
        session['role'] = user.role
        return jsonify({'message': 'Login berhasil', 'role': user.role})

    return jsonify({'message': 'Login gagal'}), 401

@app.route('/api/logout')
def logout():
    session.clear()
    return jsonify({'message': 'Logout berhasil'})

@app.route('/api/check-login')
def check_login():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'role': session.get('role')})
    return jsonify({'logged_in': False})

# =========================
# ADMIN CRUD PRODUK
# =========================
@app.route('/api/admin/products', methods=['POST'])
def admin_add_product():
    if not admin_only():
        return jsonify({'message': 'Akses ditolak'}), 403

    data = request.json

    product = Product(
        name=data['name'],
        price=data['price'],
        category=data['category'],
        image=data['image']
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({'message': 'Produk ditambahkan'})

@app.route('/api/admin/products/<int:id>', methods=['PUT'])
def admin_update_product(id):
    if not admin_only():
        return jsonify({'message': 'Akses ditolak'}), 403

    product = Product.query.get_or_404(id)
    data = request.json

    product.name = data['name']
    product.price = data['price']
    product.category = data['category']
    product.image = data['image']

    db.session.commit()
    return jsonify({'message': 'Produk diupdate'})

@app.route('/api/admin/products/<int:id>', methods=['DELETE'])
def admin_delete_product(id):
    if not admin_only():
        return jsonify({'message': 'Akses ditolak'}), 403

    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Produk dihapus'})

@app.route('/api/debug-session')
def debug_session():
    return jsonify(dict(session))

# =========================
# RUN
# =========================
if __name__ == '__main__':
    app.run(debug=True)
