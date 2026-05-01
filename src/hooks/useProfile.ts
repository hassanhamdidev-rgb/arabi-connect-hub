import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DIRECTUS_URL } from "@/lib/directus";
import { getAccessToken, updateStoredUser, type AuthUser } from "@/lib/auth";

const FIELDS =
  "id,email,first_name,last_name,role.name,title,description,avatar,phone,gender,email_notifications,appearance,lang,provider";

async function authFetch(path: string, init: RequestInit = {}) {
  const token = getAccessToken();
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.errors?.[0]?.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export interface ProfileData extends AuthUser {}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<ProfileData> => {
      const json = await authFetch(`/users/me?fields=${FIELDS}`);
      const m = json.data;
      return {
        id: m.id,
        email: m.email,
        first_name: m.first_name,
        last_name: m.last_name,
        role: m.role?.name ?? null,
        title: m.title,
        description: m.description,
        avatar: m.avatar,
        phone: m.phone,
        gender: m.gender,
        email_notifications: m.email_notifications,
        appearance: m.appearance,
        lang: m.lang,
        provider: m.provider,
      };
    },
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<ProfileData>) => {
      const json = await authFetch(`/users/me?fields=${FIELDS}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      return json.data;
    },
    onSuccess: (data) => {
      updateStoredUser({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        title: data.title,
        description: data.description,
        avatar: data.avatar,
        phone: data.phone,
        gender: data.gender,
        email_notifications: data.email_notifications,
      });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (input: { password: string }) => {
      await authFetch(`/users/me`, {
        method: "PATCH",
        body: JSON.stringify({ password: input.password }),
      });
    },
  });
}

export async function uploadAvatar(file: File): Promise<string> {
  const token = getAccessToken();
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${DIRECTUS_URL}/files`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  if (!res.ok) throw new Error("تعذر رفع الصورة");
  const json = await res.json();
  return json.data.id as string;
}
