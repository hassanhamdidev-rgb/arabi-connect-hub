# Directus Schema Documentation

## Collections Overview

### Content Collections (User-Managed)

#### 1. **blogs**
Blog posts management collection.

**Archive Configuration:**
- Archive field: `status`
- Archive value: `archived`
- Unarchive value: `draft`

**Common Fields:**
- `id` (integer, auto-increment)
- `title` (string)
- `slug` (string)
- `content` (text)
- `status` (string: draft, published, archived)
- `author` (relation to directus_users)
- `category` (relation to categories)
- `created_on` (datetime)
- `updated_on` (datetime)

**Related Collections:**
- `blogs_files` (One-to-Many) - Attached files
- `categories` (Many-to-One) - Blog category
- `directus_users` (Many-to-One) - Author

---

#### 2. **blogs_files**
File attachments for blog posts.

**Type:** Hidden junction/mapping collection
**Icon:** import_export

**Common Fields:**
- `blogs_id` (relation to blogs)
- `files_id` (relation to directus_files)
- `sort` (integer)

---

#### 3. **categories**
Content categorization.

**Archive Configuration:**
- Archive field: `status`
- Sort field: `sort`

**Common Fields:**
- `id` (integer)
- `name` (string)
- `slug` (string)
- `description` (text)
- `status` (string)
- `sort` (integer)

**Related Collections:**
- `blogs` (One-to-Many) - Blog posts in this category

---

#### 4. **services**
Service listings.

**Archive Configuration:**
- Archive field: `status`
- Sort field: `sort`

**Common Fields:**
- `id` (integer)
- `name` (string)
- `slug` (string)
- `description` (text)
- `price` (decimal)
- `status` (string)
- `sort` (integer)

---

#### 5. **contact_messages**
Contact form submissions.

**Archive Configuration:**
- Archive field: `status`
- Archive value: `archived`

**Common Fields:**
- `id` (integer)
- `name` (string)
- `email` (string)
- `phone` (string)
- `subject` (string)
- `message` (text)
- `status` (string: new, read, archived)
- `assigned_to` (relation to directus_users)
- `created_on` (datetime)

**Related Collections:**
- `contact_messages_files` (One-to-Many) - Attachments
- `directus_users` (Many-to-One) - Assigned user

---

#### 6. **contact_messages_files**
File attachments for contact messages.

**Type:** Hidden junction collection
**Icon:** import_export

**Common Fields:**
- `contact_messages_id` (relation to contact_messages)
- `files_id` (relation to directus_files)

---

#### 7. **notifications**
System notifications.

**Archive Configuration:**
- Archive field: `status`

**Common Fields:**
- `id` (integer)
- `title` (string)
- `message` (text)
- `type` (string: info, warning, error, success)
- `status` (string: active, archived)
- `recipient` (relation to directus_users)
- `created_on` (datetime)

---

#### 8. **reports**
Customer service reports.

**Note:** "Customer Service"
**Archive Configuration:**
- Archive field: `status`

**Common Fields:**
- `id` (integer)
- `title` (string)
- `description` (text)
- `status` (string)
- `created_by` (relation to directus_users)
- `assigned_to` (relation to directus_users)
- `priority` (string)
- `created_on` (datetime)

**Related Collections:**
- `reports_files` (One-to-Many) - Attachments
- `directus_users` (Many-to-One)

---

#### 9. **reports_files**
File attachments for reports.

**Type:** Hidden junction collection
**Icon:** import_export

**Common Fields:**
- `reports_id` (relation to reports)
- `files_id` (relation to directus_files)

---

#### 10. **fqa**
Frequently Asked Questions.

**Archive Configuration:**
- Archive field: `status`
- Sort field: `sort`

**Common Fields:**
- `id` (integer)
- `question` (string)
- `answer` (text)
- `category` (relation to categories)
- `status` (string)
- `sort` (integer)
- `created_on` (datetime)

---

#### 11. **meta_tags**
SEO meta tags for pages.

**Archive Configuration:**
- Archive field: `status`

**Common Fields:**
- `id` (integer)
- `page` (string) - Page path or name
- `title` (string) - Meta title
- `description` (text) - Meta description
- `keywords` (string)
- `og_title` (string) - Open Graph title
- `og_description` (text)
- `og_image` (relation to directus_files)
- `status` (string)

---

#### 12. **global_seo**
Global SEO settings for the entire site.

**Type:** Singleton (only one record)
**Archive Configuration:**
- Archive field: `status`

**Common Fields:**
- `site_title` (string)
- `site_description` (text)
- `site_keywords` (string)
- `default_og_image` (relation to directus_files)
- `robots_txt` (text)
- `sitemap_enabled` (boolean)

---

#### 13. **terms_and_policies**
Terms of service and privacy policies.

**Type:** Singleton (only one record)

**Common Fields:**
- `terms_of_service` (text)
- `privacy_policy` (text)
- `cookie_policy` (text)
- `last_updated` (datetime)

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

**Display Template:** (Auto-generated)

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

#### **directus_collections**
Collection metadata definitions.

**Icon:** database
**Note:** "$t:directus_collection.directus_collections"

**Fields:**
- `collection` (string, pk)
- `icon` (string)
- `note` (text)
- `display_template` (string)
- `hidden` (boolean)
- `singleton` (boolean)
- `translatable` (boolean)

---

#### **directus_fields**
Field configuration for collections.

**Icon:** input

**Fields:**
- `id` (integer)
- `collection` (relation to directus_collections)
- `field` (string)
- `type` (string) - Field type (string, integer, boolean, etc.)
- `db_type` (string) - Database type
- `interface` (string) - UI interface
- `options` (json)
- `locked` (boolean)
- `required` (boolean)
- `sort` (integer)
- `group` (string)

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

#### **directus_access**
API token and access management.

**Icon:** admin_panel_settings
**Display Template:** `{{ policy.name }}`

**Fields:**
- `id` (uuid)
- `policy` (relation to directus_policies)
- `user` (relation to directus_users)
- `role` (relation to directus_roles)

---

## Relationships Map

```
blogs
├── author → directus_users
├── category → categories
└── files → blogs_files → directus_files

categories
└── blogs ← blogs (inverse)

contact_messages
├── assigned_to → directus_users
└── files → contact_messages_files → directus_files

reports
├── created_by → directus_users
├── assigned_to → directus_users
└── files → reports_files → directus_files

fqa
├── category → categories
└── status (archive field)

meta_tags
└── og_image → directus_files

global_seo (Singleton)
└── default_og_image → directus_files

terms_and_policies (Singleton)
└── (no relations)

directus_users
├── role → directus_roles
├── avatar → directus_files
├── policies ← directus_policies (inverse)
└── blogs ← blogs (inverse author)
```

## Data Types Reference

- `string` - Text (varchar)
- `integer` - Whole numbers
- `decimal` - Decimal numbers
- `boolean` - True/False
- `text` - Long text
- `datetime` - Date and time
- `date` - Date only
- `time` - Time only
- `json` - JSON object
- `uuid` - UUID identifier
- `hash` - Hashed values (passwords)
- `relation` - Foreign key reference
- `file` - File reference

## Archive Configuration

Collections with archive support use status fields:

**Default Pattern:**
- **Archive field:** `status`
- **Archive value:** `archived` (item marked as archived)
- **Unarchive value:** `draft` (item reverted to draft)

This allows soft-deletes where items are marked as archived rather than permanently deleted.

## Singleton Collections

These collections contain only one record:

1. **global_seo** - Site-wide SEO settings
2. **terms_and_policies** - Legal documents

When querying singleton collections, there's always just one item.

## Filtering & Query Examples

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
      {
        "status": { "_eq": "published" }
      },
      {
        "category": { "_eq": 1 }
      }
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
    "title": {
      "_contains": "tutorial"
    }
  }
}
```

### Date filtering
```json
{
  "filter": {
    "created_on": {
      "_gte": "2024-01-01"
    }
  }
}
```

## Operators Reference

- `_eq` - Equal to
- `_neq` - Not equal to
- `_lt` - Less than
- `_lte` - Less than or equal
- `_gt` - Greater than
- `_gte` - Greater than or equal
- `_in` - In array
- `_nin` - Not in array
- `_contains` - Contains string
- `_ncontains` - Does not contain
- `_starts_with` - Starts with
- `_ends_with` - Ends with
- `_between` - Between range
- `_is_empty` - Is empty
- `_is_not_empty` - Is not empty
