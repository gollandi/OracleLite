import { getDocument, getDocumentVersions, getComments } from '@/lib/notion';
import { checkOwnerAuth } from '@/lib/auth';
import { format } from 'date-fns';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection';
import VersionHistory from '@/components/VersionHistory';
import VersionUpload from '@/components/VersionUpload';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const document = await getDocument(id);
  
  if (!document) {
    notFound();
  }

  const versions = await getDocumentVersions(id);
  const isOwner = checkOwnerAuth();
  const comments = await getComments(id, isOwner);

  const statusColors = {
    draft: 'bg-gray-200 text-gray-800',
    review: 'bg-yellow-200 text-yellow-800',
    approved: 'bg-green-200 text-green-800',
    archived: 'bg-red-200 text-red-800',
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Documents
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{document.title}</h1>
            {document.category && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                {document.category}
              </span>
            )}
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[document.status]}`}>
            {document.status}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">{document.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Current Version:</span> {document.currentVersion}
          </div>
          <div>
            <span className="font-semibold">Created:</span>{' '}
            {format(new Date(document.createdAt), 'MMM dd, yyyy')}
          </div>
          <div>
            <span className="font-semibold">Last Updated:</span>{' '}
            {format(new Date(document.updatedAt), 'MMM dd, yyyy HH:mm')}
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="mb-6">
          <VersionUpload
            documentId={id}
            currentVersion={document.currentVersion}
            onSuccess={() => {
              // This will be handled by client-side refresh
            }}
          />
        </div>
      )}

      <div className="mb-6">
        <VersionHistory versions={versions} />
      </div>

      <div>
        <CommentSection documentId={id} initialComments={comments} isOwner={isOwner} />
      </div>
    </div>
  );
}
