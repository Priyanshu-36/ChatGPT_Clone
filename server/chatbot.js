import { Groq } from "groq-sdk";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";

dotenv.config(".env");

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const msg = [
  {
    role: "system",
    content: `You are a helpful assistant that give answers to the asked questions.
          You have access to following tools:
          1.webSearch({query}:{query:String})//Search the latest information and realtime data on the internet.
          Current date and time: ${new Date().toUTCString()} `,
  },
];

const toolCall = [
  {
    type: "function",
    function: {
      name: "webSearch",
      description:
        "Search the latest information and realtime data on the internet.",
      parameters: {
        // JSON Schema object
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query  to perform search on.",
          },
        },
        required: ["query"],
      },
    },
  },
];

export async function generateResponse(question) {
  //user need to type bye to exit the program
  msg.push({ role: "user", content: question });

  while (true) {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: msg,
      tools: toolCall,
      tool_choice: "auto",
    });
    msg.push(response.choices[0].message);
    //   console.log(response.choices[0]);
    const toolCalls = response.choices[0].message.tool_calls;
    if (!toolCalls) {
      return response.choices[0].message.content;
    }
    // console.log("Tool Calls: ", toolCalls);
    for (const tool of toolCalls) {
      // console.log("tool:", tool);
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;
      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionParams));
        // console.log("Tool Result:", toolResult);
        msg.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }
  }

  // console.dir(raw, { depth: null });
}

async function webSearch({ query }) {
  //Here we will do tavily api call
  //   console.log("Calling web Search");
  const res = await tvly.search(query);
  // console.log("Response: ", res);
  const finalResult = res.results.map((result) => result.content).join("\n\n");
  return finalResult;
}
