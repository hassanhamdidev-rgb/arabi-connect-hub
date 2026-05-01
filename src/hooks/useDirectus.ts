import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  directus,
  readItems,
  readSingleton,
  createItem,
  updateItem,
  updateSingleton,
  deleteItem,
  type Blog,
  type Service,
  type Faq,
  type ContactMessage,
  type Notification,
  type TermsAndPolicies,
  type Category,
  type Field,
  type About,
  type SocialLinkRow,
} from "@/lib/directus";

/** Re-export for legacy imports */
export type SocialLink = SocialLinkRow;


/* ------------------------------- Blogs ----------------------------------- */
type BlogFileInput = string | number | { directus_files_id?: string | number };

function normalizeBlogPayload(input: Partial<Blog>) {
  const systemUuidFields = ["user_created", "date_created", "date_updated"];
  const payload: Record<string, unknown> = {};
  const files = input.files as BlogFileInput[] | null | undefined;

  // Copy over fields, excluding system-managed UUID fields
  for (const [key, value] of Object.entries(input)) {
    if (systemUuidFields.includes(key)) continue;
    if (value === "") continue;
    if (value === undefined) continue;
    if (key !== "files") {
      payload[key] = value;
    }
  }

  if (Array.isArray(files) && files.length > 0) {
    const directusFileIds = files
      .map((file) => {
        if (typeof file === "string" || typeof file === "number") return String(file);
        if (file && typeof file === "object" && "directus_files_id" in file) {
          return String(file.directus_files_id ?? "");
        }
        return "";
      })
      .filter(Boolean);

    // For M2M relation (blogs_files), Directus update expects relation commands.
    // Sending UUID array directly makes Directus treat them as junction row IDs.
    payload.files = {
      create: directusFileIds.map((id) => ({ directus_files_id: id })),
    };
  }

  return payload;
}

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () =>
      (await directus.request(
        readItems("blogs", { sort: ["-id"], limit: -1 })
      )) as Blog[],
  });
}

export function useSaveBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Blog> & { id?: number }) => {
      const { id, ...data } = input;
      const normalized = normalizeBlogPayload(data);
      if (id) {
        return await directus.request(updateItem("blogs", id, normalized as never));
      }
      return await directus.request(createItem("blogs", normalized as never));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => directus.request(deleteItem("blogs", id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  });
}

export function useIncrementBlogViews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      // Fetch the current blog to get the old views value
      const blog = (await directus.request(
        readItems("blogs", { filter: { id: { _eq: id } } })
      )) as Blog[];
      
      if (!blog || blog.length === 0) {
        throw new Error("Blog not found");
      }

      const currentViews = blog[0].views || 0;
      const newViews = currentViews + 1;

      // Update the blog with the new views count
      return await directus.request(
        updateItem("blogs", id, { views: newViews } as never)
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  });
}

/* ------------------------------- Services -------------------------------- */
function normalizeServicePayload(input: Partial<Service>) {
  const payload: Record<string, unknown> = {};
  // System-managed UUID fields that should not be sent from client
  const systemUuidFields = ["user_created", "date_created", "date_updated"];
  
  for (const [key, value] of Object.entries(input)) {
    // Skip system-managed UUID fields
    if (systemUuidFields.includes(key)) continue;
    // Skip empty strings (invalid for UUID fields)
    if (value === "") continue;
    // Skip undefined values
    if (value === undefined) continue;
    // Keep all other values including null, 0, false, etc.
    payload[key] = value;
  }
  
  return payload;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () =>
      (await directus.request(
        readItems("services", { sort: ["sort", "-id"], limit: -1 })
      )) as Service[],
  });
}

export function useSaveService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Service> & { id?: number }) => {
      const { id, ...data } = input;
      const normalized = normalizeServicePayload(data);
      if (id) return directus.request(updateItem("services", id, normalized as never));
      return directus.request(createItem("services", normalized as never));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => directus.request(deleteItem("services", id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

/* --------------------------------- FAQ ----------------------------------- */
function normalizeFaqPayload(input: Partial<Faq>) {
  const payload: Record<string, unknown> = {};
  // System-managed UUID fields that should not be sent from client
  const systemUuidFields = ["creator", "user_created", "date_created", "date_updated"];
  
  for (const [key, value] of Object.entries(input)) {
    // Skip system-managed UUID fields
    if (systemUuidFields.includes(key)) continue;
    // Skip empty strings (invalid for UUID fields)
    if (value === "") continue;
    // Skip undefined values
    if (value === undefined) continue;
    // Keep all other values including null, 0, false, etc.
    payload[key] = value;
  }
  
  return payload;
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () =>
      (await directus.request(
        readItems("faqs", { sort: ["sort", "-id"], limit: -1 })
      )) as Faq[],
  });
}

export function useSaveFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Faq> & { id?: number }) => {
      const { id, ...data } = input;
      const normalized = normalizeFaqPayload(data);
      if (id) return directus.request(updateItem("faqs", id, normalized as never));
      return directus.request(createItem("faqs", normalized as never));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => directus.request(deleteItem("faqs", id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

/* --------------------------- Contact messages ---------------------------- */
export function useContactMessages() {
  return useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () =>
      (await directus.request(
        readItems("contact_messages", {
          sort: ["-id"],
          limit: -1,
        })
      )) as ContactMessage[],
  });
}

export function useUpdateMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; data: Partial<ContactMessage> }) =>
      directus.request(updateItem("contact_messages", input.id, input.data as never)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact_messages"] }),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      directus.request(deleteItem("contact_messages", id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact_messages"] }),
  });
}

/* ------------------------------ Notifications ---------------------------- */
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () =>
      (await directus.request(
        readItems("notifications", { sort: ["-id"], limit: 20 })
      )) as Notification[],
  });
}

export function useMarkNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      directus.request(
        updateItem("notifications", id, {
          is_read: true,
          read_at: new Date().toISOString(),
        } as never)
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

/* --------------------------- Terms & policies ---------------------------- */
export function useTerms() {
  return useQuery({
    queryKey: ["terms_and_policies"],
    queryFn: async () =>
      (await directus.request(readSingleton("terms_and_policies"))) as TermsAndPolicies,
  });
}

export function useSaveTerms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<TermsAndPolicies>) =>
      directus.request(updateSingleton("terms_and_policies", data as never)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["terms_and_policies"] }),
  });
}

/* ------------------------------- Categories ------------------------------ */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await directus.request(
        readItems("categories", { sort: ["sort", "-id"], limit: -1 })
      )) as Category[],
  });
}

export function useSaveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Category> & { id?: number }) => {
      const { id, ...data } = input;
      const normalized = normalizeCategoryPayload(data);
      if (id) return directus.request(updateItem("categories", id, normalized as never));
      return directus.request(createItem("categories", normalized as never));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => directus.request(deleteItem("categories", id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

function normalizeCategoryPayload(input: Partial<Category>) {
  const payload: Record<string, unknown> = {};
  const systemUuidFields = ["user_created", "date_created", "date_updated"];
  
  for (const [key, value] of Object.entries(input)) {
    if (systemUuidFields.includes(key)) continue;
    if (value === "") continue;
    if (value === undefined) continue;
    payload[key] = value;
  }
  
  return payload;
}

/* ------------------------------- Social Links ----------------------------- */
function normalizeSocialLinkPayload(input: Partial<SocialLinkRow>) {
  const payload: Record<string, unknown> = {};
  const systemUuidFields = ["user_created", "date_created", "user_updated", "date_updated"];
  for (const [key, value] of Object.entries(input)) {
    if (systemUuidFields.includes(key)) continue;
    if (value === "") continue;
    if (value === undefined) continue;
    payload[key] = value;
  }
  return payload;
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social_links"],
    queryFn: async () =>
      (await directus.request(
        readItems("social_link", { sort: ["sort", "-id"], limit: -1 })
      )) as SocialLinkRow[],
  });
}

export function useSaveSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<SocialLinkRow> & { id?: number }) => {
      const { id, ...data } = input;
      const normalized = normalizeSocialLinkPayload(data);
      if (id) return directus.request(updateItem("social_link", id, normalized as never));
      return directus.request(createItem("social_link", normalized as never));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["social_links"] }),
  });
}

export function useDeleteSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => directus.request(deleteItem("social_link", id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["social_links"] }),
  });
}

/* ---------------------------------- Fields -------------------------------- */
function normalizeFieldPayload(input: Partial<Field>) {
  const payload: Record<string, unknown> = {};
  const systemUuidFields = ["user_created", "date_created", "user_updated", "date_updated"];
  for (const [key, value] of Object.entries(input)) {
    if (systemUuidFields.includes(key)) continue;
    if (value === "") continue;
    if (value === undefined) continue;
    payload[key] = value;
  }
  return payload;
}

export function useFields() {
  return useQuery({
    queryKey: ["fields"],
    queryFn: async () =>
      (await directus.request(
        readItems("fields", { sort: ["sort", "-id"], limit: -1 })
      )) as Field[],
  });
}

export function useSaveField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Field> & { id?: number }) => {
      const { id, ...data } = input;
      const normalized = normalizeFieldPayload(data);
      if (id) return directus.request(updateItem("fields", id, normalized as never));
      return directus.request(createItem("fields", normalized as never));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fields"] }),
  });
}

export function useDeleteField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => directus.request(deleteItem("fields", id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fields"] }),
  });
}

/* ---------------------------------- About --------------------------------- */
type AboutImageInput = string | number | { directus_files_id?: string | number };

function normalizeAboutPayload(input: Partial<About>) {
  const payload: Record<string, unknown> = {};
  const systemUuidFields = ["user_created", "date_created", "user_updated", "date_updated", "id"];
  const images = input.images as AboutImageInput[] | null | undefined;

  // Copy over fields, excluding system-managed UUID fields
  for (const [key, value] of Object.entries(input)) {
    if (systemUuidFields.includes(key)) continue;
    if (value === undefined) continue;
    if (key !== "images") {
      payload[key] = value;
    }
  }

  // Handle images M2M relationship
  if (Array.isArray(images) && images.length > 0) {
    const directusFileIds = images
      .map((img) => {
        if (typeof img === "string" || typeof img === "number") return String(img);
        if (img && typeof img === "object" && "directus_files_id" in img) {
          return String(img.directus_files_id ?? "");
        }
        return "";
      })
      .filter(Boolean);

    // For M2M relation, Directus expects relation commands
    payload.images = {
      create: directusFileIds.map((id) => ({ directus_files_id: id })),
    };
  } else {
    // Clear images if empty array
    payload.images = { create: [] };
  }

  return payload;
}

export function useAbout() {
  return useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      try {
        return (await directus.request(readSingleton("about"))) as About;
      } catch (e) {
        // If the singleton isn't configured, fall back to first item
        const list = (await directus.request(
          readItems("about" as never, { limit: 1 } as never)
        )) as About[];
        return (list?.[0] ?? null) as About | null;
      }
    },
  });
}

export function useSaveAbout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<About>) => {
      const normalized = normalizeAboutPayload(data);
      return directus.request(updateSingleton("about", normalized as never));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["about"] }),
  });
}

/* ----------------------- Pagination & Filtering ----------------------- */

export interface PaginationParams {
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
  status?: string;
  type?: string;
}

/**
 * Paginated blogs with optional filtering
 */
export function useBlogsPaginated(params?: PaginationParams) {
  const limit = params?.limit ?? 10;
  const offset = params?.offset ?? 0;
  const filters: Record<string, unknown> = {};

  if (params?.search) {
    filters["_or"] = [
      { name: { _contains: params.search } },
      { description: { _contains: params.search } },
    ];
  }
  if (params?.category) filters["category"] = { _eq: params.category };
  if (params?.status) filters["status"] = { _eq: params.status };

  return useQuery({
    queryKey: ["blogs-paginated", limit, offset, params?.search, params?.category, params?.status],
    queryFn: async () =>
      (await directus.request(
        readItems("blogs", {
          sort: ["-id"],
          limit,
          offset,
          ...(Object.keys(filters).length > 0 && { filter: filters }),
        })
      )) as Blog[],
  });
}

/**
 * Paginated FAQs with optional filtering
 */
export function useFaqsPaginated(params?: PaginationParams) {
  const limit = params?.limit ?? 10;
  const offset = params?.offset ?? 0;
  const filters: Record<string, unknown> = {};

  if (params?.search) {
    filters["_or"] = [
      { question: { _contains: params.search } },
      { answer: { _contains: params.search } },
    ];
  }
  if (params?.category) filters["category"] = { _eq: params.category };

  return useQuery({
    queryKey: ["faqs-paginated", limit, offset, params?.search, params?.category],
    queryFn: async () =>
      (await directus.request(
        readItems("faqs", {
          sort: ["-id"],
          limit,
          offset,
          ...(Object.keys(filters).length > 0 && { filter: filters }),
        })
      )) as Faq[],
  });
}

/**
 * Paginated services with optional filtering
 */
export function useServicesPaginated(params?: PaginationParams) {
  const limit = params?.limit ?? 10;
  const offset = params?.offset ?? 0;
  const filters: Record<string, unknown> = {};

  if (params?.search) {
    filters["_or"] = [
      { name: { _contains: params.search } },
      { description: { _contains: params.search } },
    ];
  }
  if (params?.category) filters["category"] = { _eq: params.category };
  if (params?.status) filters["status"] = { _eq: params.status };

  return useQuery({
    queryKey: ["services-paginated", limit, offset, params?.search, params?.category, params?.status],
    queryFn: async () =>
      (await directus.request(
        readItems("services", {
          sort: ["-id"],
          limit,
          offset,
          ...(Object.keys(filters).length > 0 && { filter: filters }),
        })
      )) as Service[],
  });
}

/**
 * Paginated categories with optional filtering
 */
export function useCategoriesPaginated(params?: PaginationParams) {
  const limit = params?.limit ?? 10;
  const offset = params?.offset ?? 0;
  const filters: Record<string, unknown> = {};

  if (params?.search) {
    filters["_or"] = [
      { name: { _contains: params.search } },
      { description: { _contains: params.search } },
    ];
  }
  if (params?.type) filters["type"] = { _eq: params.type };

  return useQuery({
    queryKey: ["categories-paginated", limit, offset, params?.search, params?.type],
    queryFn: async () =>
      (await directus.request(
        readItems("categories", {
          sort: ["-id"],
          limit,
          offset,
          ...(Object.keys(filters).length > 0 && { filter: filters }),
        })
      )) as Category[],
  });
}

/**
 * Paginated contact messages with optional filtering
 */
export function useContactMessagesPaginated(params?: PaginationParams) {
  const limit = params?.limit ?? 10;
  const offset = params?.offset ?? 0;
  const filters: Record<string, unknown> = {};

  if (params?.search) {
    filters["_or"] = [
      { name: { _contains: params.search } },
      { email: { _contains: params.search } },
      { message: { _contains: params.search } },
    ];
  }
  if (params?.status) filters["status"] = { _eq: params.status };

  return useQuery({
    queryKey: ["messages-paginated", limit, offset, params?.search, params?.status],
    queryFn: async () =>
      (await directus.request(
        readItems("contact_messages", {
          sort: ["-id"],
          limit,
          offset,
          ...(Object.keys(filters).length > 0 && { filter: filters }),
        })
      )) as ContactMessage[],
  });
}

/* ====================================================================== */
/* Public list hooks (server-side filtering + pagination + count)         */
/* ====================================================================== */

import { aggregate } from "@directus/sdk";

export interface PublicListParams {
  limit?: number;
  offset?: number;
  type?: string;       // service.type / field.type filter (e.g. individual|business)
  category?: string;   // blog category / faq category
  search?: string;
}

/* ---------- Blogs (public, published) ---------- */
export function useBlogsList(params?: PublicListParams) {
  const limit = params?.limit ?? 9;
  const offset = params?.offset ?? 0;

  const filter: Record<string, unknown> = { status: { _eq: "published" } };
  if (params?.category) filter.category = { _eq: params.category };
  if (params?.search) {
    filter._or = [
      { name: { _icontains: params.search } },
      { description: { _icontains: params.search } },
      { excerpt: { _icontains: params.search } },
    ];
  }

  return useQuery({
    queryKey: ["blogs-list", limit, offset, params?.category ?? null, params?.search ?? null],
    queryFn: async () =>
      (await directus.request(
        readItems("blogs", {
          filter,
          sort: ["-date_created", "-id"],
          limit,
          offset,
        })
      )) as Blog[],
  });
}

export function useBlogsCount(params?: Pick<PublicListParams, "category" | "search">) {
  const filter: Record<string, unknown> = { status: { _eq: "published" } };
  if (params?.category) filter.category = { _eq: params.category };
  if (params?.search) {
    filter._or = [
      { name: { _icontains: params.search } },
      { description: { _icontains: params.search } },
      { excerpt: { _icontains: params.search } },
    ];
  }
  return useQuery({
    queryKey: ["blogs-count", params?.category ?? null, params?.search ?? null],
    queryFn: async () => {
      const res = (await directus.request(
        aggregate("blogs", { aggregate: { count: "*" }, query: { filter } })
      )) as Array<{ count: string | number }>;
      return Number(res?.[0]?.count ?? 0);
    },
  });
}

export function useBlogBySlug(slug?: string) {
  return useQuery({
    enabled: !!slug,
    queryKey: ["blog-by-slug", slug],
    queryFn: async () => {
      const items = (await directus.request(
        readItems("blogs", {
          filter: { _and: [{ slug: { _eq: slug } }, { status: { _eq: "published" } }] },
          limit: 1,
        })
      )) as Blog[];
      return items[0] ?? null;
    },
  });
}

export function useRelatedBlogs(currentId?: number, limit = 5) {
  return useQuery({
    enabled: !!currentId,
    queryKey: ["blogs-related", currentId, limit],
    queryFn: async () =>
      (await directus.request(
        readItems("blogs", {
          filter: { _and: [{ status: { _eq: "published" } }, { id: { _neq: currentId } }] },
          sort: ["-date_created", "-id"],
          limit,
        })
      )) as Blog[],
  });
}

/* ---------- Services (public, active) ---------- */
export function useServicesList(params?: PublicListParams) {
  const limit = params?.limit ?? 9;
  const offset = params?.offset ?? 0;

  const filter: Record<string, unknown> = { status: { _eq: "active" } };
  if (params?.type) filter.type = { _eq: params.type };
  if (params?.search) {
    filter._or = [
      { name: { _icontains: params.search } },
      { description: { _icontains: params.search } },
    ];
  }

  return useQuery({
    queryKey: ["services-list", limit, offset, params?.type ?? null, params?.search ?? null],
    queryFn: async () =>
      (await directus.request(
        readItems("services", {
          filter,
          sort: ["sort", "-id"],
          limit,
          offset,
        })
      )) as Service[],
  });
}

export function useServicesCount(params?: Pick<PublicListParams, "type" | "search">) {
  const filter: Record<string, unknown> = { status: { _eq: "active" } };
  if (params?.type) filter.type = { _eq: params.type };
  if (params?.search) {
    filter._or = [
      { name: { _icontains: params.search } },
      { description: { _icontains: params.search } },
    ];
  }
  return useQuery({
    queryKey: ["services-count", params?.type ?? null, params?.search ?? null],
    queryFn: async () => {
      const res = (await directus.request(
        aggregate("services", { aggregate: { count: "*" }, query: { filter } })
      )) as Array<{ count: string | number }>;
      return Number(res?.[0]?.count ?? 0);
    },
  });
}

export function useServiceBySlug(slug?: string) {
  return useQuery({
    enabled: !!slug,
    queryKey: ["service-by-slug", slug],
    queryFn: async () => {
      const items = (await directus.request(
        readItems("services", {
          filter: { _and: [{ slug: { _eq: slug } }, { status: { _eq: "active" } }] },
          limit: 1,
        })
      )) as Service[];
      return items[0] ?? null;
    },
  });
}

export function useRelatedServices(currentId?: number, type?: string, limit = 3) {
  return useQuery({
    enabled: !!currentId,
    queryKey: ["services-related", currentId, type ?? null, limit],
    queryFn: async () => {
      const filter: Record<string, unknown> = {
        _and: [{ status: { _eq: "active" } }, { id: { _neq: currentId } }],
      };
      if (type) (filter._and as unknown[]).push({ type: { _eq: type } });
      return (await directus.request(
        readItems("services", { filter, sort: ["sort", "-id"], limit })
      )) as Service[];
    },
  });
}

/* ---------- Fields (public, published) ---------- */
export function useFieldsList(params?: PublicListParams) {
  const limit = params?.limit ?? 9;
  const offset = params?.offset ?? 0;

  const filter: Record<string, unknown> = { status: { _eq: "published" } };
  if (params?.type) filter.type = { _eq: params.type };
  if (params?.search) {
    filter._or = [
      { name: { _icontains: params.search } },
      { description: { _icontains: params.search } },
    ];
  }

  return useQuery({
    queryKey: ["fields-list", limit, offset, params?.type ?? null, params?.search ?? null],
    queryFn: async () =>
      (await directus.request(
        readItems("fields", {
          filter,
          sort: ["sort", "-id"],
          limit,
          offset,
        })
      )) as Field[],
  });
}

export function useFieldsCount(params?: Pick<PublicListParams, "type" | "search">) {
  const filter: Record<string, unknown> = { status: { _eq: "published" } };
  if (params?.type) filter.type = { _eq: params.type };
  if (params?.search) {
    filter._or = [
      { name: { _icontains: params.search } },
      { description: { _icontains: params.search } },
    ];
  }
  return useQuery({
    queryKey: ["fields-count", params?.type ?? null, params?.search ?? null],
    queryFn: async () => {
      const res = (await directus.request(
        aggregate("fields", { aggregate: { count: "*" }, query: { filter } })
      )) as Array<{ count: string | number }>;
      return Number(res?.[0]?.count ?? 0);
    },
  });
}

export function useFieldById(id?: string | number) {
  return useQuery({
    enabled: id !== undefined && id !== null && id !== "",
    queryKey: ["field-by-id", id],
    queryFn: async () => {
      const items = (await directus.request(
        readItems("fields", {
          filter: { _and: [{ id: { _eq: id } }, { status: { _eq: "published" } }] },
          limit: 1,
        })
      )) as Field[];
      return items[0] ?? null;
    },
  });
}

export function useRelatedFields(currentId?: number, limit = 3) {
  return useQuery({
    enabled: !!currentId,
    queryKey: ["fields-related", currentId, limit],
    queryFn: async () =>
      (await directus.request(
        readItems("fields", {
          filter: { _and: [{ status: { _eq: "published" } }, { id: { _neq: currentId } }] },
          sort: ["sort", "-id"],
          limit,
        })
      )) as Field[],
  });
}

/* ---------- FAQs (public, active) ---------- */
export function useFaqsList(params?: PublicListParams) {
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;
  const filter: Record<string, unknown> = { status: { _eq: "active" } };
  if (params?.category) filter.category = { _eq: params.category };

  return useQuery({
    queryKey: ["faqs-list", limit, offset, params?.category ?? null],
    queryFn: async () =>
      (await directus.request(
        readItems("faqs", { filter, sort: ["sort", "-id"], limit, offset })
      )) as Faq[],
  });
}
