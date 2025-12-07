'use client';

import { useState } from 'react';
import { Comment } from '@/types';
import { format } from 'date-fns';

interface CommentSectionProps {
  documentId: string;
  initialComments: Comment[];
  isOwner: boolean;
}

export default function CommentSection({ documentId, initialComments, isOwner }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [toMD, setToMD] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          content: newComment,
          isPrivate,
          toMD,
        }),
      });

      if (response.ok) {
        // Refresh comments
        const commentsResponse = await fetch(`/api/comments?documentId=${documentId}`);
        const data = await commentsResponse.json();
        setComments(data.comments);
        setNewComment('');
        setIsPrivate(false);
        setToMD(false);
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 mb-2"
          rows={3}
          placeholder="Add a comment..."
          disabled={loading}
        />
        {isOwner && (
          <div className="flex gap-4 mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mr-2"
              />
              Private Comment
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={toMD}
                onChange={(e) => setToMD(e.target.checked)}
                className="mr-2"
              />
              To MD
            </label>
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
                {comment.isPrivate && (
                  <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">
                    PRIVATE
                  </span>
                )}
                {comment.toMD && (
                  <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded">
                    TO MD
                  </span>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
