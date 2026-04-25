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
  type Fqa,
  type ContactMessage,
  type Notification,
  type TermsAndPolicies,
  type Category,
} from "@/lib/directus";


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
        readItems("blogs", { sort: ["-date_created"], limit: -1 })
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
function normalizeFaqPayload(input: Partial<Fqa>) {
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
    queryKey: ["fqa"],
    queryFn: async () =>
      (await directus.request(
        readItems("fqa", { sort: ["sort", "-id"], limit: -1 })
      )) as Fqa[],
  });
}

export function useSaveFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Fqa> & { id?: number }) => {
      const { id, ...data } = input;
      const normalized = normalizeFaqPayload(data);
      if (id) return directus.request(updateItem("fqa", id, normalized as never));
      return directus.request(createItem("fqa", normalized as never));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fqa"] }),
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => directus.request(deleteItem("fqa", id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fqa"] }),
  });
}

/* --------------------------- Contact messages ---------------------------- */
export function useContactMessages() {
  return useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () =>
      (await directus.request(
        readItems("contact_messages", {
          sort: ["-date_created"],
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
        readItems("notifications", { sort: ["-date_created"], limit: 20 })
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
