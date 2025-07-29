// src/pages/recruiter/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../auth/authContext';
import { Link } from 'react-router-dom';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get('/jobs')
      .then((res) => {
        setJobs(res.data.filter((job) => job.postedBy?._id === user.id));
      })
      .catch(() => setJobs([]));
  }, [user.id]);

  return (
    <div>
      <h2>Recruiter Dashboard</h2>
      <h4>My Posted Jobs:</h4>
      {jobs.length === 0 && <p>No jobs posted yet.</p>}
      {jobs.map((job) => (
        <div
          key={job._id}
          style={{ border: '1px solid #eee', margin: 10, padding: 10 }}
        >
          <b>Job:</b> {job.title}
          <br />
          <Link to={`/jobs/${job._id}`}>View</Link> |{' '}
          <Link to={`/recruiter/jobs/${job._id}/applicants`}>
            View Applicants
          </Link>
        </div>
      ))}
    </div>
  );
}
