# Notion Database Setup Guide

This guide will help you set up the Notion database required for the HR Document Review System.

## Step 1: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in the details:
   - **Name**: HR Document Review (or any name you prefer)
   - **Associated workspace**: Select your workspace
   - **Type**: Internal Integration
4. Click **"Submit"**
5. Copy the **"Internal Integration Token"** (starts with `secret_`)
   - This is your `NOTION_API_KEY`

## Step 2: Create the Database

1. Open Notion and create a new page
2. Add a **Database - Table** block
3. Name it "HR Documents" (or your preferred name)

## Step 3: Configure Database Properties

Add the following properties to your database:

### Required Properties:

1. **Title** (default property - already exists)
   - Type: Title
   - This will store the document name

2. **Description**
   - Type: Text (Rich text)
   - Description of the document

3. **CurrentVersion**
   - Type: Text (Rich text)
   - Current version number (e.g., "1.0", "2.1")

4. **Status**
   - Type: Select
   - Options:
     - draft
     - review
     - approved
     - archived

5. **Category** (Optional)
   - Type: Select
   - Add categories as needed (e.g., "Policy", "Contract", "Handbook")

6. **CreatedAt**
   - Type: Date
   - Creation date of the document

7. **UpdatedAt**
   - Type: Last edited time
   - Automatically tracks last update

### How to Add Properties:

1. Click the **"+"** button in the table header
2. Type the property name
3. Select the property type
4. Configure options if needed (for Select types)

## Step 4: Share Database with Integration

1. Open your database page
2. Click the **"..."** menu in the top right
3. Select **"Add connections"**
4. Find and select your integration (created in Step 1)
5. Click **"Confirm"**

## Step 5: Get the Database ID

1. Open your database as a full page (if it's not already)
2. Look at the URL in your browser. It will look like:
   ```
   https://www.notion.so/workspace-name/DATABASE_ID?v=VIEW_ID
   ```
3. The `DATABASE_ID` is the 32-character string between the last `/` and the `?`
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
4. Copy this ID - this is your `NOTION_DATABASE_ID`

## Step 6: Add Sample Data (Optional)

Add a few sample documents to test:

| Title | Description | CurrentVersion | Status | Category | CreatedAt |
|-------|-------------|----------------|--------|----------|-----------|
| Employee Handbook | Company policies and procedures | 1.0 | approved | Policy | Today |
| Remote Work Policy | Guidelines for remote work | 2.1 | review | Policy | Today |
| Benefits Summary | Employee benefits overview | 1.5 | draft | Handbook | Today |

## Step 7: Configure Your Application

1. In your project root, create a `.env` file (or rename `.env.example`)
2. Add your credentials:
   ```env
   NOTION_API_KEY=secret_YOUR_INTEGRATION_TOKEN_HERE
   NOTION_DATABASE_ID=YOUR_DATABASE_ID_HERE
   OWNER_PASSWORD=your_secure_password_here
   ```
3. Replace the placeholder values with:
   - The integration token from Step 1
   - The database ID from Step 5
   - A secure password for owner access

## Step 8: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000)
3. You should see your documents listed!

## Document Version Management

Documents in the system track versions through content blocks. When you upload a new version:

1. A new section is added to the document page in Notion
2. The section includes:
   - Version number as a heading
   - File information
   - File URL (link to actual document)
   - Change log
   - Upload information

## Comments System

Comments are stored as Notion comments on the page:
- Public comments are visible to everyone
- Private comments are prefixed with `[PRIVATE]`
- "To MD" comments are prefixed with `[TO MD]`
- Only owners can see private and "To MD" comments

## Troubleshooting

### "Failed to fetch documents"

**Causes:**
- Invalid API key
- Database not shared with integration
- Wrong database ID

**Solutions:**
1. Verify your integration token in `.env`
2. Check that the database is connected to your integration (Step 4)
3. Confirm the database ID is correct (Step 5)

### "Cannot find property"

**Causes:**
- Missing required properties in your database
- Property names don't match exactly

**Solutions:**
1. Ensure all required properties exist (Step 3)
2. Property names are case-sensitive and must match exactly
3. Check for typos in property names

### No documents appearing

**Causes:**
- Empty database
- Database not properly configured

**Solutions:**
1. Add at least one test document
2. Ensure the database has all required properties
3. Check browser console for errors

## Security Best Practices

For production use:
1. Never commit `.env` file to version control
2. Use strong, unique passwords
3. Regularly rotate your integration tokens
4. Implement proper authentication (not just password-based)
5. Set up rate limiting
6. Use HTTPS in production
7. Implement proper error handling
8. Add input validation and sanitization

## Next Steps

Once your database is set up and working:
1. Customize the database properties for your needs
2. Add real documents
3. Set up proper file storage (e.g., AWS S3, Google Drive)
4. Configure production deployment
5. Set up monitoring and logging
