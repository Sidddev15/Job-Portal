// src/pages/candidate/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../auth/authContext';

export default function CandidateDashboard() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios
      .get('/applications/my', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data))
      .catch(() => setApplications([]));
  }, [token]);

  return (
    <div>
      <h2>Candidate Dashboard</h2>
      <h4>My Applications:</h4>
      {applications.length === 0 && <p>No applications yet.</p>}
      {applications.map((app) => (
        <div
          key={app._id}
          style={{ border: '1px solid #eee', margin: 10, padding: 10 }}
        >
          <b>Job:</b> {app.job?.title}
          <br />
          <b>Status:</b> {app.status}
        </div>
      ))}
    </div>
  );
}
