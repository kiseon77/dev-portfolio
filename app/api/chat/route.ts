import { GoogleGenAI } from "@google/genai";
import { PERSONA_SYSTEM_PROMPT } from "@/lib/persona";

const MODEL_ID = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;

const isConfigured = Boolean(process.env.GEMINI_API_KEY);
const client = isConfigured
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const OFFLINE_MESSAGE =
  "핵심 시스템이 오프라인 상태입니다 (API LIMIT EXCEEDED). 지금은 AI 페르소나와 대화할 수 없으니, 다른 섹션에서 프로젝트와 소개를 먼저 확인해 주세요. 궁금한 점은 이메일로 편하게 연락 주세요.";

// ponytail: in-memory rate limit, resets on cold start / doesn't share across instances — swap for Redis if abuse shows up
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function GET() {
  return Response.json({ configured: isConfigured, model: MODEL_ID });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "API LIMIT EXCEEDED" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json().catch(() => null);
  const messages: ChatMessage[] = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "INVALID_REQUEST" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (
    messages.length > MAX_MESSAGES ||
    messages.some(
      (m) =>
        typeof m.content !== "string" ||
        m.content.length > MAX_MESSAGE_LENGTH ||
        (m.role !== "user" && m.role !== "assistant"),
    )
  ) {
    return new Response(JSON.stringify({ error: "INVALID_REQUEST" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!client) {
    const encoder = new TextEncoder();
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(OFFLINE_MESSAGE));
          controller.close();
        },
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  let stream: Awaited<ReturnType<typeof client.models.generateContentStream>>;
  try {
    stream = await client.models.generateContentStream({
      model: MODEL_ID,
      contents,
      config: {
        systemInstruction: PERSONA_SYSTEM_PROMPT,
        maxOutputTokens: 1024,
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "API LIMIT EXCEEDED" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const body_ = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
        }
      } catch {
        controller.enqueue(encoder.encode("\n[ERROR] STREAM_INTERRUPTED"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body_, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
