import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
