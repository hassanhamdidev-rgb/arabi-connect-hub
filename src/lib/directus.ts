import {
  createDirectus,
  rest,
  authentication,
  readItems,
  readItem,
  createItem,
  updateItem,
  deleteItem,
  readMe,
  type AuthenticationData,
} from "@directus/sdk";

/**
 * Directus schema
 * Extend these collection types as your Directus collections grow.
 * Keep field names in sync with your Directus admin panel.
 */
export interface Article {
  id: string;
  title: string;
  slug?: string;
  content?: string;
  category?: string;
  status: "draft" | "published" | "archived";
  views?: number;
  date_created?: string;
  date_updated?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  active: boolean;
  sort?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sort?: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  date_created?: string;
}

export interface DirectusSchema {
  articles: Article[];
  services: Service[];
  faq: FAQItem[];
  messages: Message[];
}

/**
 * Directus URL is read from VITE_DIRECTUS_URL.
 * Falls back to localhost for local development.
 */
const DIRECTUS_URL =
  import.meta.env.VITE_DIRECTUS_URL ?? "http://localhost:8055";

/**
 * Singleton Directus client.
 * - `rest()` enables REST transport
 * - `authentication("session", { credentials: "include" })` uses cookie-based
 *   sessions, matching SESSION_COOKIE_* server settings.
 */
export const directus = createDirectus<DirectusSchema>(DIRECTUS_URL)
  .with(
    authentication("session", {
      credentials: "include",
      autoRefresh: true,
    })
  )
  .with(rest({ credentials: "include" }));

/* -------------------------------------------------------------------------- */
/* Auth helpers                                                                */
/* -------------------------------------------------------------------------- */

export async function login(
  email: string,
  password: string
): Promise<AuthenticationData> {
  return directus.login(email, password);
}

export async function logout(): Promise<void> {
  await directus.logout();
}

export async function getCurrentUser() {
  try {
    return await directus.request(
      readMe({ fields: ["id", "email", "first_name", "last_name", "role"] })
    );
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Re-exports for convenience                                                 */
/* -------------------------------------------------------------------------- */

export { readItems, readItem, createItem, updateItem, deleteItem, readMe };
