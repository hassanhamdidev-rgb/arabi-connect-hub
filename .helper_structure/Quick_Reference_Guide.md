# Directus Collections - Quick Reference Guide

## Collections at a Glance

| Collection | Type | Purpose | Key Fields | Status Values |
|---|---|---|---|---|
| **faqs** | Content | Q&A management | question, answer, icon, category | active, archived |
| **blogs** | Content | Blog posts | name, slug, content, author, files | draft, published, archived |
| **categories** | Content | Content categories | name, type, slug, description | published, archived |
| **services** | Content | Service listings | name, description, icon, image, price | active, archived |
| **contact_messages** | Content | Form submissions | sender_email, receiver_email, description, files | new, read, archived |
| **notifications** | Content | System alerts | category, description, url, icon | published, archived |
| **social_links** | Content | Social media links | name, url, icon | published, archived |
| **about** | Singleton | About page | vision, mission, value, images | published, archived |
| **terms_and_policies** | Singleton | Legal docs | terms, policy | published, archived |

---

## Quick Field Schemas

### FAQs
```json
{
  "id": 1,
  "status": "active",
  "question": "string",
  "answer": "text",
  "icon": "string",
  "category": "string",
  "meta_title": "string (nullable)",
  "meta_description": "text (nullable)",
  "tl_dr": "text (nullable)",
  "tag": "string (nullable)",
  "sort": "integer (nullable)",
  "user_created": "uuid",
  "date_created": "datetime",
  "user_updated": "uuid (nullable)",
  "date_updated": "datetime (nullable)"
}
```

### Blogs
```json
{
  "id": 1,
  "status": "published",
  "name": "string",
  "slug": "string",
  "description": "string",
  "content": "text (HTML)",
  "author": "uuid",
  "category": "string",
  "files": ["uuid"],
  "meta_title": "string (nullable)",
  "meta_description": "text (nullable)",
  "views": "integer (nullable)",
  "excerpt": "text (nullable)",
  "reading_time": "string (nullable)",
  "featured": "boolean (nullable)",
  "tl_dr": "text (nullable)",
  "tag": "string (nullable)",
  "sort": "integer (nullable)",
  "user_created": "uuid",
  "date_created": "datetime",
  "user_updated": "uuid",
  "date_updated": "datetime"
}
```

### Categories
```json
{
  "id": 1,
  "status": "published",
  "name": "string",
  "slug": "string",
  "type": "string",
  "description": "text",
  "meta_title": "string (nullable)",
  "meta_description": "text (nullable)",
  "tl_dr": "text (nullable)",
  "tag": "string (nullable)",
  "sort": "integer (nullable)",
  "user_created": "uuid",
  "date_created": "datetime",
  "user_updated": "uuid",
  "date_updated": "datetime"
}
```

### Services
```json
{
  "id": 1,
  "status": "active",
  "name": "string",
  "slug": "string",
  "description": "text",
  "icon": "string",
  "image": "uuid",
  "content": "text (nullable)",
  "type": "string",
  "price": "decimal (nullable)",
  "duration": "string (nullable)",
  "featured": "boolean (nullable)",
  "meta_title": "string (nullable)",
  "meta_description": "text (nullable)",
  "tl_dr": "text (nullable)",
  "tag": "string (nullable)",
  "sort": "integer (nullable)",
  "user_created": "uuid",
  "date_created": "datetime",
  "user_updated": "uuid",
  "date_updated": "datetime"
}
```

### Contact Messages
```json
{
  "id": 1,
  "status": "new",
  "name": "string",
  "sender_email": "string",
  "receiver_email": "string",
  "phone": "string",
  "category": "string",
  "description": "text",
  "files": ["uuid"],
  "is_read": "boolean (nullable)",
  "is_replied": "boolean (nullable)",
  "reviewer": "uuid (nullable)",
  "related_message": "integer (nullable)",
  "ip_address_clients": "string (nullable)",
  "owner": "uuid (nullable)",
  "sort": "integer (nullable)",
  "user_created": "uuid",
  "date_created": "datetime",
  "user_updated": "uuid (nullable)",
  "date_updated": "datetime (nullable)"
}
```

### Notifications
```json
{
  "id": 1,
  "status": "published",
  "category": "string",
  "description": "text",
  "url": "string (nullable)",
  "icon": "string (nullable)",
  "is_read": "boolean",
  "read_at": "datetime (nullable)",
  "sort": "integer (nullable)",
  "user_created": "uuid",
  "date_created": "datetime",
  "user_updated": "uuid (nullable)",
  "date_updated": "datetime (nullable)"
}
```

### Social Links
```json
{
  "id": 1,
  "status": "published",
  "name": "string",
  "url": "string",
  "icon": "string",
  "sort": "integer (nullable)",
  "user_created": "uuid",
  "date_created": "datetime",
  "user_updated": "uuid (nullable)",
  "date_updated": "datetime (nullable)"
}
```

### About (Singleton)
```json
{
  "id": 1,
  "status": "published",
  "vision": "text",
  "mission": "text",
  "value": "text",
  "about_office": "text",
  "experiences": ["string"],
  "services": ["string"],
  "images": ["uuid"],
  "user_created": "uuid",
  "date_created": "datetime",
  "user_updated": "uuid",
  "date_updated": "datetime"
}
```

### Terms and Policies (Singleton)
```json
{
  "id": 1,
  "status": "published",
  "terms": "text",
  "policy": "text",
  "user_created": "uuid",
  "date_created": "datetime",
  "user_updated": "uuid",
  "date_updated": "datetime"
}
```

---

## Common API Queries

### Get All Published Blogs
```javascript
GET /items/blogs?filter[status][_eq]=published&sort=-date_created
```

### Get Blogs with Attached Files
```javascript
GET /items/blogs?filter[status][_eq]=published&fields=*,files.id,files.title
```

### Get FAQs by Category
```javascript
GET /items/faqs?filter[category][_eq]=عام&filter[status][_eq]=active
```

### Get Active Services with Images
```javascript
GET /items/services?filter[status][_eq]=active&fields=*,image.id,image.filename_download
```

### Get Contact Messages (Unread)
```javascript
GET /items/contact_messages?filter[is_read][_eq]=false&sort=-date_created
```

### Get Recent Notifications (Unread)
```javascript
GET /items/notifications?filter[is_read][_eq]=false&sort=-date_created&limit=10
```

### Get About Page Content
```javascript
GET /items/about?fields=*,images.id,images.filename_download
```

### Get All Social Links
```javascript
GET /items/social_links?filter[status][_eq]=published&sort=sort
```

### Get Terms and Policies
```javascript
GET /items/terms_and_policies?limit=1
```

---

## Common Filter Patterns

### By Status
```json
{
  "filter": {
    "status": { "_eq": "published" }
  }
}
```

### By Multiple Statuses
```json
{
  "filter": {
    "_or": [
      { "status": { "_eq": "published" } },
      { "status": { "_eq": "draft" } }
    ]
  }
}
```

### By Date Range
```json
{
  "filter": {
    "_and": [
      { "date_created": { "_gte": "2026-05-01" } },
      { "date_created": { "_lte": "2026-05-31" } }
    ]
  }
}
```

### By String Contains
```json
{
  "filter": {
    "name": { "_contains": "search term" }
  }
}
```

### By Category
```json
{
  "filter": {
    "category": { "_eq": "عام" }
  }
}
```

### By Array Contains (Files)
```json
{
  "filter": {
    "files": { "_nnull": true }
  }
}
```

### Complex: Published Blogs in Arabic
```json
{
  "filter": {
    "_and": [
      { "status": { "_eq": "published" } },
      { "category": { "_neq": "English" } }
    ]
  }
}
```

---

## Sorting

### By Date (Newest First)
```
sort=-date_created
```

### By Date (Oldest First)
```
sort=date_created
```

### By Sort Field (Custom Order)
```
sort=sort
```

### By Multiple Fields
```
sort=-date_created,name
```

### By Views (Most Popular)
```
sort=-views
```

---

## Pagination

### Get First 10 Items
```
limit=10&offset=0
```

### Get Page 2 (20 items per page)
```
limit=20&offset=20
```

### Get Last 5 Items
```
limit=5&sort=-date_created
```

---

## Field Selection

### Get All Fields
```
fields=*
```

### Get Specific Fields
```
fields=id,name,slug,status
```

### Get Fields with Relations
```
fields=*,author.id,author.first_name,author.email
```

### Get Array Relations Expanded
```
fields=*,files.id,files.filename_download,files.type
```

---

## Common Update Patterns

### Mark as Read
```json
PATCH /items/notifications/1
{
  "is_read": true,
  "read_at": "2026-05-01T12:00:00Z"
}
```

### Update Blog Status
```json
PATCH /items/blogs/7
{
  "status": "published",
  "featured": true
}
```

### Increment View Count
```json
PATCH /items/blogs/7
{
  "views": 42
}
```

### Mark Contact Message as Replied
```json
PATCH /items/contact_messages/15
{
  "is_replied": true,
  "reviewer": "f31882ed-ae6a-4b88-86f4-e113f12bb5e1"
}
```

---

## Common Creation Patterns

### Create FAQ
```json
POST /items/faqs
{
  "status": "active",
  "question": "How do I get started?",
  "answer": "Follow these steps...",
  "icon": "HelpCircle",
  "category": "Basics"
}
```

### Create Blog Post
```json
POST /items/blogs
{
  "status": "draft",
  "name": "My New Post",
  "slug": "my-new-post",
  "description": "A brief description",
  "content": "<p>Full HTML content here...</p>",
  "author": "f31882ed-ae6a-4b88-86f4-e113f12bb5e1",
  "category": "Tutorial"
}
```

### Create Service
```json
POST /items/services
{
  "status": "active",
  "name": "SEO Optimization",
  "slug": "seo-optimization",
  "description": "Improve your search rankings",
  "icon": "search",
  "price": 500.00,
  "type": "business"
}
```

### Create Contact Message
```json
POST /items/contact_messages
{
  "status": "new",
  "name": "John Doe",
  "sender_email": "john@example.com",
  "receiver_email": "info@company.com",
  "phone": "+1234567890",
  "category": "Inquiry",
  "description": "I would like to know more about..."
}
```

---

## Audit Trail Examples

### Get Items Created by Specific User
```
filter[user_created][_eq]=f31882ed-ae6a-4b88-86f4-e113f12bb5e1
```

### Get Recently Updated Items
```
filter[user_updated][_nnull]=true&sort=-date_updated
```

### Get Items Never Updated (Created and Left)
```
filter[user_updated][_null]=true
```

---

## Tips & Best Practices

1. **Always specify status in filters** unless you want all states (draft, published, archived)

2. **Use sort field for custom ordering** of FAQs, Services, and Social Links

3. **File arrays contain UUIDs** - expand with `fields=*,files.id,files.filename_download` to get details

4. **Category is a string** - no need to expand, just filter by value

5. **Audit fields are immutable** - set once on creation, updated automatically on edit

6. **TL;DR summaries** should be <100 characters for quick previews

7. **Meta fields should be SEO-optimized** - titles <60 chars, descriptions <160 chars

8. **Self-references** (faqs, contact_messages) can create nested structures

9. **Arrays in About page** - ensure descriptions match order of images

10. **Singletons** - only one record exists, use `?limit=1` to retrieve

---

## Common Gotchas

❌ **Don't:**
- Assume category is a relational field (it's a string)
- Use `created_on`/`updated_on` (use `date_created`/`date_updated`)
- Create multiple About or Terms pages (they're singletons)
- Forget to include `files.*` when you need file details
- Use `email` field (it's split into `sender_email` and `receiver_email`)

✅ **Do:**
- Specify status explicitly in filters
- Use audit fields (user_created, date_updated) for tracking
- Expand nested relations for complete data
- Validate category values match your domain
- Use pagination for large result sets

