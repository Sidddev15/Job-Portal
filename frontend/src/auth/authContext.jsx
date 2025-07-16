import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    //try to load from local storage on refresh
    const data = localStorage.getItem('jobportal-user');
    return data ? JSON.parse(data) : null;
  });

  const [token, setToken] = useState(() => {
    localStorage.getItem('jobboard-token' || '');
  });

  //Persist Login
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('jobportal-user', JSON.stringify(user));
      localStorage.setItem('jobportal-token', token);
    } else {
      localStorage.removeItem('jobportal-user');
      localStorage.removeItem('jobportal-token');
    }
  }, [user, token]);

  function login(user, token) {
    setUser(user);
    setToken(token);
  }

  function logout() {
    setUser(null);
    setToken('');
  }

  function isRole(role) {
    return user && user.role === role;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
