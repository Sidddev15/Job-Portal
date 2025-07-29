// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../auth/authContext';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios
      .get('/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setStats(res.data))
      .catch(() => setStats({}));
  }, [token]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Jobs: {stats.totalJobs || 0}</p>
      <p>Total Candidates: {stats.totalCandidates || 0}</p>
      <p>Total Recruiters: {stats.totalRecruiters || 0}</p>
      {/* Add more stats/graphs here */}
    </div>
  );
}
