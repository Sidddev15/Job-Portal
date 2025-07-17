import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../auth/authContext';

export default function JobDetails() {
  const { id } = useParams();
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, token] = useAuth();
  const [resumeUrl, setResumeUrl] = useState('');
  const [applyStatus, setApplyStatus] = useState('');

  useEffect(() => {
    axios
      .get(`/jobs/${id}`)
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyStatus('');
    try {
      await axios.post(
        `/application/${id}/apply`,
        { resumeUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplyStatus('Applied Sucessfully');
    } catch (err) {
      setApplyStatus(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <p>Loading ...</p>;
  if (!jobs) return <p>Job not found.</p>;

  return (
    <div>
      <h2>{jobs.title}</h2>
      <p>{jobs.description}</p>
      <p>
        <strong>Skills:</strong>
        {jobs.skills.join(', ')}
      </p>
      <p>
        <strong>Location:</strong>
        {jobs.location}
      </p>
      <p>
        <strong>Salary:</strong>
        {jobs.salaryRange}
      </p>
      {user && user.role === 'candidate' && (
        <form onSubmit={handleApply}>
          <input
            type="text"
            placeholder="Resume URL"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            required
            readOnly
          />
          <button type="submit">Apply</button>
        </form>
      )}
      {applyStatus && <p>{applyStatus}</p>}
    </div>
  );
}
