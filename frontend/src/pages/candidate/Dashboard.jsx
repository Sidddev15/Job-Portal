import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/authContext';
import axios from '../../api/axios';

export default function CandidateDashboard() {
  const [application, setApplication] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    axios
      .get('/application/my', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.data)
      .catch(() => setApplication([]));
  }, [token]);

  return (
    <div>
      <h2>My Application</h2>
      {application.map((app) => (
        <div key={app._id}>
          <h4>{app.job?.title}</h4>
          <p>Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
}
