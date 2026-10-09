import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { DOCTORS } from "@/data/doctors";
import type { Database } from "@/integrations/supabase/types";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

const SYSTEM_PROMPT = `You are Aira, the AI health assistant for Apoinmate, a doctor discovery and appointment platform serving India.

Help with general health education, appropriate specialties, how Apoinmate works, and how to find and book care. Use simple English; reply in the user's language when it is English, Hindi, or Hinglish.

Safety:
- Never diagnose, prescribe medicines or dosages, or claim to replace a clinician. Encourage professional care for personal medical concerns.
- For chest pain, severe breathing difficulty, stroke signs, severe bleeding, unconsciousness, suicidal thoughts, or a severe child injury, advise immediate emergency care.
- Do not ask for names, phone numbers, addresses, or other identifying details.

Apoinmate facts:
- Users can search and compare doctors on Find Doctors and complete booking through the doctor booking page.
- Do not claim to see a user's appointment or account data. Direct booking-status questions to the user's signed-in dashboard.
- Do not claim that a booking, payment, appointment availability, or confirmation exists. The chat cannot check availability or create/confirm bookings; direct users to the booking flow.
- Use only doctor details in the supplied directory context. Never invent doctors, clinics, qualifications, fees, locations, ratings, or availability. If directory data is unavailable or no match is present, say that you cannot verify a matching doctor and direct the user to Find Doctors.

Scope:
- Only answer health, care navigation, or Apoinmate questions. For unrelated requests, briefly say you can only help with health questions and using Apoinmate.`;

type AiraFailureCode =
  | "missing_config"
  | "provider_auth"
  | "quota"
  | "rate_limit"
  | "invalid_model"
  | "timeout"
  | "network"
  | "invalid_response"
  | "provider_error";

type AiraResult = { ok: true; reply: string } | { ok: false; code: AiraFailureCode; reply: string };

function publicSupabaseFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

function failure(code: AiraFailureCode): AiraResult {
  const replyByCode: Record<AiraFailureCode, string> = {
    missing_config:
      "Aira is not configured on this server. Please ask the site administrator to configure the server-side LOVABLE_API_KEY.",
    provider_auth:
      "Aira could not authenticate with its AI service. Please ask the site administrator to check the server-side LOVABLE_API_KEY.",
    quota:
      "Aira has reached its AI service usage limit. Please try again later or use Find Doctors.",
    rate_limit: "Aira is receiving too many requests right now. Please wait a moment and retry.",
    invalid_model:
      "Aira's configured AI model is unavailable. Please ask the site administrator to check the model configuration.",
    timeout: "Aira's response took too long. Please try again.",
    network: "Aira couldn't reach its AI service. Check your connection and retry.",
    invalid_response: "Aira received an unreadable response. Please try again.",
    provider_error: "Aira couldn't respond just now. Please try again or use Find Doctors.",
  };
  return { ok: false, code, reply: replyByCode[code] };
}

function redactContactDetails(text: string) {
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[email removed]")
    .replace(/(?<!\w)(?:\+?91[\s-]?)?[6-9]\d(?:[\s-]?\d){8}(?!\w)/g, "[phone removed]");
}

async function getDoctorDirectoryContext() {
  const catalogue = DOCTORS.map((doctor) => ({
    name: doctor.name,
    specialty: doctor.specialty,
    qualification: doctor.qualification,
    experience_years: doctor.experience,
    clinic: doctor.clinic,
    city: doctor.city,
    area: doctor.area,
    fee: doctor.fee,
    languages: doctor.languages.join(", "),
    source: "application catalogue",
  }));
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    console.error("Aira doctor directory unavailable: Supabase server configuration is missing");
    return JSON.stringify({
      note: "Live listings could not be checked; these catalogue entries do not confirm availability.",
      doctors: catalogue,
    });
  }

  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: publicSupabaseFetch(key) },
  });
  const { data, error } = await client
    .from("doctor_listings")
    .select("name,specialty,qualification,experience_years,clinic,city,area,fee,languages")
    .eq("is_active", true)
    .order("name", { ascending: true })
    .limit(40);

  if (error) {
    console.error("Aira doctor directory query failed", { code: error.code });
    return JSON.stringify({
      note: "Live listings could not be checked; these catalogue entries do not confirm availability.",
      doctors: catalogue,
    });
  }
  const registered = (data ?? []).map((doctor) => ({
    name: doctor.name,
    specialty: doctor.specialty,
    qualification: doctor.qualification,
    experience_years: doctor.experience_years,
    clinic: doctor.clinic,
    city: doctor.city,
    area: doctor.area,
    fee: doctor.fee,
    languages: doctor.languages,
    source: "active registered listing",
  }));
  const byNameAndCity = new Map(
    [...catalogue, ...registered].map((doctor) => [
      `${doctor.name.toLocaleLowerCase()}|${doctor.city?.toLocaleLowerCase() ?? ""}`,
      doctor,
    ]),
  );
  return JSON.stringify({
    note: "Doctor records do not confirm appointment availability.",
    doctors: [...byNameAndCity.values()],
  });
}

function getTextContent(content: unknown): string | null {
  if (typeof content === "string") return content.trim() || null;
  if (!Array.isArray(content)) return null;
  const text = content
    .map((part) => {
      if (typeof part === "string") return part;
      if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
        return part.text;
      }
      return "";
    })
    .join("")
    .trim();
  return text || null;
}

export const askAira = createServerFn({ method: "POST" })
  .validator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<AiraResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      console.error("Aira request rejected: LOVABLE_API_KEY is not configured");
      return failure("missing_config");
    }

    let directoryContext = "Directory lookup is in progress.";
    try {
      directoryContext = await getDoctorDirectoryContext();
    } catch (error) {
      console.error("Aira doctor directory request failed", {
        error: error instanceof Error ? error.name : "UnknownError",
      });
      directoryContext = "Directory lookup failed. Do not name or describe any doctor.";
    }

    const messages = data.messages.map((message) => ({
      role: message.role,
      content: message.role === "user" ? redactContactDetails(message.content) : message.content,
    }));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.8-flash",
          messages: [
            {
              role: "system",
              content: `${SYSTEM_PROMPT}\n\nVerified active doctor directory:\n${directoryContext}`,
            },
            ...messages,
          ],
        }),
      });

      if (!response.ok) {
        console.error("Aira gateway request failed", { status: response.status });
        if (response.status === 401 || response.status === 403) return failure("provider_auth");
        if (response.status === 402) return failure("quota");
        if (response.status === 429) return failure("rate_limit");
        if (response.status === 400 || response.status === 404) return failure("invalid_model");
        return failure("provider_error");
      }

      let json: unknown;
      try {
        json = await response.json();
      } catch {
        console.error("Aira gateway returned invalid JSON");
        return failure("invalid_response");
      }

      if (
        !json ||
        typeof json !== "object" ||
        !("choices" in json) ||
        !Array.isArray(json.choices)
      ) {
        console.error("Aira gateway returned an unexpected response shape");
        return failure("invalid_response");
      }
      const firstChoice = json.choices[0];
      if (!firstChoice || typeof firstChoice !== "object" || !("message" in firstChoice)) {
        console.error("Aira gateway response did not include a message");
        return failure("invalid_response");
      }
      const message = firstChoice.message;
      const reply =
        message && typeof message === "object" && "content" in message
          ? getTextContent(message.content)
          : null;
      if (!reply) {
        console.error("Aira gateway response did not include readable text");
        return failure("invalid_response");
      }
      return { ok: true, reply };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return failure("timeout");
      console.error("Aira gateway network request failed", {
        error: error instanceof Error ? error.name : "UnknownError",
      });
      return failure("network");
    } finally {
      clearTimeout(timeout);
    }
  });
