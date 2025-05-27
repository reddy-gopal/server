import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const formStyle = {
  backgroundColor: '#ffff',
  padding: '10px',
  
  borderRadius: '12px',
  width: '200px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
};

const inputStyle = {
  padding: '6px',
  border: '1px solid #dddfe2',
  borderRadius: '5px',
  fontSize: '1rem',
};

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#1877f2',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
};

const linkStyle = {
  color: '#1877f2',
  cursor: 'pointer',
  textAlign: 'center',
  textDecoration: 'none',
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://gopal955.pythonanywhere.com/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
<div
  style={{
    backgroundImage: 'url("https://t3.ftcdn.net/jpg/09/61/27/48/360_F_961274808_fX06eKzHJDCX9LO1Uew8YsL8Gk7RDZBu.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start', // Aligns to the left
    alignItems: 'center',         // Vertically centers
    paddingLeft: '10%',           // Optional: adds spacing from left edge
  }}
>


    <div style={formStyle}>
      <h2 style={{ textAlign: 'center', color: '#1d1d1d' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={inputStyle}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={inputStyle}
            required
          />
        </div>
        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '10px' }}>
        Don't have an account?{' '}
        <span style={linkStyle} onClick={() => navigate('/register')}>
          Register
        </span>
      </p>
    </div>
    </div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to get CSRF token from cookies
  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(), // Include CSRF token
        },
        credentials: 'include', // Required for cookies
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        // Handle both array and string errors
        const getFirstError = (field) => 
          Array.isArray(errorData[field]) ? errorData[field][0] : errorData[field];
        
        setError(
          getFirstError('username') ||
          getFirstError('password') ||
          getFirstError('email') ||
          'Registration failed'
        );
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  // Rest of the component remains the same
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };


  return (
    <div
  style={{
    backgroundImage: 'url("https://t3.ftcdn.net/jpg/08/68/51/04/360_F_868510427_vsvN67LV1zSmLMyXMOFG05tRCmTAj1xL.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start', // Aligns to the left
    alignItems: 'center',         // Vertically centers
    paddingLeft: '10%',           // Optional: adds spacing from left edge
  }}
>
    <div style={formStyle}>
      <h2 style={{ textAlign: 'center', color: '#1d1d1d' }}>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            style={inputStyle}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            style={inputStyle}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={inputStyle}
            onChange={handleChange}
            required
          />
          {/* Changed name to confirm_password */}
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            style={inputStyle}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
        <button type="submit" style={buttonStyle}>Create Account</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' , fontSize: '10px'}}>
        Already have an account?{' '}
        <span style={linkStyle} onClick={() => navigate('/login')}>
          Login
        </span>
      </p>
    </div>
    </div>
  );
};

export { Login, Register };
