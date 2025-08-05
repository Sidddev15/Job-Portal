import { useState } from 'react';
import axios from '../api/axios';

function ApplyButton({ jobId, token }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleApply = async () => {
    setLoading(true);
    setMessage('');
    try {
      // For demo: sending empty resumeUrl. Replace with real URL or file upload flow later.
      await axios.post(
        `/applications/${jobId}/apply`,
        { resumeUrl: '' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage('Applied successfully!');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to apply. Try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleApply} disabled={loading}>
        {loading ? 'Applying...' : 'Apply'}
      </button>
      {message && <p>{message}</p>}
    </>
  );
}

export default ApplyButton;
