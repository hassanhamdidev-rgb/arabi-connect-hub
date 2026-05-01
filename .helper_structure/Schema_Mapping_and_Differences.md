# Schema Mapping: Actual vs. Documented

## Summary of Changes

Your actual schema differs significantly from the original documentation. This document maps the real collections to their documented counterparts and highlights discrepancies.

---

## Collection Mapping

### 1. FAQs Collection

**Original Doc Name:** `fqa` (note: typo in original)
**Actual Collection Name:** `faqs`

**Original Fields:**
```
- id (integer)
- question (string)
- answer (text)
- category (relation to categories)
- status (string)
- sort (integer)
- created_on (datetime)
```

**Actual Fields:**
```
- id (integer)
- question (string)
- answer (text)
- icon (string) ✨ ADDED
- category (string) ✨ CHANGED: Now a string, not a relation
- status (string: active)
- sort (integer, nullable)
- meta_description (text, nullable) ✨ ADDED
- meta_title (string, nullable) ✨ ADDED
- tl_dr (text, nullable) ✨ ADDED
- faqs (relation, nullable) ✨ ADDED: Self-reference
- tag (string, nullable) ✨ ADDED
- user_created (uuid)
- date_created (datetime)
- user_updated (uuid, nullable)
- date_updated (datetime, nullable)
```

**Key Differences:**
- ✓ Category is now a string value, not a relational field
- ✓ Added icon field for visual representation
- ✓ Added SEO fields (meta_title, meta_description)
- ✓ Changed audit fields (user_created/date_created instead of created_on)
- ✓ Added self-referencing faqs relation
- ✓ Added tl_dr and tag fields

---

### 2. Blogs Collection

**Original Doc Name:** `blogs`
**Actual Collection Name:** `blogs`

**Original Fields:**
```
- id (integer)
- title (string)
- slug (string)
- content (text)
- status (string)
- author (relation to directus_users)
- category (relation to categories)
- created_on (datetime)
- updated_on (datetime)
```

**Actual Fields:**
```
- id (integer)
- name (string) ✨ CHANGED: Was 'title', now 'name'
- slug (string)
- description (string) ✨ ADDED
- content (text)
- status (string: published)
- author (uuid) ✨ CHANGED: Now UUID directly, structured relation
- category (string) ✨ CHANGED: Now a string, not a relation
- meta_description (text, nullable) ✨ ADDED
- meta_title (string, nullable) ✨ ADDED
- views (integer, nullable) ✨ ADDED
- excerpt (text, nullable) ✨ ADDED
- reading_time (string, nullable) ✨ ADDED
- featured (boolean, nullable) ✨ ADDED
- tl_dr (text, nullable) ✨ ADDED
- faqs (relation, nullable) ✨ ADDED
- tag (string, nullable) ✨ ADDED
- files (array of integers) ✨ CHANGED: Array instead of junction collection
- sort (integer, nullable) ✨ ADDED
- user_created (uuid)
- date_created (datetime)
- user_updated (uuid)
- date_updated (datetime)
```

**Key Differences:**
- ✓ Field name changed from 'title' to 'name'
- ✓ Category is now string, not relation
- ✓ Author is UUID, not structured relation
- ✓ Files as array instead of blogs_files junction table
- ✓ Many new fields for metadata and engagement
- ✓ Updated audit field structure

**Migration Note:** The original design had `blogs_files` junction collection - this is now simplified to an array of file IDs.

---

### 3. Categories Collection

**Original Doc Name:** `categories`
**Actual Collection Name:** `categories`

**Original Fields:**
```
- id (integer)
- name (string)
- slug (string)
- description (text)
- status (string)
- sort (integer)
```

**Actual Fields:**
```
- id (integer)
- name (string)
- slug (string)
- type (string) ✨ ADDED
- description (text)
- status (string: published)
- sort (integer, nullable)
- meta_description (text, nullable) ✨ ADDED
- meta_title (string, nullable) ✨ ADDED
- tl_dr (text, nullable) ✨ ADDED
- faqs (relation, nullable) ✨ ADDED
- tag (string, nullable) ✨ ADDED
- user_created (uuid)
- date_created (datetime)
- user_updated (uuid)
- date_updated (datetime)
```

**Key Differences:**
- ✓ Added 'type' field for categorization (e.g., "blog")
- ✓ Added SEO fields
- ✓ Added tl_dr and tag fields
- ✓ Updated audit fields

---

### 4. Services Collection

**Original Doc Name:** `services`
**Actual Collection Name:** `services` (also sometimes called `fields`)

**Original Fields:**
```
- id (integer)
- name (string)
- slug (string)
- description (text)
- price (decimal)
- status (string)
- sort (integer)
```

**Actual Fields:**
```
- id (integer)
- name (string)
- slug (string)
- description (text)
- icon (string) ✨ ADDED
- image (uuid) ✨ ADDED: Relation to directus_files
- content (text, nullable) ✨ ADDED
- type (string) ✨ ADDED
- price (decimal, nullable) ✨ CHANGED: Now nullable
- duration (string, nullable) ✨ ADDED
- featured (boolean, nullable) ✨ ADDED
- status (string: active)
- sort (integer, nullable)
- meta_title (string, nullable) ✨ ADDED
- meta_description (text, nullable) ✨ ADDED
- tl_dr (text, nullable) ✨ ADDED
- faqs (relation, nullable) ✨ ADDED
- tag (string, nullable) ✨ ADDED
- user_created (uuid)
- date_created (datetime)
- user_updated (uuid)
- date_updated (datetime)
```

**Key Differences:**
- ✓ Added icon and image fields
- ✓ Added type, duration, and featured fields
- ✓ Added SEO fields
- ✓ Price is now nullable
- ✓ Updated audit fields

---

### 5. Contact Messages Collection

**Original Doc Name:** `contact_messages`
**Actual Collection Name:** `contact_messages`

**Original Fields:**
```
- id (integer)
- name (string)
- email (string)
- phone (string)
- subject (string)
- message (text)
- status (string)
- assigned_to (relation to directus_users)
- created_on (datetime)
```

**Actual Fields:**
```
- id (integer)
- name (string) ✨ CHANGED: Role changed (was for contact name)
- sender_email (string) ✨ CHANGED: New name
- receiver_email (string) ✨ ADDED
- phone (string)
- category (string) ✨ CHANGED: Was 'subject', now 'category'
- description (text) ✨ CHANGED: Was 'message', now 'description'
- status (string)
- is_read (boolean, nullable) ✨ ADDED
- is_replied (boolean, nullable) ✨ ADDED
- reviewer (uuid, nullable) ✨ CHANGED: Was 'assigned_to'
- related_message (integer, nullable) ✨ ADDED: Self-reference
- ip_address_clients (string, nullable) ✨ ADDED
- owner (uuid, nullable) ✨ ADDED
- files (array) ✨ CHANGED: Array instead of junction collection
- sort (integer, nullable) ✨ ADDED
- user_created (uuid)
- date_created (datetime)
- user_updated (uuid, nullable)
- date_updated (datetime, nullable)
```

**Key Differences:**
- ✓ Field renames: email → sender_email, subject → category, message → description
- ✓ Added receiver_email for two-way communication
- ✓ reviewer replaces assigned_to
- ✓ Added read and reply tracking
- ✓ Added self-referencing for related messages
- ✓ Files as array instead of junction collection

**Migration Note:** The original design had `contact_messages_files` junction collection - now simplified to array.

---

### 6. Notifications Collection

**Original Doc Name:** `notifications`
**Actual Collection Name:** `notifications`

**Original Fields:**
```
- id (integer)
- title (string)
- message (text)
- type (string: info, warning, error, success)
- status (string)
- recipient (relation to directus_users)
- created_on (datetime)
```

**Actual Fields:**
```
- id (integer)
- category (string) ✨ CHANGED: Was 'type', now 'category'
- description (text) ✨ CHANGED: Was 'message', now 'description'
- url (string, nullable) ✨ ADDED
- icon (string, nullable) ✨ ADDED
- is_read (boolean) ✨ ADDED
- read_at (datetime, nullable) ✨ ADDED
- status (string: published)
- sort (integer, nullable) ✨ ADDED
- user_created (uuid)
- date_created (datetime)
- user_updated (uuid, nullable)
- date_updated (datetime, nullable)
```

**Key Differences:**
- ✓ Removed 'title' and 'recipient' fields
- ✓ Changed 'type' to 'category'
- ✓ Added URL and icon fields
- ✓ Added read tracking (is_read, read_at)
- ✓ Removed relation to directus_users
- ✓ Updated audit fields

---

### 7. Reports Collection

**Status:** ⚠️ **NOT FOUND in your data**

The documentation mentions a `reports` collection with a `reports_files` junction collection, but this was not present in your actual data samples. This may be:
- A deprecated collection
- Not yet implemented in your schema
- Optional/unused

---

### 8. About Collection ✨ NEW

**Original Doc Name:** N/A (Not in original documentation)
**Actual Collection Name:** `about`

**Type:** Singleton (only one record)

**Fields:**
```
- id (integer)
- status (string: published)
- vision (text) - Vision statement
- mission (text) - Mission statement
- value (text) - Company values
- about_office (text) - Office description
- experiences (array of strings)
- services (array of strings)
- images (array of integers) - File IDs
- user_created (uuid)
- date_created (datetime)
- user_updated (uuid)
- date_updated (datetime)
```

**Notes:**
- Completely new collection not in original documentation
- Singleton pattern: only one instance
- Uses arrays for multiple items instead of junction collections

---

### 9. Social Links Collection ✨ NEW

**Original Doc Name:** N/A (Not in original documentation)
**Actual Collection Name:** `social_links`

**Fields:**
```
- id (integer)
- name (string) - Platform name (e.g., "facebook")
- url (string) - Profile/page URL
- icon (string) - Icon identifier
- status (string: published)
- sort (integer, nullable)
- user_created (uuid)
- date_created (datetime)
- user_updated (uuid, nullable)
- date_updated (datetime, nullable)
```

**Notes:**
- Completely new collection not in original documentation
- Simple structure for social media integration

---

### 10. Terms and Policies Collection

**Original Doc Name:** `terms_and_policies`
**Actual Collection Name:** `terms_and_policies`

**Type:** Singleton (only one record)

**Original Fields:**
```
- terms_of_service (text)
- privacy_policy (text)
- cookie_policy (text)
- last_updated (datetime)
```

**Actual Fields:**
```
- id (integer)
- terms (text) ✨ CHANGED: 'terms_of_service' → 'terms'
- policy (text) ✨ CHANGED: 'privacy_policy' → 'policy'
- status (string: published) ✨ ADDED
- user_created (uuid) ✨ ADDED
- date_created (datetime) ✨ ADDED
- user_updated (uuid) ✨ ADDED
- date_updated (datetime) ✨ ADDED
```

**Key Differences:**
- ✓ Simplified field names
- ✓ Removed cookie_policy field
- ✓ Removed last_updated (now uses date_updated)
- ✓ Added status and audit fields

---

### 11. Meta Tags Collection

**Status:** ⚠️ **NOT FOUND in your data**

The documentation mentions a `meta_tags` collection, but this was not present in your actual data samples. Instead, meta fields are embedded in individual collections.

---

### 12. Global SEO Collection

**Status:** ⚠️ **NOT FOUND in your data**

The documentation mentions a `global_seo` singleton collection, but this was not present in your actual data samples. SEO configuration appears to be embedded in relevant collections instead.

---

## Pattern Changes

### 1. Junction Collections → Arrays

**Original Pattern:**
```
blogs
├── files → blogs_files (junction)
    └── files_id → directus_files

contact_messages
├── files → contact_messages_files (junction)
    └── files_id → directus_files
```

**New Pattern:**
```
blogs
└── files (array of file IDs)

contact_messages
└── files (array of file IDs)

about
└── images (array of file IDs)
```

**Benefit:** Simpler API queries, fewer database joins

---

### 2. String Categories vs. Relations

**Original Pattern:**
```
blogs
└── category → categories (relation)
    └── category.id (integer)

fqa
└── category → categories (relation)
    └── category.id (integer)
```

**New Pattern:**
```
blogs
└── category (string)

faqs
└── category (string)

categories
└── type (string for differentiation)
```

**Benefit:** Simpler schema, faster queries, doesn't require category to exist

---

### 3. Audit Fields Standardization

**Original Pattern:**
```
created_on (datetime)
updated_on (datetime)
```

**New Pattern:**
```
user_created (uuid) - Who created
date_created (datetime) - When created
user_updated (uuid, nullable) - Who updated
date_updated (datetime, nullable) - When updated
```

**Benefit:** Full audit trail with user attribution

---

### 4. SEO Field Distribution

**Original Pattern:**
```
meta_tags (separate collection)
global_seo (singleton)
```

**New Pattern:**
```
Distributed across collections:
- meta_title
- meta_description
- (in blogs, services, categories, faqs, etc.)
```

**Benefit:** Context-specific SEO data, easier to manage

---

## Status Values Across Collections

| Collection | Status Values |
|---|---|
| **faqs** | active, archived |
| **blogs** | draft, published, archived |
| **categories** | published, archived |
| **services** | active, archived |
| **contact_messages** | published, archived, new, read |
| **notifications** | published, archived |
| **about** | published, archived |
| **social_links** | published, archived |
| **terms_and_policies** | published, archived |

---

## New Across-the-Board Fields

Most collections now include:

1. **SEO Fields:**
   - `meta_title`
   - `meta_description`

2. **Content Fields:**
   - `tl_dr` (Too Long; Didn't Read summary)
   - `tag` (for tagging/classification)

3. **Relations:**
   - `faqs` (where applicable)

4. **Audit Trail:**
   - `user_created` (uuid)
   - `date_created` (datetime)
   - `user_updated` (uuid, nullable)
   - `date_updated` (datetime, nullable)

---

## Collections Removed from Documentation

- `reports` - Not found in your data
- `meta_tags` - Fields distributed to collections
- `global_seo` - Fields not found

## Collections Added to Your System

- `about` - Singleton for about page
- `social_links` - Social media integration
- `fields` (alias) - Sometimes called services

---

## Migration Recommendations

If migrating from the documented schema to your actual schema:

1. **Rename fields carefully:**
   - blogs: `title` → `name`
   - contact_messages: `email` → `sender_email`, `subject` → `category`, `message` → `description`
   - notifications: `message` → `description`, `type` → `category`

2. **Convert junction collections to arrays:**
   - Flatten blogs_files to files array
   - Flatten contact_messages_files to files array

3. **Convert category relations to strings:**
   - Store category names directly instead of IDs

4. **Update audit fields:**
   - Map created_on → date_created
   - Add user_created tracking
   - Map updated_on → date_updated
   - Add user_updated tracking

5. **Add new fields gradually:**
   - meta_title, meta_description
   - tl_dr, tag
   - Other context-specific fields

---

## API Query Impact

### Example: Getting a Published Blog Post

**Old Way (with relations):**
```javascript
GET /items/blogs?filter[status]=published&fields[]=*,author.*,category.*,files.*
```

**New Way (with arrays):**
```javascript
GET /items/blogs?filter[status]=published&fields[]=*,author.*,files.*
// category is now just a string, no expansion needed
```

### Example: Getting FAQs with Categories

**Old Way:**
```javascript
GET /items/faqs?filter[status]=active&fields[]=*,category.*
```

**New Way:**
```javascript
GET /items/faqs?filter[status]=active
// category is now just a string field
```

---

## Validation Checklists

### Before Going Live with New Schema:

- [ ] All strings for categories are consistent
- [ ] File arrays contain valid UUID references
- [ ] All required SEO fields are populated
- [ ] Status values match documented enums
- [ ] Audit fields are properly set
- [ ] Self-referencing relations are set up correctly
- [ ] No orphaned files in file arrays
- [ ] Singletons have exactly one record

