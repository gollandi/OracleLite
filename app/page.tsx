import { getDocuments } from '@/lib/notion';
import DocumentCard from '@/components/DocumentCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let documents = [];
  let error = null;

  try {
    documents = await getDocuments();
  } catch (err) {
    console.error('Failed to load documents:', err);
    error = 'Failed to load documents. Please check your Notion configuration.';
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">HR Document Review System</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage HR documents with version control and collaborative comments.
        </p>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <p className="text-sm mt-2">
            Make sure you have set up your Notion API key and database ID in the .env file.
          </p>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No documents found. Create some documents in your Notion database to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}

      <div className="mt-12 bg-blue-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold mb-2">Public Mode:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>View all documents and their details</li>
              <li>See version history</li>
              <li>Read and post public comments</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Owner Mode:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>All public mode features</li>
              <li>Upload new document versions</li>
              <li>Manage change logs</li>
              <li>View and create private comments (marked &apos;to MD&apos;)</li>
            </ul>
          </div>
          <p className="text-sm italic">
            Click &quot;Owner Login&quot; in the header to access owner mode features.
          </p>
        </div>
      </div>
    </div>
  );
}
