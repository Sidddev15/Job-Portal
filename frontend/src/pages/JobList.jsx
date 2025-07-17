import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/jobs')
      .then((res) => setJobs(res.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading Jobs ....</p>;
  if (!jobs.length) return <p>No Jobs Found</p>;

  return (
    <div>
      <h2>Open Jobs</h2>
      {jobs.map((job) => (
        <div
          key={job._id}
          style={{ border: '1px solid #ddd', margin: 10, padding: 10 }}
        >
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p>
            <strong>Skills:</strong> {job.skills.join(', ')}
          </p>
          <p>
            <strong>Posted By:</strong> {job.postedBy?.name}
          </p>
          <Link to={`/jobs/${job._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}
