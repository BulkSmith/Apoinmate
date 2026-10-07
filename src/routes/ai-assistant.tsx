import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles } from "lucide-react";
import airaAvatar from "@/assets/aira-avatar.png";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askAira } from "@/lib/aira.functions";
import { ChatBooking } from "@/components/chat/ChatBooking";

const title = "Aira — AI Health Assistant | Apoinmate";
const description =
  "Aira is Apoinmate's AI health assistant. Understand symptoms, find the right specialty and navigate healthcare services. Informational only — not a medical diagnosis.";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiAssistant,
});

type Msg = { role: "user" | "assistant"; content: string; animate?: boolean };

const STARTERS = [
  "I have fever and body pain for 3 days",
  "Which doctor should I see for knee pain?",
  "How do I book an appointment in Muzaffarpur?",
  "Mujhe skin par rashes ho rahe hain, kis doctor ko dikhaun?",
];

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Aira is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-primary/70"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

/** Renders Aira replies with paragraphs, bullets and bold text, typed out character by character. */
function AiraText({ text, animate }: { text: string; animate?: boolean | undefined }) {
  const [shown, setShown] = useState(animate ? "" : text);

  useEffect(() => {
    if (!animate) {
      setShown(text);
      return;
    }
    let i = 0;
    setShown("");
    const id = window.setInterval(() => {
      i = Math.min(text.length, i + 2);
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 12);
    return () => window.clearInterval(id);
  }, [text, animate]);

  const blocks = shown.split(/\n{2,}/).filter(Boolean);

  const inline = (line: string) =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="font-semibold text-navy">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      ),
    );

  return (
    <div className="space-y-2.5 text-sm leading-relaxed text-navy">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter(Boolean);
        const isList = lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l));
        if (isList) {
          return (
            <ul key={bi} className="space-y-1.5">
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{inline(l.replace(/^\s*([-*•]|\d+[.)])\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={bi}>{inline(block)}</p>;
      })}
      {animate && shown.length < text.length && (
        <span className="inline-block h-4 w-0.5 animate-pulse bg-primary align-middle" />
      )}
    </div>
  );
}


function AiAssistant() {
  const ask = useServerFn(askAira);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Namaste! I'm Aira, your Apoinmate health assistant. Tell me what you're feeling and I'll help you understand which kind of doctor to see. I can't diagnose or prescribe — for that, please consult a doctor.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await ask({ data: { messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: res.reply, animate: true }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Sorry, I couldn't respond just now. Please try again in a moment.",
          animate: true,
        },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Meet Aira
          </span>
          <h1 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">
            Your AI-Powered Healthcare Companion
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Describe your concern in Hindi or English. Aira will help you understand it and point
            you to the right specialty and doctors near you.
          </p>
        </div>

        <div className="glass-card mt-8 flex h-[560px] flex-col p-4 sm:p-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <img
              src={airaAvatar}
              alt="Aira"
              width={512}
              height={512}
              className="h-11 w-11 rounded-2xl bg-primary-soft object-contain"
            />
            <div>
              <p className="text-sm font-semibold text-navy">Aira</p>
              <p className="text-xs text-success">{loading ? "Typing…" : "Online"}</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <p
                  key={i}
                  className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm"
                >
                  {m.content}
                </p>
              ) : (
                <div key={i} className="flex max-w-[92%] gap-2.5">
                  <img
                    src={airaAvatar}
                    alt=""
                    loading="lazy"
                    width={512}
                    height={512}
                    className="mt-0.5 h-8 w-8 shrink-0 rounded-xl bg-primary-soft object-contain"
                  />
                  <div className="min-w-0 rounded-2xl rounded-bl-sm bg-card px-4 py-3 shadow-sm ring-1 ring-border/60">
                    <AiraText text={m.content} animate={m.animate} />
                  </div>
                </div>
              ),
            )}
            {loading && (
              <div className="flex items-center gap-2.5">
                <img
                  src={airaAvatar}
                  alt=""
                  width={512}
                  height={512}
                  className="h-8 w-8 rounded-xl bg-primary-soft object-contain"
                />
                <span className="rounded-2xl rounded-bl-sm bg-card px-4 py-3 shadow-sm ring-1 ring-border/60">
                  <TypingDots />
                </span>
              </div>
            )}
            <div ref={endRef} />
          </div>


          {booking && (
            <div className="mb-3">
              <ChatBooking
                onClose={() => setBooking(false)}
                onBooked={(summary) =>
                  setMessages((m) => [
                    ...m,
                    {
                      role: "assistant",
                      content: `Your appointment is confirmed: **${summary}**. You can see it any time in your patient dashboard.`,
                      animate: true,
                    },
                  ])
                }
              />
            </div>
          )}

          {!booking && (
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setBooking(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/15"
              >
                Book an appointment here
              </button>
            </div>
          )}

          {messages.length <= 1 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-xl bg-card px-3 py-2 text-xs text-navy ring-1 ring-border hover:ring-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms or ask a question…"
              className="h-12 rounded-2xl bg-card/80 text-base"
              aria-label="Message Aira"
            />
            <Button type="submit" size="lg" className="h-12 rounded-2xl px-5" disabled={loading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>

        <div className="mt-5 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-navy">
          <strong className="font-semibold">Important:</strong> AI assistance is for informational
          and navigation purposes and does not replace professional medical diagnosis or treatment.
          In an emergency, contact your nearest hospital immediately.
        </div>

        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="rounded-xl bg-card/70">
            <Link to="/find-doctors">Find doctors near you</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
