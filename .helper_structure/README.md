# Directus MCP Server

A Model Context Protocol (MCP) server for integrating Directus CMS with Claude and other AI tools.

## Overview

This MCP server provides tools to interact with a local Directus instance running at `http://localhost:8055`. It enables full CRUD operations, schema inspection, and advanced search capabilities.

## Setup Instructions

### Prerequisites
- Node.js 18.0.0 or higher
- Directus instance running at `http://localhost:8055`
- A Directus user account with appropriate permissions

### Installation

1. **Clone/Copy the files to your Claude config directory:**

```bash
# On macOS/Linux
cp -r directus-mcp ~/.config/claude/mcp/

# On Windows (PowerShell)
Copy-Item -Recurse directus-mcp -Destination "$env:APPDATA\Claude\mcp\"
```

2. **Install dependencies:**

```bash
cd directus-mcp
npm install
```

3. **Update your Claude configuration** (`claude_desktop_config.json`):

Add the Directus MCP to your configuration:

```json
{
  "mcpServers": {
    "directus": {
      "command": "node",
      "args": ["path/to/directus-mcp/server.js"],
      "env": {
        "DIRECTUS_URL": "http://localhost:8055"
      }
    }
  }
}
```

4. **Restart Claude Desktop** to load the MCP server.

---

## Available Tools

### 1. **directus_authenticate**
Authenticate with Directus to get an access token.

**Input:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Successfully authenticated with Directus",
  "token": "eyJhbGc..."
}
```

---

### 2. **directus_list_collections**
Get all available collections in Directus.

**Input:** (no parameters)

**Output:**
```json
{
  "success": true,
  "collections": [
    {
      "name": "blogs",
      "hidden": false,
      "singleton": false,
      "note": null,
      "icon": null
    },
    {
      "name": "categories",
      "hidden": false,
      "singleton": false,
      "note": null,
      "icon": null
    }
  ]
}
```

---

### 3. **directus_get_items**
Get items from a specific collection with filtering and pagination.

**Input:**
```json
{
  "collection": "blogs",
  "limit": 10,
  "offset": 0,
  "filter": {
    "status": {
      "_eq": "published"
    }
  },
  "fields": ["id", "title", "slug", "content"]
}
```

**Output:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "First Blog Post",
      "slug": "first-blog-post",
      "content": "..."
    }
  ],
  "meta": {
    "filter_count": 15,
    "total_count": 25
  }
}
```

---

### 4. **directus_get_item**
Get a single item by ID.

**Input:**
```json
{
  "collection": "blogs",
  "id": "1",
  "fields": ["id", "title", "content", "author"]
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Blog Title",
    "content": "...",
    "author": {
      "id": "user-1",
      "name": "John Doe"
    }
  }
}
```

---

### 5. **directus_create_item**
Create a new item in a collection.

**Input:**
```json
{
  "collection": "blogs",
  "data": {
    "title": "New Blog Post",
    "slug": "new-blog-post",
    "content": "Blog content here...",
    "status": "draft",
    "author": "user-1"
  }
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "id": 26,
    "title": "New Blog Post",
    "slug": "new-blog-post",
    "status": "draft"
  },
  "message": "Item created successfully"
}
```

---

### 6. **directus_update_item**
Update an existing item.

**Input:**
```json
{
  "collection": "blogs",
  "id": "1",
  "data": {
    "title": "Updated Title",
    "status": "published"
  }
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "status": "published"
  },
  "message": "Item updated successfully"
}
```

---

### 7. **directus_delete_item**
Delete an item from a collection.

**Input:**
```json
{
  "collection": "blogs",
  "id": "1"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Item 1 deleted successfully from blogs"
}
```

---

### 8. **directus_get_collection_schema**
Get the schema and field definitions for a collection.

**Input:**
```json
{
  "collection": "blogs"
}
```

**Output:**
```json
{
  "success": true,
  "collection": {
    "collection": "blogs",
    "meta": {
      "icon": null,
      "archive_field": "status",
      "archive_value": "archived",
      "singleton": false
    },
    "schema": {
      "name": "blogs",
      "schema": "public"
    }
  },
  "fields": [
    {
      "field": "id",
      "type": "integer",
      "schema": { "has_auto_increment": true }
    },
    {
      "field": "title",
      "type": "string",
      "schema": { "max_length": 255 }
    }
  ]
}
```

---

### 9. **directus_search**
Search for items with advanced filtering options.

**Input:**
```json
{
  "collection": "blogs",
  "search_field": "title",
  "search_value": "blog",
  "search_type": "contains"
}
```

**Search types:**
- `exact`: Exact match
- `contains`: Text contains value
- `starts_with`: Text starts with value
- `ends_with`: Text ends with value

**Output:**
```json
{
  "success": true,
  "results": [
    {
      "id": 1,
      "title": "My Blog Post",
      "slug": "my-blog-post"
    }
  ],
  "count": 5
}
```

---

## Available Collections

Based on your Directus setup, these collections are available:

### Content Collections
- **blogs** - Blog posts with files support
- **categories** - Content categories
- **services** - Service listings
- **contact_messages** - Contact form submissions with files
- **notifications** - System notifications
- **reports** - Customer service reports with files
- **fqa** - FAQ items (Frequently Asked Questions)
- **meta_tags** - SEO meta tags
- **global_seo** - Global SEO settings (singleton)
- **terms_and_policies** - Terms and policies (singleton)

### System Collections (Directus)
- **directus_users** - User accounts
- **directus_files** - File management
- **directus_folders** - File folder structure
- **directus_roles** - User roles
- **directus_permissions** - Access control
- **directus_collections** - Collection definitions
- **directus_fields** - Field configurations
- **directus_activity** - Activity log
- And many more system collections...

---

## Collection Relationships

### blogs → categories (Many-to-One)
A blog post belongs to a category.

### blogs → directus_users (Many-to-One)
A blog post has an author (from directus_users).

### blogs → blogs_files (One-to-Many)
A blog post can have multiple attached files.

### contact_messages → directus_users (Many-to-One)
A contact message may be assigned to a user.

### contact_messages → contact_messages_files (One-to-Many)
A contact message can have attachments.

### reports → directus_users (Many-to-One)
A report is created by or assigned to a user.

### reports → reports_files (One-to-Many)
A report can have attached files.

---

## Usage Examples

### Example 1: List all published blogs

```javascript
// Using the tool
{
  "collection": "blogs",
  "filter": {
    "status": {
      "_eq": "published"
    }
  },
  "fields": ["id", "title", "slug", "created_on"]
}
```

### Example 2: Search for a blog by title

```javascript
{
  "collection": "blogs",
  "search_field": "title",
  "search_value": "tutorial",
  "search_type": "contains"
}
```

### Example 3: Get blog with all related data

```javascript
{
  "collection": "blogs",
  "id": "1",
  "fields": ["*", "author.*", "category.*", "files.*"]
}
```

### Example 4: Create a new blog post

```javascript
{
  "collection": "blogs",
  "data": {
    "title": "Getting Started with Directus",
    "slug": "getting-started-directus",
    "content": "This is a comprehensive guide...",
    "status": "draft",
    "author": "1",
    "category": "2"
  }
}
```

---

## Configuration

### Environment Variables

Create a `.env` file in the directus-mcp directory:

```env
DIRECTUS_URL=http://localhost:8055
DIRECTUS_EMAIL=admin@example.com
DIRECTUS_PASSWORD=your_password
NODE_ENV=production
```

### Claude Configuration

Add to `~/.config/claude/claude_desktop_config.json` (or Windows equivalent):

```json
{
  "mcpServers": {
    "directus": {
      "command": "node",
      "args": ["/path/to/directus-mcp/server.js"],
      "env": {
        "DIRECTUS_URL": "http://localhost:8055"
      }
    }
  }
}
```

---

## Troubleshooting

### Connection Issues
- Ensure Directus is running at `http://localhost:8055`
- Check firewall settings
- Verify API endpoint is accessible

### Authentication Errors
- Verify email and password are correct
- Check user has appropriate permissions
- Ensure user account is not archived

### Field Errors
- Use `directus_get_collection_schema` to see available fields
- Ensure field names match exactly (case-sensitive)
- Check field types match your data

### Permission Denied
- Ensure authenticated user has read/write permissions
- Check role permissions in Directus admin panel
- Verify collection-specific access rules

---

## API Reference

**Base URL:** `http://localhost:8055/api`

### REST Endpoints Used Internally

- `POST /auth/login` - Authentication
- `GET /collections` - List collections
- `GET /items/{collection}` - Get items
- `GET /items/{collection}/{id}` - Get single item
- `POST /items/{collection}` - Create item
- `PATCH /items/{collection}/{id}` - Update item
- `DELETE /items/{collection}/{id}` - Delete item
- `GET /collections/{collection}` - Collection schema
- `GET /fields/{collection}` - Collection fields

---

## License

MIT

## Support

For issues or questions about the Directus MCP Server, refer to:
- [Directus Documentation](https://docs.directus.io)
- [MCP Documentation](https://modelcontextprotocol.io)
- [Claude Documentation](https://claude.ai/docs)
