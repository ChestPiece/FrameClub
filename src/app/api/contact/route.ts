import { fail, ok, parseJsonBody } from "@/lib/http/api-envelope";
import { createContactSubmission } from "@/lib/db/services";
import { sendCustomFrameInquiry } from "@/lib/emails/send";
import type { ContactIntent, CustomFrameBrief } from "@/lib/db/types";
import { isNonEmpty } from "@/lib/utils";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  intent?: string;
  meta?: Record<string, unknown> | null;
};

function parseIntent(value: string | undefined): ContactIntent {
  if (value === "custom-frame" || value === "notify" || value === "general") return value;
  return "general";
}

function parseBrief(value: Record<string, unknown> | null | undefined): CustomFrameBrief | null {
  if (!value || typeof value !== "object") return null;
  const out: CustomFrameBrief = {};
  if (typeof value.team === "string") out.team = value.team;
  if (typeof value.playerName === "string") out.playerName = value.playerName;
  if (typeof value.jerseyNumber === "string") out.jerseyNumber = value.jerseyNumber;
  if (value.frameSize === "small" || value.frameSize === "medium" || value.frameSize === "large") {
    out.frameSize = value.frameSize;
  }
  if (typeof value.referenceUrl === "string") out.referenceUrl = value.referenceUrl;
  return out;
}

export async function POST(request: Request) {
  const payload = await parseJsonBody<ContactPayload>(request);

  if (!payload) {
    return fail("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  if (!isNonEmpty(payload.name) || !isNonEmpty(payload.email) || !isNonEmpty(payload.message)) {
    return fail("VALIDATION_ERROR", "name, email and message are required.", 422);
  }

  const intent = parseIntent(payload.intent);
  const meta = intent === "custom-frame" ? parseBrief(payload.meta ?? null) : null;

  try {
    const submission = await createContactSubmission({
      name: payload.name,
      email: payload.email,
      message: payload.message,
      intent,
      meta,
    });

    if ("error" in submission && submission.error) {
      return fail(submission.error, "Could not save contact submission.", 500);
    }

    if (intent === "custom-frame" && "id" in submission) {
      sendCustomFrameInquiry(submission).catch((err) => {
        console.error("Failed to send custom-frame inquiry email:", err);
      });
    }

    return ok({ submission }, 201);
  } catch (err) {
    console.error("Contact route error:", err);
    return fail("INTERNAL_ERROR", "Could not save contact submission.", 500);
  }
}
