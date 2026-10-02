# 🤖 ChatGPT Clone — AI Assistant with Web Search

A full-stack **AI chatbot application** built using **React.js, Node.js, Express.js, Groq, and Tavily**.

The application provides a ChatGPT-like conversational interface where users can interact with an LLM while maintaining conversation context. The backend also implements **tool/function calling**, allowing the AI model to automatically perform real-time web searches using Tavily when up-to-date information is required.

---

## ✨ Features

- 💬 ChatGPT-like conversational interface
- 🧠 Conversation history and contextual responses
- 🤖 LLM integration using Groq
- 🔧 AI tool/function calling
- 🌐 Real-time web search using Tavily
- ⚡ React + Vite frontend
- 🚀 Node.js + Express backend
- 🔗 Axios-based client-server communication
- ⏳ Loading state while generating responses
- 🛡️ API keys protected using environment variables
- 🎨 Responsive dark UI using Tailwind CSS
- 🧩 Modular frontend and backend architecture

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- JavaScript

## Backend

- Node.js
- Express.js
- Groq SDK
- Tavily API
- CORS
- dotenv

## AI

- Groq LLM API
- `openai/gpt-oss-120b`
- Tool / Function Calling
- Tavily Web Search

---

# 📁 Project Structure

```text
ChatGPT-Clone/
│
├── client/
│   │
│   ├── src/
│   │   ├── Components/
│   │   │   ├── AssistantMsg.jsx
│   │   │   ├── UserMessage.jsx
│   │   │   └── QueryInput.jsx
│   │   │
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── .env
│   └── package.json
│
├── server/
│   │
│   ├── controllers/
│   │   └── chat.controller.js
│   │
│   ├── routes/
│   │   └── chat.routes.js
│   │
│   ├── services/
│   │   └── ai.service.js
│   │
│   ├── utils/
│   │   └── webSearch.js
│   │
│   ├── config/
│   │   └── env.js
│   │
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ How It Works

The application follows the following architecture:

```text
User
 │
 ▼
React Frontend
 │
 │ User Question + Previous Messages
 ▼
Axios
 │
 │ POST /api/chat
 ▼
Express Backend
 │
 ▼
Chat Controller
 │
 ▼
AI Service
 │
 ├───────────────┐
 │               │
 ▼               ▼
Groq LLM      Tavily Search
 │               │
 │◄──────────────┘
 │
 ▼
Final AI Response
 │
 ▼
Express
 │
 ▼
React
 │
 ▼
Chat Interface
```

---

# 🧠 Conversation History

The frontend maintains the current conversation using React state.

```javascript
const [messages, setMessages] = useState([]);
```

Each message follows the format:

```javascript
{
  role: "user",
  content: "What is Generative AI?"
}
```

or:

```javascript
{
  role: "assistant",
  content: "Generative AI is..."
}
```

When the user sends a new message, the frontend sends both:

- The new user question
- Previous conversation history

Example request:

```json
{
  "message": "What is my name?",
  "messages": [
    {
      "role": "user",
      "content": "My name is Priyanshu"
    },
    {
      "role": "assistant",
      "content": "Nice to meet you, Priyanshu!"
    }
  ]
}
```

The backend combines the system prompt, previous messages, and new question before sending them to the LLM.

```text
System Prompt
      +
Previous Messages
      +
New User Question
      ↓
     LLM
```

This allows the model to generate context-aware responses.

> Currently, conversation history is maintained on the client using React state. Refreshing the browser clears the conversation. Persistent conversation storage using MongoDB can be added in a future version.

---

# 🔧 Tool Calling

The application supports LLM **tool/function calling**.

The model has access to a web search tool:

```javascript
webSearch({ query })
```

The tool is defined using JSON Schema so the LLM understands its expected parameters.

```javascript
{
  type: "function",

  function: {
    name: "webSearch",

    description:
      "Search the latest information and realtime data on the internet.",

    parameters: {
      type: "object",

      properties: {
        query: {
          type: "string",
          description: "The search query to perform."
        }
      },

      required: ["query"]
    }
  }
}
```

---

# 🌐 Web Search Flow

If the user asks a question requiring current information, the LLM can automatically request a web search.

For example:

```text
User:
"What is the latest news about NVIDIA?"
```

The execution flow becomes:

```text
User Question
      │
      ▼
Groq LLM
      │
      │ Determines current information is required
      ▼
webSearch()
      │
      ▼
Tavily API
      │
      ▼
Search Results
      │
      ▼
Groq LLM
      │
      ▼
Final Answer
```

The backend executes the tool and provides the result back to the LLM.

```javascript
messages.push({
  role: "tool",
  tool_call_id: tool.id,
  content: toolResult
});
```

The LLM then uses the search results to generate its final response.

---

# 🔌 API Endpoint

## Chat

```http
POST /api/chat
```

### Request

```json
{
  "message": "Explain Generative AI",
  "messages": []
}
```

### Response

```json
{
  "success": true,
  "answer": "Generative AI is a type of artificial intelligence..."
}
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

Move into the project:

```bash
cd ChatGPT-Clone
```

---

# 🖥️ Backend Setup

Move into the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3001

GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:3001
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
```

Start the frontend:

```bash
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

---

# 🔗 Axios Configuration

The frontend communicates with the Express backend through Axios.

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
```

A chat request is sent using:

```javascript
const response = await api.post("/chat", {
  message: trimmedQuery,
  messages: previousMessages
});
```

---

# 🔐 Environment Variables

API keys and configuration values are stored inside `.env` files.

Never commit `.env` files containing real API keys.

Example `.gitignore`:

```gitignore
# Dependencies
node_modules/

# Environment variables
.env
.env.local

# Build files
dist/

# Logs
*.log

# OS files
.DS_Store
Thumbs.db
```

---

# 🔄 Complete Request-Response Flow

```text
1. User enters a message
        ↓
2. QueryInput captures the message
        ↓
3. User message is added to React state
        ↓
4. Axios sends:
      - New question
      - Previous messages
        ↓
5. Express receives POST /api/chat
        ↓
6. Controller extracts request data
        ↓
7. generateResponse() is called
        ↓
8. System prompt + history + question are combined
        ↓
9. Groq processes the conversation
        ↓
10. If required → Tavily web search is called
        ↓
11. Tool result is returned to Groq
        ↓
12. Groq generates the final response
        ↓
13. Express sends the answer to React
        ↓
14. React adds the assistant message to state
        ↓
15. UI automatically re-renders
```

---

# 🗺️ Future Improvements

Potential features that can be added:

- MongoDB conversation persistence
- Multiple chat conversations
- User authentication
- JWT authentication
- Chat history sidebar
- Delete and rename conversations
- Streaming AI responses
- Markdown rendering
- Syntax highlighting for code
- Copy response button
- Regenerate response
- Stop generation
- Additional AI tools
- File upload and document analysis
- Image understanding
- Voice input
- Rate limiting
- Deployment
- Docker support

---

# 📚 Key Concepts Demonstrated

This project demonstrates practical implementation of:

- Full-stack React + Node.js development
- REST API development
- Client-server communication
- LLM API integration
- Prompt engineering
- LLM conversation context
- Tool/function calling
- JSON Schema for AI tools
- Real-time web search integration
- Async JavaScript
- React state management
- Express controllers and routes
- Environment variable management
- Error handling
- Modular project architecture

---

# 👨‍💻 Author

**Priyanshu Singh**

Computer Science & Engineering

### Connect

- GitHub: `<YOUR_GITHUB_URL>`
- LinkedIn: `<YOUR_LINKEDIN_URL>`
- Email: `<YOUR_EMAIL>`

---

# 📄 License

This project is intended for learning and educational purposes.

You can add an MIT License if you plan to make the repository open source.

---

⭐ If you found this project useful, consider giving the repository a star!
