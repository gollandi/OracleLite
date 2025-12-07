# OracleLite - HR Document Review System

A Next.js 14 microsite for reviewing HR documents with Notion as the backend database. Features include version control, public and private commenting, and owner management capabilities.

## Features

### Public Mode
- View all documents with their details
- Access document version history
- Read and post public comments
- View document status and metadata

### Owner Mode
- All public mode features
- Upload new document versions
- Manage change logs
- View and create private comments marked 'to MD' (Managing Director)
- Full access to all document operations

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Notion API** - Backend database and CMS
- **date-fns** - Date formatting utilities

## Prerequisites

- Node.js 18+ 
- A Notion account and workspace
- Notion Integration token
- Notion Database set up with proper schema

## Notion Setup

### 1. Create a Notion Integration

1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Click "+ New integration"
3. Give it a name (e.g., "HR Document Review")
4. Select the workspace
5. Save and copy the "Internal Integration Token"

### 2. Create a Notion Database

Create a database in Notion with the following properties:

- **Title** (title) - Document title
- **Description** (rich_text) - Document description
- **CurrentVersion** (rich_text) - Current version number
- **Status** (select) - Options: draft, review, approved, archived
- **Category** (select) - Optional document category
- **CreatedAt** (date) - Creation date
- **UpdatedAt** (last_edited_time) - Auto-updated

### 3. Share Database with Integration

1. Open your database in Notion
2. Click "..." menu → "Add connections"
3. Select your integration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gollandi/OracleLite.git
cd OracleLite
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
NOTION_API_KEY=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
OWNER_PASSWORD=your_secure_password_here
```

**Finding your Database ID:**
- Open your database in Notion
- Copy the URL (format: `https://notion.so/workspace/DATABASE_ID?v=...`)
- The DATABASE_ID is the 32-character string before the `?v=`
- Remove any dashes to get the clean ID

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── comments/       # Comments management
│   │   ├── documents/      # Documents CRUD
│   │   └── versions/       # Version management
│   ├── documents/          # Document pages
│   │   └── [id]/          # Dynamic document detail page
│   ├── layout.tsx         # Root layout with header
│   ├── page.tsx           # Home page (document list)
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── AuthModal.tsx      # Owner login modal
│   ├── CommentSection.tsx # Comments display/input
│   ├── DocumentCard.tsx   # Document list item
│   ├── Header.tsx         # Navigation header
│   ├── VersionHistory.tsx # Version timeline
│   └── VersionUpload.tsx  # Upload new version form
├── lib/
│   ├── auth.ts           # Authentication utilities
│   └── notion.ts         # Notion API client
├── types/
│   └── index.ts          # TypeScript type definitions
└── ...config files
```

## Usage

### Accessing the Application

1. **Public Access**: Visit the home page to see all documents
2. **Owner Login**: Click "Owner Login" in the header and enter the password

### Managing Documents

Documents are managed through your Notion database:
- Create new documents in Notion with the required properties
- They will automatically appear in the application
- Update properties in Notion to change document status/metadata

### Version Management (Owner Mode)

1. Navigate to a document detail page
2. Use the "Upload New Version" form
3. Provide:
   - Version number (e.g., 1.1, 2.0)
   - File name
   - File URL (link to document storage)
   - Change log description

### Comments

- **Public Comments**: Anyone can post and view
- **Private Comments**: Owner-only, marked with "PRIVATE" tag
- **To MD Comments**: Special private comments marked "TO MD"

## Security Notes

⚠️ **Important**: This is a demonstration application. For production use:

1. Implement proper authentication (OAuth, JWT, etc.)
2. Use a secure session management system
3. Add input validation and sanitization
4. Implement rate limiting
5. Use environment-specific configurations
6. Set up proper CORS policies
7. Add HTTPS in production
8. Implement proper file upload handling

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
