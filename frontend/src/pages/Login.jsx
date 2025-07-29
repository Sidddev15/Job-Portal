import { useState } from 'react';
import { useAuth } from '../auth/authContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function Login() {
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = isPhone
        ? { phone: emailOrPhone, password }
        : { email: emailOrPhone, password };
      const res = await axios.post('/auth/login', payload); //adjust the base URL
      login(res.data.user, res.data.token);
      //redirect on role
      if (res.data.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.data.user.role === 'recruiter')
        navigate('/recruiter/dashboard');
      else navigate('/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <>
      <h2>Login</h2>
      <button onClick={() => setIsPhone((p) => !p)}>
        Use {isPhone ? 'Phone' : 'Email'}
      </button>
      <form onSubmit={handleSubmit}>
        <input
          type={isPhone ? 'text' : 'email'}
          placeholder={isPhone ? 'Phone' : 'Email'}
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </>
  );
}
