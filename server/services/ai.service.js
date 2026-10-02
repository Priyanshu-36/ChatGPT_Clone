import { Groq } from "groq-sdk";
import { GROQ_API_KEY } from "../config/env.js";
import { webSearch } from "../utils/webSearch.js";

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

const tools = [
  {
    type: "function",
    function: {
      name: "webSearch",

      description:
        "Search the internet for latest information and real-time data.",

      parameters: {
        type: "object",

        properties: {
          query: {
            type: "string",
            description: "The search query to perform.",
          },
        },

        required: ["query"],
      },
    },
  },
];

export async function generateResponse(question, previousMessages = []) {
  const messages = [
    {
      role: "system",
      content: `
        You are a smart personal assistant.
        If you know the answer to a question,answer it directly in plain english.
        If the answer requires real-time ,local or up-to-date information, or if you dont know the answer , use the available tools to find it.
        You have access to the following tool:
        webSearch(query:String)
        Use webSearch whenever the user asks about:
        - latest information
        - current events
        - recent news
        - live information
        - information that may have changed

        Decide when to use your own knowledge and when to use the tool.
        Do not mention the tool unless needed.

        Example:
        Q: What is the capital of France?
        A: The capital of France is Paris.

        Q: What is the weather in mumbai right now?
        A: (Use the search tool to find the latest weather)

        Q: Tell me the latest IT news.
        A: (Use the search tool to find the latest IT news)

        Current date and time:${new Date().toUTCString()}
      `,
    },

    ...previousMessages,

    {
      role: "user",
      content: question,
    },
  ];

  const MAX_RETRIES = 10;
  let count = 0;

  while (true) {
    if (count > MAX_RETRIES) {
      return "Sorry, I am unable to provide a response at this time. Please try again later.";
    }
    count++;
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages,

      tools,

      tool_choice: "auto",
    });

    const assistantMessage = response.choices[0].message;

    // Important:
    // Store assistant message because it may contain tool_calls
    messages.push(assistantMessage);

    const toolCalls = assistantMessage.tool_calls;

    // No tool call means LLM generated final answer
    if (!toolCalls || toolCalls.length === 0) {
      return assistantMessage.content;
    }

    // Execute every tool requested by model
    for (const tool of toolCalls) {
      const functionName = tool.function.name;

      let functionArguments;

      try {
        functionArguments = JSON.parse(tool.function.arguments);
      } catch {
        messages.push({
          role: "tool",
          tool_call_id: tool.id,
          content: "Invalid tool arguments.",
        });

        continue;
      }

      let toolResult;

      if (functionName === "webSearch") {
        toolResult = await webSearch(functionArguments);
      } else {
        toolResult = `Unknown tool: ${functionName}`;
      }

      /*
        Connect tool result with the original tool call.

        LLM:
        tool_calls -> id: abc123

        Tool:
        tool_call_id -> abc123
      */

      messages.push({
        role: "tool",
        tool_call_id: tool.id,
        content: toolResult,
      });
    }

    /*
      Loop again.

      The LLM now receives:

      user question
            ↓
      assistant tool_call
            ↓
      tool result
            ↓
      LLM generates final answer
    */
  }
}
