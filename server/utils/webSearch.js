import { tavily } from "@tavily/core";
import { TAVILY_API_KEY } from "../config/env.js";

const tvly = tavily({
  apiKey: TAVILY_API_KEY,
});

export async function webSearch({ query }) {
  try {
    const response = await tvly.search(query);

    const result = response.results.map((item) => item.content).join("\n\n");

    return result;
  } catch (error) {
    console.error("Tavily Search Error:", error);

    return "Unable to search the web right now.";
  }
}
