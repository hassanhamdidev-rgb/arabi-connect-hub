# Directus Schema Documentation - Updated

## Collections Overview

### Content Collections (User-Managed)

#### 1. **faqs**
Frequently Asked Questions management.

**Archive Configuration:**
- Archive field: `status`
- Status values: `active`, `archived`

**Common Fields:**
- `id` (integer, auto-increment)
- `status` (string: active, archived)
- `sort` (integer, nullable)
- `question` (string)
- `answer` (text)
- `icon` (string) - Icon name (e.g., "HelpCircle")
- `category` (string) - Category name (e.g., "عام")
- `meta_description` (text, nullable)
- `meta_title` (string, nullable)
- `tl_dr` (text, nullable) - "Too Long; Didn't Read" summary
- `faqs` (relation, nullable) - Self-referencing relation
- `tag` (string, nullable)
- `user_created` (uuid) - Creator user ID
- `date_created` (datetime)
- `user_updated` (uuid, nullable)
- `date_updated` (datetime, nullable)

---

#### 2. **blogs**
Blog posts management collection.

**Archive Configuration:**
- Archive field: `status`
- Status values: `draft`, `published`, `archived`

**Common Fields:**
- `id` (integer, auto-increment)
- `status` (string: draft, published, archived)
- `sort` (integer, nullable)
- `name` (string) - Blog title
- `slug` (string) - URL-friendly identifier
- `description` (string) - Short description
- `content` (text) - HTML/Rich text content
- `author` (uuid) - Relation to directus_users
- `category` (string) - Category name
- `meta_description` (text, nullable)
- `meta_title` (string, nullable)
- `views` (integer, nullable) - View counter
- `excerpt` (text, nullable)
- `reading_time` (string, nullable) - e.g., "10 دقائق"
- `featured` (boolean, nullable) - Featured status
- `tl_dr` (text, nullable)
- `faqs` (relation, nullable)
- `tag` (string, nullable)
- `files` (array of integers) - File IDs attached to blog
- `user_created` (uuid)
- `date_created` (datetime)
- `user_updated` (uuid)
- `date_updated` (datetime)

**Related Collections:**
- `directus_files` (One-to-Many) - Attached files via `files` array
- `directus_users` (Many-to-One) - Author

---

#### 3. **categories**
Content categorization for blogs.

**Archive Configuration:**
- Archive field: `status`
- Status values: `published`, `archived`

**Common Fields:**
- `id` (integer)
- `status` (string: published, archived)
- `sort` (integer, nullable)
- `name` (string)
- `type` (string) - Category type (e.g., "blog")
- `slug` (string) - URL-friendly identifier
- `description` (text)
- `meta_description` (text, nullable)
- `meta_title` (string, nullable)
- `tl_dr` (text, nullable)
- `faqs` (relation, nullable)
- `tag` (string, nullable)
- `user_created` (uuid)
- `date_created` (datetime)
- `user_updated` (uuid)
- `date_updated` (datetime)

**Related Collections:**
- `blogs` (One-to-Many) - Blog posts in this category

---

#### 4. **services** (also referred to as "fields" in some contexts)
Service/field listings.

**Archive Configuration:**
- Archive field: `status`
- Status values: `active`, `archived`

**Common Fields:**
- `id` (integer)
- `status` (string: active, archived)
- `sort` (integer, nullable)
- `name` (string) - Service name
- `slug` (string)
- `description` (text)
- `icon` (string) - Icon identifier
- `image` (uuid) - Relation to directus_files
- `content` (text, nullable)
- `type` (string) - Service type (e.g., "business", "الخدمة الاولي")
- `price` (decimal, nullable)
- `duration` (string, nullable)
- `featured` (boolean, nullable)
- `meta_title` (string, nullable)
- `meta_description` (text, nullable)
- `tl_dr` (text, nullable)
- `faqs` (relation, nullable)
- `tag` (string, nullable)
- `user_created` (uuid)
- `date_created` (datetime)
- `user_updated` (uuid)
- `date_updated` (datetime)

**Related Collections:**
- `directus_files` (Many-to-One) - Service image

---

#### 5. **contact_messages**
Contact form submissions and inquiries.

**Archive Configuration:**
- Archive field: `status`
- Status values: `published`, `archived`, `new`, `read`

**Common Fields:**
- `id` (integer)
- `status` (string)
- `sort` (integer, nullable)
- `name` (string) - Sender name
- `sender_email` (string) - Sender email
- `receiver_email` (string) - Recipient email
- `phone` (string) - Sender phone
- `category` (string) - Message category
- `description` (text) - Message content
- `is_read` (boolean, nullable) - Read status
- `is_replied` (boolean, nullable) - Reply status
- `reviewer` (uuid, nullable) - User who reviewed
- `related_message` (integer, nullable) - Related message ID
- `ip_address_clients` (string, nullable)
- `owner` (uuid, nullable)
- `files` (array) - Attached files
- `user_created` (uuid)
- `date_created` (datetime)
- `user_updated` (uuid, nullable)
- `date_updated` (datetime, nullable)

**Related Collections:**
- `directus_files` (One-to-Many) - Attachments
- `directus_users` (Many-to-One) - Reviewer

---

#### 6. **notifications**
System notifications.

**Archive Configuration:**
- Archive field: `status`
- Status values: `published`, `archived`

**Common Fields:**
- `id` (integer)
- `status` (string: published, archived)
- `sort` (integer, nullable)
- `category` (string) - Notification category (e.g., "contact message")
- `description` (text) - Notification message
- `url` (string, nullable) - Related URL (e.g., "/messages")
- `icon` (string, nullable) - Icon identifier
- `is_read` (boolean) - Read status
- `read_at` (datetime, nullable) - When notification was read
- `user_created` (uuid)
- `date_created` (datetime)
- `user_updated` (uuid, nullable)
- `date_updated` (datetime, nullable)

---

#### 7. **about** (Singleton)
About page content.

**Type:** Singleton (only one record)

**Common Fields:**
- `id` (integer)
- `status` (string: published, archived)
- `vision` (text) - Vision statement
- `mission` (text) - Mission statement
- `value` (text) - Company values
- `about_office` (text) - Office description
- `experiences` (array of strings) - List of experiences
- `services` (array of strings) - List of services offered
- `images` (array of integers) - Image file IDs
- `user_created` (uuid)
- `date_created` (datetime)
- `user_updated` (uuid)
- `date_updated` (datetime)

**Related Collections:**
- `directus_files` (One-to-Many) - About page images

---

#### 8. **social_links**
Social media links.

**Archive Configuration:**
- Archive field: `status`
- Status values: `published`, `archived`

**Common Fields:**
- `id` (integer)
- `status` (string: published, archived)
- `sort` (integer, nullable)
- `name` (string) - Social platform name (e.g., "facebook")
- `url` (string) - Social profile URL
- `icon` (string) - Icon identifier
- `user_created` (uuid)
- `date_created` (datetime)
- `user_updated` (uuid, nullable)
- `date_updated` (datetime, nullable)

---

#### 9. **terms_and_policies** (Singleton)
Terms of service and privacy policies.

**Type:** Singleton (only one record)

**Common Fields:**
- `id` (integer)
- `status` (string: published, archived)
- `terms` (text) - Terms of service
- `policy` (text) - Privacy policy
- `user_created` (uuid)
- `date_created` (datetime)
- `user_updated` (uuid)
- `date_updated` (datetime)

---

### System Collections (Directus Built-in)

#### **directus_users**
User accounts management.

**Fields:**
- `id` (uuid)
- `first_name` (string)
- `last_name` (string)
- `email` (string, unique)
- `password` (hash)
- `role` (relation to directus_roles)
- `status` (string: active, suspended, archived)
- `last_access` (datetime)
- `auth_data` (json)
- `policies` (relation to directus_policies)
- `avatar` (relation to directus_files)

**Display Template:** `{{ first_name }} {{ last_name }}`

---

#### **directus_files**
File management system.

**Fields:**
- `id` (uuid)
- `storage` (string) - Storage location
- `filename_disk` (string)
- `filename_download` (string)
- `title` (string)
- `type` (string) - MIME type
- `folder` (relation to directus_folders)
- `uploaded_by` (relation to directus_users)
- `created_on` (datetime)
- `modified_on` (datetime)
- `file_size` (integer)
- `width` (integer)
- `height` (integer)
- `duration` (integer)
- `metadata` (json)

**Display Template:** `{{ $thumbnail }} {{ title }}`

---

#### **directus_folders**
Folder structure for file organization.

**Fields:**
- `id` (uuid)
- `name` (string)
- `parent` (relation to directus_folders)

**Display Template:** `{{ name }}`

---

#### **directus_roles**
User role definitions.

**Fields:**
- `id` (uuid)
- `name` (string)
- `icon` (string)
- `description` (text)

---

#### **directus_permissions**
Permission rules for collections and fields.

**Fields:**
- `id` (integer)
- `role` (relation to directus_roles)
- `collection` (string)
- `action` (string: create, read, update, delete, share)
- `permissions` (json)
- `validation` (json)
- `presets` (json)

---

#### **directus_activity**
Activity log for all changes.

**Fields:**
- `id` (integer)
- `action` (string) - create, update, delete, login
- `user` (relation to directus_users)
- `timestamp` (datetime)
- `ip` (string)
- `user_agent` (string)
- `collection` (string)
- `item` (string)
- `comment` (text)

---

#### **directus_sessions**
Active user sessions.

**Fields:**
- `token` (string, pk)
- `user` (relation to directus_users)
- `expires` (datetime)
- `ip` (string)
- `user_agent` (string)
- `data` (json)

---

## Relationships Map

```
faqs
├── category (string reference)
└── faqs ← faqs (self-reference)

blogs
├── author → directus_users
├── category (string reference)
└── files → directus_files (array)

categories
└── blogs ← blogs (inverse)

services (fields)
├── image → directus_files
└── type (string classification)

contact_messages
├── reviewer → directus_users
├── files → directus_files (array)
└── related_message ← contact_messages (self-reference)

notifications
├── category (string reference)
└── url (external reference)

about (Singleton)
└── images → directus_files (array)

social_links
└── (no relations)

terms_and_policies (Singleton)
└── (no relations)

directus_users
├── role → directus_roles
├── avatar → directus_files
└── blogs ← blogs (inverse author)
```

## Audit Fields Pattern

All content collections follow this audit field pattern:

```json
{
  "user_created": "uuid",
  "date_created": "datetime",
  "user_updated": "uuid (nullable)",
  "date_updated": "datetime (nullable)"
}
```

- **user_created:** UUID of the user who created the record
- **date_created:** Timestamp when record was created
- **user_updated:** UUID of the user who last updated (null if never updated)
- **date_updated:** Timestamp of last update (null if never updated)

---

## Data Types Reference

- `string` - Text (varchar)
- `integer` - Whole numbers
- `decimal` - Decimal numbers
- `boolean` - True/False
- `text` - Long text (with HTML support in content fields)
- `datetime` - Date and time
- `date` - Date only
- `time` - Time only
- `json` - JSON object
- `uuid` - UUID identifier
- `hash` - Hashed values (passwords)
- `relation` - Foreign key reference
- `file` - File reference
- `array` - Array of values (integers for file/relation arrays)

---

## Archive Configuration

Collections with archive support use status fields:

**Common Status Values:**
- `published` - Published/active state
- `active` - Active state (used in some collections)
- `draft` - Draft state
- `archived` - Archived/deleted state
- `new` - New/unread state (for messages/notifications)
- `read` - Read state (for messages/notifications)

---

## Singleton Collections

These collections contain only one record:

1. **about** - About page content
2. **terms_and_policies** - Legal documents

When querying singleton collections, there's always just one item.

---

## Common Query Patterns

### Filter by status
```json
{
  "filter": {
    "status": {
      "_eq": "published"
    }
  }
}
```

### Filter with AND condition
```json
{
  "filter": {
    "_and": [
      { "status": { "_eq": "published" } },
      { "category": { "_eq": "Blog Category" } }
    ]
  }
}
```

### Filter with OR condition
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

### Text search
```json
{
  "filter": {
    "name": {
      "_contains": "search term"
    }
  }
}
```

### Date filtering
```json
{
  "filter": {
    "date_created": {
      "_gte": "2026-05-01"
    }
  }
}
```

### Get items with relations expanded
```json
{
  "fields": ["*", "files.*", "author.*"],
  "filter": {
    "status": { "_eq": "published" }
  }
}
```

---

## Operators Reference

- `_eq` - Equal to
- `_neq` - Not equal to
- `_lt` - Less than
- `_lte` - Less than or equal
- `_gt` - Greater than
- `_gte` - Greater than or equal
- `_in` - In array
- `_nin` - Not in array
- `_contains` - Contains string (case-sensitive)
- `_ncontains` - Does not contain
- `_icontains` - Contains string (case-insensitive)
- `_starts_with` - Starts with
- `_ends_with` - Ends with
- `_between` - Between range
- `_is_empty` - Is empty/null
- `_is_not_empty` - Is not empty/null

---

## Key Differences from Standard Schema

### Custom Implementations:
1. **String Categories:** Most collections use string fields for categories instead of relations
2. **Array Fields:** Services and About use arrays for multiple related values instead of junction collections
3. **Self-References:** FAQs and Contact Messages support self-referencing relations
4. **Status Values:** Different collections use different status conventions (active/published/draft)
5. **Audit Trail:** All collections include user and date tracking for creation and updates
6. **SEO Fields:** Common SEO fields (meta_title, meta_description) across multiple collections
7. **TL;DR Summaries:** Optional summary field across content collections for quick reading

---

## Data Validation Notes

- **Slug fields:** Should be URL-friendly, typically auto-generated from name
- **Status fields:** Use enumerated values as documented per collection
- **Email fields:** Should validate email format
- **URL fields:** Should validate URL format
- **File arrays:** Contain directus_files IDs (uuids)
- **Audit fields:** Auto-managed by Directus, typically not editable by users
