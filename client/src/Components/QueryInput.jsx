import React, { useState } from "react";
import api from "../api/axios.js";

function QueryInput({ messages, setMessages }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery || loading) return;

    // Save the history BEFORE adding the new message
    const previousMessages = messages;

    const userMessage = {
      role: "user",
      content: trimmedQuery,
    };

    // Immediately display user's message
    setMessages((prev) => [...prev, userMessage]);

    setQuery("");
    setLoading(true);

    try {
      const response = await api.post("/chat", {
        message: trimmedQuery,

        // Send old conversation to backend
        messages: previousMessages,
      });

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
      };

      // Add AI response
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-neutral-700 bg-neutral-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto flex items-center gap-3"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Message ChatGPT..."
          disabled={loading}
          className="
            flex-1
            bg-neutral-800
            border border-neutral-700
            px-4 py-3
            rounded-2xl
            outline-none
            focus:border-neutral-500
            disabled:opacity-60
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="
            bg-white
            text-black
            px-5 py-3
            rounded-xl
            font-medium
            hover:bg-neutral-200
            disabled:opacity-50
          "
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default QueryInput;
