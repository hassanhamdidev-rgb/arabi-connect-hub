# Directus SDK - User Creation Complete Guide

## 📦 Installation

```bash
# Install Directus SDK
npm install @directus/sdk

# Install required dependencies
npm install @tanstack/react-query sonner
```

---

## 🚀 Quick Start Examples

### Example 1: Create User in React Component

```typescript
import { useSaveUser } from "@/hooks/useUsers";

function CreateUserForm() {
  const saveMutation = useSaveUser();

  const handleSubmit = async (formData) => {
    saveMutation.mutate({
      data: {
        first_name: "أحمد",
        last_name: "محمد",
        email: "ahmed@example.com",
        password: "SecurePassword123!",
        phone: "+966501234567",
        title: "مدير المحتوى",
        role: "13f07e3a-4ad8-40bb-92f2-1118cb9a1636",
        status: "active",
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={saveMutation.isPending}>
        {saveMutation.isPending ? "جاري..." : "إنشاء"}
      </button>
    </form>
  );
}
```

### Example 2: Create User Directly (No React)

```typescript
import { createUserDirectly } from "@/hooks/useUsers";

// Create single user
async function createNewUser() {
  try {
    const user = await createUserDirectly({
      email: "newuser@example.com",
      password: "SecurePassword123!",
      first_name: "محمد",
      last_name: "أحمد",
      role: "user-role-uuid",
      status: "active",
    });

    console.log("User created:", user);
    return user;
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

### Example 3: Create Multiple Users

```typescript
import { createUsersInBatch } from "@/hooks/useUsers";

async function createMultipleUsers() {
  const newUsers = [
    {
      email: "user1@example.com",
      password: "Password123!",
      first_name: "علي",
      last_name: "محمد",
      role: "user-role-uuid",
    },
    {
      email: "user2@example.com",
      password: "Password456!",
      first_name: "فاطمة",
      last_name: "علي",
      role: "user-role-uuid",
    },
  ];

  try {
    const created = await createUsersInBatch(newUsers);
    console.log("Created users:", created);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

## 📋 Complete Usage Examples

### Example 4: Full Form with All Fields

```typescript
import { useSaveUser } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function CompleteUserForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    title: "",
    description: "",
    role: "user-role-uuid",
    status: "active",
    email_notifications: true,
  });

  const saveMutation = useSaveUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    saveMutation.mutate(
      {
        data: {
          ...formData,
          manager_permessions: {
            is_read_services: false,
            is_add_services: false,
            // ... all permissions
          },
        },
      },
      {
        onSuccess: () => {
          // Reset form
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            phone: "",
            title: "",
            description: "",
            role: "user-role-uuid",
            status: "active",
            email_notifications: true,
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>الاسم الأول</label>
          <Input
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
          />
        </div>

        <div>
          <label>الاسم الأخير</label>
          <Input
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <label>البريد الإلكتروني *</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label>كلمة المرور *</label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label>رقم الهاتف</label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
        />
      </div>

      <div>
        <label>المسمى الوظيفي</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <Button
        type="submit"
        disabled={saveMutation.isPending}
        className="w-full"
      >
        {saveMutation.isPending ? "جاري الإنشاء..." : "إنشاء المستخدم"}
      </Button>
    </form>
  );
}
```

### Example 5: Get User by Email

```typescript
import { getUserByEmail } from "@/hooks/useUsers";

async function findUserByEmail() {
  try {
    const user = await getUserByEmail("user@example.com");
    console.log("Found user:", user);
    return user;
  } catch (error) {
    console.error("User not found:", error);
  }
}
```

### Example 6: Search Users

```typescript
import { searchUsers } from "@/hooks/useUsers";

async function findUsers() {
  try {
    const results = await searchUsers("أحمد");
    console.log("Search results:", results);
    return results;
  } catch (error) {
    console.error("Search error:", error);
  }
}
```

### Example 7: Using useUsers Hook

```typescript
import { useUsers } from "@/hooks/useUsers";

function UsersList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>
          {user.first_name} {user.last_name} ({user.email})
        </li>
      ))}
    </ul>
  );
}
```

### Example 8: Update User

```typescript
import { useSaveUser } from "@/hooks/useUsers";

function UpdateUserForm({ user }) {
  const saveMutation = useSaveUser();

  const handleUpdate = () => {
    saveMutation.mutate({
      user, // Pass the existing user
      data: {
        title: "مدير جديد",
        phone: "+966551234567",
      },
    });
  };

  return <button onClick={handleUpdate}>تحديث</button>;
}
```

### Example 9: Delete User

```typescript
import { useDeleteUser } from "@/hooks/useUsers";

function DeleteUserButton({ userId }) {
  const deleteMutation = useDeleteUser();

  const handleDelete = () => {
    if (confirm("هل أنت متأكد؟")) {
      deleteMutation.mutate(userId);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
      className="text-red-600"
    >
      حذف
    </button>
  );
}
```

---

## 🔧 SDK Configuration

### Setup in main.ts or App.tsx

```typescript
import { createClient } from "@directus/sdk";

export const directus = createClient({
  url: import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055",
  token: localStorage.getItem("directus_token") || undefined,
});

// After login, save token
async function loginUser() {
  const token = await authenticate();
  localStorage.setItem("directus_token", token);
  
  // Update SDK with new token
  directus.setToken(token);
}
```

### Environment Variables

```bash
# .env
VITE_DIRECTUS_URL=http://localhost:8055
VITE_DIRECTUS_TOKEN=your_token_here
```

---

## 📊 API Request/Response Examples

### Create User Request

```bash
POST /items/users
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "first_name": "أحمد",
  "last_name": "محمد",
  "email": "ahmed@example.com",
  "password": "SecurePassword123!",
  "phone": "+966501234567",
  "title": "مدير المحتوى",
  "role": "13f07e3a-4ad8-40bb-92f2-1118cb9a1636",
  "status": "active",
  "email_notifications": true,
  "manager_permessions": {
    "is_read_services": true,
    "is_add_services": true,
    "is_update_services": true,
    "is_delete_services": true,
    ...
  }
}
```

### Create User Response

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "أحمد",
    "last_name": "محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "title": "مدير المحتوى",
    "role": "13f07e3a-4ad8-40bb-92f2-1118cb9a1636",
    "status": "active",
    "email_notifications": true,
    "date_created": "2024-01-15T10:00:00.000Z",
    "date_updated": "2024-01-15T10:00:00.000Z"
  }
}
```

---

## 🛡️ Error Handling

### Common Errors and Solutions

```typescript
try {
  const user = await createUserDirectly({
    email: "test@example.com",
    password: "pass",
    role: "role-uuid",
  });
} catch (error) {
  // Error: البريد الإلكتروني موجود بالفعل
  if (error.message.includes("UNIQUE violation")) {
    console.error("Email already exists");
  }

  // Error: ليس لديك صلاحية
  if (error.message.includes("permission")) {
    console.error("You don't have permission");
  }

  // Error: مجموعة غير موجودة
  if (error.message.includes("collection")) {
    console.error("Users collection not found");
  }
}
```

---

## 📋 Validation Examples

### Client-Side Validation

```typescript
function validateUserData(data: Partial<AppUser>): string[] {
  const errors: string[] = [];

  if (!data.email) errors.push("البريد الإلكتروني مطلوب");
  if (!data.password) errors.push("كلمة المرور مطلوبة");
  if (!data.role) errors.push("الدور مطلوب");

  if (data.email && !data.email.includes("@")) {
    errors.push("البريد الإلكتروني غير صحيح");
  }

  if (data.password && data.password.length < 8) {
    errors.push("كلمة المرور قصيرة جداً (8 أحرف على الأقل)");
  }

  if (data.phone && data.phone.length < 10) {
    errors.push("رقم الهاتف غير صحيح");
  }

  return errors;
}

// Usage
const errors = validateUserData(formData);
if (errors.length > 0) {
  errors.forEach((error) => toast.error(error));
  return;
}

saveMutation.mutate({ data: formData });
```

---

## 🔄 Advanced: Batch Operations

### Create Multiple Users with Error Handling

```typescript
async function createUsersWithErrorHandling(
  users: Partial<AppUser>[]
) {
  const results = {
    success: [] as AppUser[],
    errors: [] as { email: string; error: string }[],
  };

  for (const user of users) {
    try {
      const created = await createUserDirectly(user);
      results.success.push(created);
      toast.success(`تم إنشاء ${created.email}`);
    } catch (error) {
      results.errors.push({
        email: user.email || "Unknown",
        error: error instanceof Error ? error.message : String(error),
      });
      toast.error(`فشل إنشاء ${user.email}`);
    }
  }

  return results;
}
```

---

## 🧪 Testing Examples

### Test Creating a User

```typescript
import { describe, it, expect } from "vitest";
import { createUserDirectly } from "@/hooks/useUsers";

describe("User Creation", () => {
  it("should create a user", async () => {
    const user = await createUserDirectly({
      email: "test@example.com",
      password: "TestPassword123!",
      first_name: "Test",
      last_name: "User",
      role: "user-role-uuid",
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("test@example.com");
  });

  it("should fail with missing email", async () => {
    expect(
      createUserDirectly({
        password: "password",
        role: "role-uuid",
      })
    ).rejects.toThrow("البريد الإلكتروني مطلوب");
  });
});
```

---

## 📚 SDK Query Methods Reference

```typescript
// Read Operations
import {
  readItems,      // Get multiple items with filters
  readItem,       // Get single item by ID
  readSingleton,  // Get singleton collection
  readAssets,     // Get files/assets
} from "@directus/sdk";

// Write Operations
import {
  createItem,     // Create single item
  createItems,    // Create multiple items
  updateItem,     // Update single item
  updateItems,    // Update multiple items
  deleteItem,     // Delete single item
  deleteItems,    // Delete multiple items
} from "@directus/sdk";

// Query Builders
import {
  query,          // Build custom query
  field,          // Select specific fields
  aggregate,      // Aggregate functions
  sort,           // Sort results
  limit,          // Limit results
  offset,         // Offset results
  filter,         // Filter results
} from "@directus/sdk";
```

---

## 🚀 Performance Tips

### Optimize Queries

```typescript
// ❌ Don't fetch all fields
readItems("users", { limit: -1 });

// ✅ Fetch only needed fields
readItems("users", {
  limit: -1,
  fields: [
    "id",
    "email",
    "first_name",
    "last_name",
    "status",
  ],
});
```

### Cache Results

```typescript
// ✅ React Query automatically caches
const { data } = useUsers();

// Refetch manually if needed
queryClient.invalidateQueries({ queryKey: ["users"] });
```

### Batch Operations

```typescript
// ❌ Creates N requests
users.forEach(async (user) => {
  await createUserDirectly(user);
});

// ✅ Single request
await createUsersInBatch(users);
```

---

## 📞 Common Tasks

### Task 1: Create Admin User

```typescript
const admin = await createUserDirectly({
  email: "admin@example.com",
  password: "AdminPassword123!",
  first_name: "مسؤول",
  role: "admin-role-uuid",
  status: "active",
  manager_permessions: {
    // All permissions true
    is_read_services: true,
    is_add_services: true,
    // ... all set to true
  },
});
```

### Task 2: Invite User

```typescript
async function inviteUser(email: string) {
  // Create with temporary password
  const tempPassword = Math.random().toString(36).slice(-8);

  const user = await createUserDirectly({
    email,
    password: tempPassword,
    status: "inactive", // Until they accept
  });

  // Send email with reset link
  // (implement email service)
  
  return user;
}
```

### Task 3: Import Users from CSV

```typescript
import Papa from "papaparse";

async function importUsersFromCSV(file: File) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const users = await createUsersInBatch(results.data);
          resolve(users);
        } catch (error) {
          reject(error);
        }
      },
    });
  });
}
```

---

## ✅ Production Checklist

- [ ] Set up environment variables
- [ ] Configure Directus SDK
- [ ] Test user creation
- [ ] Implement error handling
- [ ] Add validation
- [ ] Set up permissions in Directus
- [ ] Test batch operations
- [ ] Implement logging
- [ ] Add rate limiting
- [ ] Set up email notifications

---

**Status**: ✅ COMPLETE & READY TO USE
