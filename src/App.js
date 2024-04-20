import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      onLogin();
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="login-container">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      setError('Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    // Username validation
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      setError('Username can only contain letters and numbers');
      return;
    }
  
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userExists = registeredUsers.find((u) => u.username === username);
  
    if (userExists) {
      setError('Username already exists');
    } else {
      const newUser = { username, password };
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      onRegister();
      setError('');
    }
  };
  

  return (
    <div className="auth-container">
      <div className="register-container">
        <h1>Register</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Enter a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Enter a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="button-container">
            <button type="submit">Register</button>
            <Link to="/login" className="register-link">Login Here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}



function Home({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleProducts] = useState(12);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
  product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.description.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div>
      <h1>PRODUCTSTORE</h1>
      <div class='rbord'>
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search for products'
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className='grid product-grid'>
      {filteredProducts.slice(0, visibleProducts).reverse().map((product) => (
  <Link to={`/product/${product.id}`} key={product.id} className='product-card'>
    <div>
      <img src={product.image} alt={product.title} className='product-image-home' />
      <div className='product-details-home'>
        <p className='product-title-home'>{product.title}</p>
        <p className='product-price-home'>${product.price}</p>
      </div>
    </div>
  </Link>
))}

      </div>
    </div>
    </div>
  );
}

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${productId}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product details: ', error));
  }, [productId]);

  return (
    <div>
      <h1>Product Page</h1>
      <div class='rbord-pro'> 
      <div className='product-page'>
      {product && (
        <>
          <img src={product.image} alt={product.title} className='product-image' />
          <div className='product-details'>
            <h4 className='product-title'>TITLE:{product.title}</h4>
            <h4 className='product-heading'>INFO:</h4>
            <h4 className='product-description'>{product.description}</h4>
            <h4 className='product-price'>PRICE:${product.price}</h4>
            <h4 className='product-rating'>RATING: {product.rating.rate} ({product.rating.count} reviews)</h4>
          </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
}


function App() {
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleRegister = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
          </Routes>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;