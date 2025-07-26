import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../auth/authContext';

export default function ResumeUpload({ onUpload }) {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPreviewUrl(''); // Clear preview
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await axios.post('/upload/resume', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setPreviewUrl(res.data.url);
      if (onUpload) onUpload(res.data.url); // Pass URL back to parent if needed
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload Resume'}
      </button>
      {previewUrl && (
        <div>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            View Uploaded Resume
          </a>
        </div>
      )}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </div>
  );
}
