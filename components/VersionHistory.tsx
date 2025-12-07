'use client';

import { DocumentVersion } from '@/types';
import { format } from 'date-fns';

interface VersionHistoryProps {
  versions: DocumentVersion[];
}

export default function VersionHistory({ versions }: VersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Version History</h2>
        <p className="text-gray-500">No version history available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Version History</h2>
      
      <div className="space-y-4">
        {versions.map((version) => (
          <div key={version.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Version {version.version}</h3>
              <span className="text-sm text-gray-500">
                {format(new Date(version.uploadedAt), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
            
            <div className="space-y-1 text-sm">
              <p>
                <strong>File:</strong>{' '}
                {version.fileUrl ? (
                  <a
                    href={version.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {version.fileName}
                  </a>
                ) : (
                  <span>{version.fileName}</span>
                )}
              </p>
              <p>
                <strong>Uploaded by:</strong> {version.uploadedBy}
              </p>
              {version.changeLog && (
                <div>
                  <strong>Changes:</strong>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{version.changeLog}</p>
                </div>
              )}
              {version.notes && (
                <div>
                  <strong>Notes:</strong>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{version.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
