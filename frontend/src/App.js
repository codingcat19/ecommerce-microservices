import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function App() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });

  // User form state
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/products`, {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      });
      setProductForm({ name: '', description: '', price: '', category: '', stock: '' });
      setShowAddProduct(false);
      fetchProducts();
    } catch (err) {
      setError('Failed to add product');
      console.error(err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users`, userForm);
      setUserForm({ name: '', email: '', password: '', phone: '', address: '' });
      setShowAddUser(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to add user');
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await axios.delete(`${API_URL}/users/${id}`);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
        console.error(err);
      }
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>E-Commerce Dashboard</h1>
          <p>Microservices Architecture Demo</p>
        </div>
      </header>

      <div className="container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        {error && (
          <div className="error">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'products' && (
              <div className="section">
                <div className="section-header">
                  <h2>Products ({products.length})</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddProduct(!showAddProduct)}
                  >
                    {showAddProduct ? 'Cancel' : '+ Add Product'}
                  </button>
                </div>

                {showAddProduct && (
                  <form className="form" onSubmit={handleAddProduct}>
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                      required
                    />
                    <button type="submit" className="btn btn-success">Add Product</button>
                  </form>
                )}

                <div className="grid">
                  {products.map((product) => (
                    <div key={product._id} className="card">
                      <div className="card-header">
                        <h3>{product.name}</h3>
                        <span className="badge">{product.category}</span>
                      </div>
                      <p className="description">{product.description}</p>
                      <div className="card-footer">
                        <div className="price">${product.price}</div>
                        <div className="stock">Stock: {product.stock}</div>
                      </div>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="section">
                <div className="section-header">
                  <h2>Users ({users.length})</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddUser(!showAddUser)}
                  >
                    {showAddUser ? 'Cancel' : '+ Add User'}
                  </button>
                </div>

                {showAddUser && (
                  <form className="form" onSubmit={handleAddUser}>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={userForm.name}
                      onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={userForm.address}
                      onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                    />
                    <button type="submit" className="btn btn-success">Add User</button>
                  </form>
                )}

                <div className="grid">
                  {users.map((user) => (
                    <div key={user._id} className="card">
                      <div className="card-header">
                        <h3>{user.name}</h3>
                      </div>
                      <div className="user-info">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                        <p><strong>Address:</strong> {user.address || 'N/A'}</p>
                      </div>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;