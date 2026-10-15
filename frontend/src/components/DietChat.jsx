import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { sendDietChat } from "../services/dietService.js";

const GREETING = {
  role: "assistant",
  content:
    "Hi! I can answer questions about your diet plan: food swaps, meal timing, calories and more. What would you like to know?",
  local: true, // UI-only, never sent to the backend
};

const SUGGESTIONS = [
  "Can I swap any meal?",
  "How can I get more protein?",
  "What should I eat before a workout?",
];

const DietChat = () => {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  // scroll only the chat box, not the whole page
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const send = async (text) => {
    const message = text.trim();
    if (!message || sending) return;

    // history = real, successful messages only
    const history = messages
      .filter((m) => !m.local && !m.error && !m.failed)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setSending(true);

    try {
      const { reply } = await sendDietChat(message, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const errorText =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setMessages((prev) => [
        // mark the user message that got no reply so it's skipped next time
        ...prev.map((m, i) => (i === prev.length - 1 ? { ...m, failed: true } : m)),
        { role: "assistant", content: errorText, error: true },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="card flex flex-col h-[32rem] lg:h-[36rem] overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
        <div className="grid place-items-center w-10 h-10 rounded-full bg-accent text-accent-fg text-sm font-bold">
          AI
        </div>
        <div>
          <p className="font-semibold leading-tight">Assistant</p>
          <p className="text-xs text-muted">I'm here to help with your diet</p>
        </div>
      </div>

      {/* messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto bg-surface2/60 px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-4 py-2.5 text-sm whitespace-pre-wrap rounded-2xl ${
                m.role === "user"
                  ? "bg-brand text-white rounded-br-md"
                  : m.error
                  ? "bg-white text-brand border border-brand/40 rounded-bl-md"
                  : "bg-white text-neutral-900 rounded-bl-md"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* suggestions (only before the first question) */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs rounded-full border border-line bg-surface px-3 py-1.5 text-muted hover:text-fg hover:bg-surface2"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          placeholder="Ask about your diet..."
          className="flex-1 min-w-0 rounded-full bg-white text-black placeholder:text-neutral-500 px-5 py-3 text-sm border border-line focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          aria-label="Send"
          className="grid place-items-center w-11 h-11 shrink-0 rounded-full bg-brand text-white disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default DietChat;