import { generateResponse } from "../services/ai.service.js";

export async function chatController(req, res) {
  try {
    const { message, messages = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const answer = await generateResponse(message, messages);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate response",
    });
  }
}
