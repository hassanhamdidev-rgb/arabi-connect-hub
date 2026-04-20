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
      if (id) {
        return await directus.request(updateItem("blogs", id, data as never));
      }
      return await directus.request(createItem("blogs", data as never));
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

/* ------------------------------- Services -------------------------------- */
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
      if (id) return directus.request(updateItem("services", id, data as never));
      return directus.request(createItem("services", data as never));
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
      if (id) return directus.request(updateItem("fqa", id, data as never));
      return directus.request(createItem("fqa", data as never));
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
