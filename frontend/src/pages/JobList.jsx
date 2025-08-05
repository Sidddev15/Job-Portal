import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../auth/authContext';
import ApplyButton from '../components/ApplyButton';

const skillOptions = ['React', 'Node', 'MongoDB', 'Express', 'Angular', 'Vue'];

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    skills: [],
    location: '',
    status: 'open',
  });
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        skills: filters.skills.join(','),
        page,
        limit: 5,
      };
      const { data } = await axios.get('/jobs', { params });
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
    } catch (e) {
      setJobs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [page]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFilters((prev) => ({
        ...prev,
        skills: checked
          ? [...prev.skills, value]
          : prev.skills.filter((skill) => skill !== value),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <h2>Open Jobs</h2>
      {/* Filters */}
      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by keyword"
          style={{ marginRight: 10 }}
        />
        <input
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Location"
          style={{ marginRight: 10 }}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <span style={{ marginLeft: 10, marginRight: 10 }}>Skills:</span>
        {skillOptions.map((skill) => (
          <label key={skill} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              value={skill}
              checked={filters.skills.includes(skill)}
              onChange={handleFilterChange}
            />
            {skill}
          </label>
        ))}
        <button type="submit" style={{ marginLeft: 10 }}>
          Filter/Search
        </button>
      </form>
      {/* Job List */}
      {loading && <p>Loading...</p>}
      {!loading && !jobs.length && <p>No jobs found.</p>}
      {!loading &&
        jobs.map((job) => (
          <div
            key={job._id}
            style={{ border: '1px solid #ddd', margin: 10, padding: 10 }}
          >
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>
              <b>Skills:</b> {job.skills.join(', ')}
            </p>
            <p>
              <b>Location:</b> {job.location}
            </p>
            <p>
              <b>Posted By:</b> {job.postedBy?.name}
            </p>

            {/* Show Apply button only if user is logged in AND is a candidate */}
            {user && user.role === 'candidate' && (
              <ApplyButton jobId={job._id} token={token} />
            )}
          </div>
        ))}
      {/* Pagination */}
      <div style={{ margin: 20 }}>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => handlePageChange(idx + 1)}
            disabled={page === idx + 1}
            style={{ marginRight: 6 }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
