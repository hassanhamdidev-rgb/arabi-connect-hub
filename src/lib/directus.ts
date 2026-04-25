import {
  createDirectus,
  rest,
  staticToken,
  readItems,
  readItem,
  readSingleton,
  createItem,
  updateItem,
  updateSingleton,
  deleteItem,
} from "@directus/sdk";

/* -------------------------------------------------------------------------- */
/* Schema — mirrors Directus collections documentation                         */
/* -------------------------------------------------------------------------- */

export type PublishStatus = "published" | "draft";
export type ActivityStatus = "active" | "inactive";
export type MessageStatus = "replied" | "pending" | "new";
export type ReportStatus = "draft" | "reviewed" | "resolved";

export interface Blog {
  id: number;
  status: PublishStatus;
  sort?: number | null;
  user_created: string;
  date_created: string;
  user_updated?: string | null;
  date_updated?: string | null;
  name: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  category: string;
  meta_description?: string | null;
  meta_title?: string | null;
  views?: number | null;
  excerpt?: string | null;
  reading_time?: number | null;
  featured?: boolean | null;
  tl_dr?: string | null;
  faqs?: unknown;
  tag?: string | null;
  files?: (string | number)[] | null;
}

export interface Category {
  id: number;
  status: PublishStatus;
  sort?: number | null;
  name: string;
  type: string;
  description: string;
  tl_dr: string;
  faqs?: unknown;
  tag?: string | null;
}

export interface ContactMessage {
  id: string;
  status: MessageStatus;
  sort?: number | null;
  date_created?: string;
  category: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  is_read: boolean;
  is_replied: boolean;
  reviewer?: string | null;
  related_message?: string | null;
  owner: "client" | "admin";
  ip_address_clients: string;
  files?: (string | number)[] | null;
}

export interface Fqa {
  id: number;
  status: ActivityStatus;
  sort?: number | null;
  question: string;
  answer: string;
  icon: string;
  image?: string | null;
  category: string;
  creator: string;
  meta_title: string;
  meta_description: string;
  tl_dr: string;
  faqs?: unknown;
  tag?: string | null;
}

export interface GlobalSeo {
  id: number;
  status: PublishStatus;
  site_name: string;
  site_url: string;
  default_meta_title: string;
  default_meta_description: string;
  organization_logo: string;
  social_links: { link: string }[];
  contact_email: string;
  founding_date: string;
  phone: string;
}

export interface Notification {
  id: string;
  status: PublishStatus;
  sort?: number | null;
  date_created?: string;
  category: string;
  description: string;
  url: string;
  is_read: boolean;
  icon: string;
  read_at?: string | null;
}

export interface Report {
  id: number;
  status: ReportStatus;
  sort?: number | null;
  date_created?: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  reviewer?: string | null;
  priority?: "low" | "medium" | "high" | "urgent" | null;
  files?: (string | number)[] | null;
}

export interface Service {
  id: number;
  status: ActivityStatus;
  sort?: number | null;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  meta_title: string;
  meta_description: string;
  type: string;
  price: string;
  duration: string;
  featured: string;
  tl_dr: string;
  faqs?: unknown;
  tag?: string | null;
}

export interface TermsAndPolicies {
  id: number;
  status: PublishStatus;
  terms: string;
  policy: string;
}

export interface DirectusSchema {
  blogs: Blog[];
  categories: Category[];
  contact_messages: ContactMessage[];
  fqa: Fqa[];
  global_seo: GlobalSeo;
  notifications: Notification[];
  reports: Report[];
  services: Service[];
  terms_and_policies: TermsAndPolicies;
}

/* -------------------------------------------------------------------------- */
/* Client                                                                      */
/* -------------------------------------------------------------------------- */

export const DIRECTUS_URL =
  import.meta.env.VITE_DIRECTUS_URL ?? "http://localhost:8055";

const DIRECTUS_TOKEN =
  import.meta.env.VITE_DIRECTUS_TOKEN ??
  "EWIUXxRrXZgz2VgpSLXv7-jRdIk2hQNj";

/**
 * Singleton Directus client authenticated with a static Bearer token.
 * The token is sent automatically on every REST request.
 */
export const directus = createDirectus<DirectusSchema>(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest());

/* -------------------------------------------------------------------------- */
/* Asset helper                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Build a full URL to a Directus file/asset by its UUID.
 * Pass `?width=...&height=...&fit=cover` etc. via `params` if needed.
 */
export function assetUrl(
  fileId: string | null | undefined,
  params?: Record<string, string | number>
): string | undefined {
  if (!fileId) return undefined;
  const url = new URL(`${DIRECTUS_URL}/assets/${fileId}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  }
  // Token allows access to private files if needed
  url.searchParams.set("access_token", DIRECTUS_TOKEN);
  return url.toString();
}

/* -------------------------------------------------------------------------- */
/* File Upload Helper                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Upload files to Directus and return their IDs
 */
export async function uploadFiles(files: File[]): Promise<string[]> {
  const fileIds: string[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${DIRECTUS_URL}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${file.name}`);
    }

    const data = await response.json();
    fileIds.push(data.data.id);
  }

  return fileIds;
}

/* -------------------------------------------------------------------------- */
/* Re-exports                                                                  */
/* -------------------------------------------------------------------------- */

export {
  readItems,
  readItem,
  readSingleton,
  createItem,
  updateItem,
  updateSingleton,
  deleteItem,
};
