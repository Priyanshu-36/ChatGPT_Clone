import { useState } from "react";
import "./App.css";

import AssistantMsg from "./Components/AssistantMsg.jsx";
import UserMessage from "./Components/UserMessage.jsx";
import QueryInput from "./Components/QueryInput.jsx";

export default function App() {
  const [messages, setMessages] = useState([]);

  return (
    <div className="bg-neutral-900 text-white h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-700 p-4">
        <h1 className="text-xl font-semibold text-center">ChatGPT Clone</h1>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center mt-20">
              <h2 className="text-3xl font-semibold">How can I help you?</h2>
            </div>
          )}

          {messages.map((message, index) => {
            if (message.role === "user") {
              return <UserMessage key={index} message={message.content} />;
            }

            return <AssistantMsg key={index} message={message.content} />;
          })}
        </div>
      </main>

      {/* Input */}
      <QueryInput messages={messages} setMessages={setMessages} />
    </div>
  );
}
