export interface Document {
  id: string;
  title: string;
  description: string;
  currentVersion: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  createdAt: string;
  updatedAt: string;
  category?: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: string;
  fileUrl: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  changeLog: string;
  notes?: string;
}

export interface Comment {
  id: string;
  documentId: string;
  versionId?: string;
  content: string;
  author: string;
  isPrivate: boolean;
  createdAt: string;
  toMD?: boolean; // for private comments marked "to MD"
}

export interface NotionDocument {
  id: string;
  properties: {
    Title: { title: Array<{ plain_text: string }> };
    Description: { rich_text: Array<{ plain_text: string }> };
    CurrentVersion: { rich_text: Array<{ plain_text: string }> };
    Status: { select: { name: string } };
    Category: { select: { name: string } | null };
    CreatedAt: { date: { start: string } };
    UpdatedAt: { last_edited_time: string };
  };
}
