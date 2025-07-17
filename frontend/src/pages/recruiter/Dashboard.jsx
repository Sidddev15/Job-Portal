import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../auth/authContext';
import { Link } from 'react-router-dom';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    axios
      .get('/jobs')
      .then((res) => {
        setJobs(res.jobs.filter((job) => job.postedBy._id === user.id));
      })
      .catch(() => setJobs([]));
  }, [user.id]);

  return (
    <div>
      <h2>My Posted Jobs</h2>
      {jobs.map((job) => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <Link to={`/jobs/${job._id}`}>View</Link> |{' '}
          <Link to={`/recruiter/jobs/${job._id}/applicants`}>
            View Applicants
          </Link>
        </div>
      ))}
    </div>
  );
}
