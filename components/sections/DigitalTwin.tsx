"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import clsx from "clsx";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CONTACT_EMAIL = "kiseon.han77@gmail.com";

const WELCOME: Message = {
  role: "assistant",
  content:
    "안녕하세요, 개발자 한기선씨의 디지털 트윈입니다. 경력, 기술, 프로젝트에 대해 무엇이든 물어보세요.",
};

const OFFLINE_WELCOME: Message = {
  role: "assistant",
  content:
    "핵심 시스템이 오프라인 상태입니다. 지금은 AI 페르소나와 대화할 수 없어 기본 정보만 안내해 드립니다.\n\n한기선은 디자인의 의도를 코드로 옮기는 일을 좋아하는 개발자로, 기획·디자인·구현 사이의 간극을 좁히는 데 강점이 있습니다. 궁금하신 점은 아래 버튼으로 이메일 연락 부탁드립니다.",
};

export default function DigitalTwin() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        const configured = Boolean(data?.configured);
        setIsConnected(configured);
        setModelName(typeof data?.model === "string" ? data.model : null);
        if (!configured) setMessages([OFFLINE_WELCOME]);
      })
      .catch(() => {
        setIsConnected(false);
        setMessages([OFFLINE_WELCOME]);
      });
  }, []);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const nextMessages = [
      ...messages,
      { role: "user" as const, content: trimmed },
    ];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "REQUEST_FAILED");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: acc },
        ]);
        scrollToBottom();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "REQUEST_FAILED");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#F0F0F0] ">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-14 lg:flex-row lg:items-center">
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <h2 className="text-3xl font-medium text-black/80 sm:text-4xl">
            Interface with the
            <br />
            <span className="font-bold text-black">Digital Twin</span>
          </h2>
          <p className="text-base/5 font-semibold text-gray-600">
            저한테 바로 연락 주시기 전에, <br /> 저를 닮은 AI와 먼저 편하게
            대화하며 역량과 핏을 확인해보세요.
          </p>
          <div className="flex flex-col gap-1 text-xs font-semibold text-gray-500">
            <p>
              STATUS:
              {isConnected === null ? (
                <span className="ml-1 text-gray-400">CHECKING...</span>
              ) : isConnected ? (
                <span className="ml-1 text-green-600">[WORKING]</span>
              ) : (
                <span className="ml-1 text-red-500">
                  [NOT WORKED] : API LIMIT EXCEEDED
                </span>
              )}
            </p>
            {modelName && <p>COGNITION: {modelName.toUpperCase()}</p>}
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm lg:w-1/2">
          <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3">
            <span
              className={clsx(
                "h-2.5 w-2.5 rounded-full",
                isConnected === null
                  ? "bg-gray-300"
                  : isConnected
                    ? "bg-green-500"
                    : "bg-red-500",
              )}
            />
            <span className="text-sm font-semibold text-gray-500">
              TERMINAL // DIGITAL_TWIN
            </span>
          </div>

          <div
            ref={scrollRef}
            className="flex h-90 flex-col gap-3 overflow-y-auto p-4"
          >
            {messages.map((m, i) =>
              m.role === "user" ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-[80%] self-end rounded-lg bg-neutral-800 px-3 py-2"
                >
                  <p className="whitespace-pre-wrap text-xs font-medium text-white sm:text-sm">
                    {m.content}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-[80%] self-start rounded-lg border border-black/10 bg-gray-50 p-3"
                >
                  <p className="mb-1 text-[10px] font-semibold tracking-wider text-gray-400">
                    {"> CORE_RESPONSE"}
                  </p>
                  <p className="whitespace-pre-wrap text-xs font-medium text-gray-800 sm:text-sm">
                    {m.content ||
                      (isLoading && i === messages.length - 1 ? "▍" : "")}
                  </p>
                  {isConnected === false &&
                    m === messages[messages.length - 1] && (
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="mt-2 flex items-center justify-center gap-1.5 rounded-md bg-neutral-600 px-3 py-2 text-xs font-semibold text-white transition-colors sm:text-sm"
                      >
                        + 이메일로 연락하기
                      </a>
                    )}
                </motion.div>
              ),
            )}
            {error && (
              <p className="text-xs font-semibold text-red-500">
                [NOT WORKED]: {error}
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-black/10 p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || isConnected === false}
              placeholder={
                isConnected === false
                  ? "지금은 대화할 수 없습니다"
                  : "ENTER COMMAND..."
              }
              className="flex-1 bg-transparent text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed sm:text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || isConnected === false || !input.trim()}
              className={clsx(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-indigo-600 transition-colors",
                isLoading || isConnected === false || !input.trim()
                  ? "opacity-40"
                  : "hover:bg-indigo-600/10",
              )}
              aria-label="전송"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
