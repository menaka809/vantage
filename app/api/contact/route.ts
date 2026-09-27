import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().min(1).pipe(z.email()),
  service: z.string().min(1).max(80),
  message: z.string().min(2).max(5000),
  company: z.string().optional(),
});

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, { count: number; ts: number }>();

// Best-effort rate limit; resets on cold start.
function isRateLimited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c] as string
  );

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — please try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 422 }
    );
  }

  const { name, email, service, message, company } = parsed.data;

  // Honeypot filled means a bot; fake success so it doesn't retry.
  if (company && company.trim() !== "") {
    console.warn("[contact] honeypot triggered, dropping submission");
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "malithmenaka96@gmail.com";
  const from = process.env.CONTACT_FROM || "Vantage <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(`[contact] RESEND_API_KEY not set — not emailed: ${email}`);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        // Replying in the inbox goes straight to the sender.
        reply_to: email,
        subject: `New project brief from ${name} — ${service}`,
        text: [
          `Name:    ${name}`,
          `Email:   ${email}`,
          `Service: ${service}`,
          "",
          "Message:",
          message,
        ].join("\n"),
        html: `
          <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;color:#1a1a1a">
            <h2 style="font-size:18px;margin:0 0 20px">New project brief</h2>
            <table style="font-size:14px;line-height:1.7;border-collapse:collapse">
              <tr><td style="color:#888;padding-right:14px">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>
              <tr><td style="color:#888;padding-right:14px">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
              <tr><td style="color:#888;padding-right:14px">Service</td><td>${escapeHtml(service)}</td></tr>
            </table>
            <p style="color:#888;font-size:13px;margin:22px 0 6px">Message</p>
            <p style="font-size:15px;line-height:1.65;white-space:pre-wrap;margin:0;padding:14px 16px;background:#f6f6f6;border-radius:8px">${escapeHtml(message)}</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
