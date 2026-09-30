import { wedding } from "@/content/wedding";

export type FormStatus = "idle" | "submitting" | "success" | "error";

export type RsvpPayload = {
  type: "rsvp";
  name: string;
  phone: string;
  attendance: string;
  guests: string;
  children: string;
  notes: string;
};

export type WishPayload = {
  type: "wish";
  name: string;
  wish: string;
};

export type FormPayload = RsvpPayload | WishPayload;

export function formsConfigured(): boolean {
  return Boolean(wedding.forms.endpoint.trim() && wedding.forms.secret.trim());
}

/**
 * POST JSON as text/plain to avoid CORS preflight issues with Apps Script.
 */
export async function submitToSheet(payload: FormPayload): Promise<void> {
  const endpoint = wedding.forms.endpoint.trim();
  const secret = wedding.forms.secret.trim();

  if (!endpoint || !secret) {
    throw new Error("forms_not_configured");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({ ...payload, secret }),
  });

  // Apps Script sometimes returns 200 with an error body after redirects
  let data: { ok?: boolean; error?: string } = {};
  try {
    data = (await res.json()) as { ok?: boolean; error?: string };
  } catch {
    /* empty / non-JSON */
  }

  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `http_${res.status}`);
  }
}
