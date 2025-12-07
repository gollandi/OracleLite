import { Client } from '@notionhq/client';
import { Document, DocumentVersion, Comment, NotionDocument } from '@/types';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// Helper function to parse Notion page to Document
function parseNotionPageToDocument(page: any): Document {
  const props = page.properties;
  
  return {
    id: page.id,
    title: props.Title?.title?.[0]?.plain_text || 'Untitled',
    description: props.Description?.rich_text?.[0]?.plain_text || '',
    currentVersion: props.CurrentVersion?.rich_text?.[0]?.plain_text || '1.0',
    status: (props.Status?.select?.name?.toLowerCase() || 'draft') as Document['status'],
    createdAt: props.CreatedAt?.date?.start || page.created_time,
    updatedAt: props.UpdatedAt?.last_edited_time || page.last_edited_time,
    category: props.Category?.select?.name || undefined,
  };
}

// Get all documents
export async function getDocuments(): Promise<Document[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: 'UpdatedAt',
          direction: 'descending',
        },
      ],
    });

    return response.results.map(parseNotionPageToDocument);
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

// Get single document by ID
export async function getDocument(documentId: string): Promise<Document | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: documentId });
    return parseNotionPageToDocument(page);
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
}

// Get document versions from page content
export async function getDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
  try {
    // In a real implementation, versions would be stored in a separate database or as page blocks
    // For this demo, we'll retrieve from page content blocks
    const blocks = await notion.blocks.children.list({
      block_id: documentId,
    });

    const versions: DocumentVersion[] = [];
    
    // Parse blocks to find version information
    // This is a simplified version - in production, you'd have a structured format
    let currentVersion: Partial<DocumentVersion> | null = null;
    
    for (const block: any of blocks.results) {
      if (block.type === 'heading_2') {
        if (currentVersion && currentVersion.version) {
          versions.push(currentVersion as DocumentVersion);
        }
        const heading = block.heading_2?.rich_text?.[0]?.plain_text || '';
        if (heading.startsWith('Version ')) {
          currentVersion = {
            id: block.id,
            documentId,
            version: heading.replace('Version ', ''),
            uploadedAt: block.created_time,
            uploadedBy: 'System',
            changeLog: '',
            fileName: '',
            fileUrl: '',
          };
        }
      } else if (currentVersion && block.type === 'paragraph') {
        const text = block.paragraph?.rich_text?.[0]?.plain_text || '';
        if (text.startsWith('File:')) {
          currentVersion.fileName = text.replace('File:', '').trim();
        } else if (text.startsWith('URL:')) {
          currentVersion.fileUrl = text.replace('URL:', '').trim();
        } else if (text.startsWith('Changes:')) {
          currentVersion.changeLog = text.replace('Changes:', '').trim();
        } else if (text.startsWith('By:')) {
          currentVersion.uploadedBy = text.replace('By:', '').trim();
        }
      }
    }
    
    if (currentVersion && currentVersion.version) {
      versions.push(currentVersion as DocumentVersion);
    }

    return versions;
  } catch (error) {
    console.error('Error fetching versions:', error);
    return [];
  }
}

// Get comments from page
export async function getComments(documentId: string, isOwner: boolean = false): Promise<Comment[]> {
  try {
    const comments = await notion.comments.list({
      block_id: documentId,
    });

    return comments.results.map((comment: any) => ({
      id: comment.id,
      documentId,
      content: comment.rich_text?.[0]?.plain_text || '',
      author: 'User', // Notion doesn't expose user info in API easily
      isPrivate: comment.rich_text?.[0]?.plain_text?.includes('[PRIVATE]') || false,
      createdAt: comment.created_time,
      toMD: comment.rich_text?.[0]?.plain_text?.includes('[TO MD]') || false,
    })).filter(comment => {
      // Filter private comments for non-owners
      if (!isOwner && comment.isPrivate) {
        return false;
      }
      return true;
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// Create a new comment
export async function createComment(
  documentId: string,
  content: string,
  isPrivate: boolean = false,
  toMD: boolean = false
): Promise<void> {
  try {
    let commentText = content;
    if (isPrivate) commentText = '[PRIVATE] ' + commentText;
    if (toMD) commentText = '[TO MD] ' + commentText;

    await notion.comments.create({
      parent: { page_id: documentId },
      rich_text: [
        {
          text: {
            content: commentText,
          },
        },
      ],
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// Add a new version to a document
export async function addDocumentVersion(
  documentId: string,
  version: string,
  fileUrl: string,
  fileName: string,
  changeLog: string,
  uploadedBy: string
): Promise<void> {
  try {
    // Add version information as blocks to the page
    await notion.blocks.children.append({
      block_id: documentId,
      children: [
        {
          heading_2: {
            rich_text: [{ text: { content: `Version ${version}` } }],
          },
        } as any,
        {
          paragraph: {
            rich_text: [{ text: { content: `File: ${fileName}` } }],
          },
        } as any,
        {
          paragraph: {
            rich_text: [{ text: { content: `URL: ${fileUrl}` } }],
          },
        } as any,
        {
          paragraph: {
            rich_text: [{ text: { content: `Changes: ${changeLog}` } }],
          },
        } as any,
        {
          paragraph: {
            rich_text: [{ text: { content: `By: ${uploadedBy}` } }],
          },
        } as any,
      ],
    });

    // Update the current version in the page properties
    await notion.pages.update({
      page_id: documentId,
      properties: {
        CurrentVersion: {
          rich_text: [{ text: { content: version } }],
        },
      },
    });
  } catch (error) {
    console.error('Error adding version:', error);
    throw error;
  }
}
