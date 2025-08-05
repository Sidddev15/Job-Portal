// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../auth/authContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setStats(res.data))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Loading Analytics...</p>;
  if (!stats) return <p>Failed to load stats</p>;

  // Format month numbers to month names
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const chartData = (stats?.applicationsPerMonth ?? []).map((item) => ({
    month: months[item._id - 1],
    Applications: item.count,
  }));

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Analytics Dashboard</h2>
      <div style={{ display: 'flex', gap: 30, marginBottom: 40 }}>
        <div>
          <strong>Total Jobs:</strong> {stats.totalJobs}
        </div>
        <div>
          <strong>Total Candidates:</strong> {stats.totalCandidates}
        </div>
        <div>
          <strong>Total Recruiters:</strong> {stats.totalRecruiters}
        </div>
        <div>
          <strong>Total Applications:</strong> {stats.totalApplications}
        </div>
      </div>

      <h3>Applications in last 6 months</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Applications" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
