'use client';

import { useState } from 'react';

interface VersionUploadProps {
  documentId: string;
  currentVersion: string;
  onSuccess: () => void;
}

export default function VersionUpload({ documentId, currentVersion, onSuccess }: VersionUploadProps) {
  const [version, setVersion] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [changeLog, setChangeLog] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          version,
          fileUrl,
          fileName,
          changeLog,
          uploadedBy: 'Owner',
        }),
      });

      if (response.ok) {
        setVersion('');
        setFileUrl('');
        setFileName('');
        setChangeLog('');
        onSuccess();
      } else {
        setError('Failed to upload version');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Upload New Version</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Current Version: <strong>{currentVersion}</strong>
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="version" className="block text-sm font-medium mb-1">
            Version Number
          </label>
          <input
            type="text"
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="e.g., 1.1, 2.0"
            required
          />
        </div>

        <div>
          <label htmlFor="fileName" className="block text-sm font-medium mb-1">
            File Name
          </label>
          <input
            type="text"
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="document.pdf"
            required
          />
        </div>

        <div>
          <label htmlFor="fileUrl" className="block text-sm font-medium mb-1">
            File URL
          </label>
          <input
            type="url"
            id="fileUrl"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="https://example.com/file.pdf"
            required
          />
        </div>

        <div>
          <label htmlFor="changeLog" className="block text-sm font-medium mb-1">
            Change Log
          </label>
          <textarea
            id="changeLog"
            value={changeLog}
            onChange={(e) => setChangeLog(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            rows={3}
            placeholder="Describe the changes..."
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Version'}
        </button>
      </form>
    </div>
  );
}
