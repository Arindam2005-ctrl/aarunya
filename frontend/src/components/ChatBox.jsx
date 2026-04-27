import { useState, useRef, useEffect } from "react";

export default function ChatBox({ shipData }) {
  const [msgs, setMsgs] = useState([
    {
      role: "ai",
      text: "Analyze a vessel first, then I can explain its last-known location, weather risk, delay prediction, and route safety."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: userText,
          shipData
        })
      });

      const data = await res.json();

      setMsgs((m) => [
        ...m,
        { role: "ai", text: data.reply || "Sorry, I could not generate a response." }
      ]);
    } catch (error) {
      setMsgs((m) => [
        ...m,
        { role: "ai", text: "Chat service is not connected. Please check backend server." }
      ]);
    }

    setLoading(false);
  };

  const suggestions = ["Where is the ship?", "Weather risk?", "Delay prediction?"];

  return (
    <div style={{
      height: "100%",
      background: "#080e1c",
      borderTop: "1px solid rgba(56,139,255,0.12)",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderBottom: "1px solid rgba(56,139,255,0.08)",
        background: "#0a1220",
      }}>
        <div style={{
          width: "24px",
          height: "24px",
          borderRadius: "6px",
          background: "rgba(56,139,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px"
        }}>
          🤖
        </div>

        <span style={{ fontSize: "12px", fontWeight: 500, color: "#a8c9ef" }}>
          AI Maritime Assistant
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              style={{
                background: "rgba(56,139,255,0.06)",
                border: "1px solid rgba(56,139,255,0.15)",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "10px",
                color: "#5a7fa8",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "10px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "8px",
              flexDirection: m.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start"
            }}
          >
            <div style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              flexShrink: 0,
              background: m.role === "ai" ? "rgba(56,139,255,0.15)" : "rgba(30,190,120,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: m.role === "ai" ? "#3b8bd4" : "#1ebe78",
            }}>
              {m.role === "ai" ? "AI" : "U"}
            </div>

            <div style={{
              fontSize: "12px",
              color: "#a8c9ef",
              lineHeight: 1.6,
              background: m.role === "user" ? "rgba(30,190,120,0.06)" : "rgba(56,139,255,0.06)",
              border: `1px solid ${m.role === "user" ? "rgba(30,190,120,0.15)" : "rgba(56,139,255,0.12)"}`,
              borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
              padding: "8px 12px",
              maxWidth: "70%",
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ color: "#3b8bd4", fontSize: "12px", marginLeft: "32px" }}>
            Analyzing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{
        display: "flex",
        gap: "8px",
        padding: "10px 14px",
        borderTop: "1px solid rgba(56,139,255,0.08)",
        background: "#0a1220",
      }}>
        <input
          style={{
            flex: 1,
            background: "rgba(56,139,255,0.05)",
            border: "1px solid rgba(56,139,255,0.2)",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "12px",
            color: "#a8c9ef",
            outline: "none",
            fontFamily: "inherit",
          }}
          placeholder="Ask about route, weather, delay, or vessel risk..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />

        <button
          onClick={send}
          disabled={loading}
          style={{
            background: loading ? "rgba(56,139,255,0.1)" : "linear-gradient(135deg, #1a5fa0, #2272c3)",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "Send →"}
        </button>
      </div>
    </div>
  );
}