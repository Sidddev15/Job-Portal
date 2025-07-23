import { useState } from 'react';
import { useAuth } from '../auth/authContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'candidate',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('auth/register', form);
      login(res.data.user, res.data.token);
      // Redirect as per role
      if (res.data.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.data.user.role === 'recruiter')
        navigate('/recruiter/dashboard');
      else navigate('/candidate/dasboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registeration Failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </div>
  );
}
