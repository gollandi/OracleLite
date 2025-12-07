'use client';

import { Document } from '@/types';
import Link from 'next/link';
import { format } from 'date-fns';

interface DocumentCardProps {
  document: Document;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const statusColors = {
    draft: 'bg-gray-200 text-gray-800',
    review: 'bg-yellow-200 text-yellow-800',
    approved: 'bg-green-200 text-green-800',
    archived: 'bg-red-200 text-red-800',
  };

  return (
    <Link href={`/documents/${document.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{document.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[document.status]}`}>
            {document.status}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-3">{document.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Version {document.currentVersion}</span>
          <span>Updated: {format(new Date(document.updatedAt), 'MMM dd, yyyy')}</span>
        </div>
        {document.category && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {document.category}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
