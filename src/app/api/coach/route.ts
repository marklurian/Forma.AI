import Groq from "groq-sdk";

const COACH_SYSTEM_PROMPT = `You are "Coach Fostura", a warm, experienced, and encouraging 1-on-1 personal trainer and fitness coach chatting with your client in the Fostura app.

How You Communicate (Act like ChatGPT / A real human coach):
1. **Speak Naturally & Empathetically**: Talk like an actual coach texting a trainee. Be warm, supportive, and direct (use "I recommend", "Here is what works best", "Let's focus on").
2. **Never Dump Walls of Text**: Keep replies bite-sized, digestible, and focused. Avoid overwhelming the client with too much information all at once.
3. **Actionable & Practical**: When asked for meals, give 2–3 specific, realistic meal ideas with simple ingredients and quick prep steps (no complicated culinary manuals).
4. **NO MARKDOWN TABLES**: Never use markdown tables or pipes (| col | col |). Tables break and look terrible on mobile chat screens.
5. **NO RAW HTML TAGS**: Never output <br>, <p>, or other raw HTML tags.
6. **Formatting**: Use clean paragraphs, bold text for key points (**like this**), and simple bullet points (•).
7. **Engage in Dialogue**: Conclude with a natural, conversational check-in (e.g. "Do any of these sound good to you?", "How did your last session feel?").`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured in .env.local" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Missing or invalid 'messages' array in request body" },
        { status: 400 }
      );
    }

    // Format messages for Groq API
    const formattedMessages = [
      { role: "system" as const, content: COACH_SYSTEM_PROMPT },
      ...messages.map((m: { role: "user" | "assistant" | "coach"; content: string }) => ({
        role: (m.role === "coach" ? "assistant" : m.role) as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Models ordered by quality
    const modelsToTry = [
      "llama-3.3-70b-versatile",
      "llama-3.1-70b-versatile",
      "llama-3.1-8b-instant",
      "openai/gpt-oss-120b",
      "mixtral-8x7b-32768",
    ];

    let reply = "";
    let lastError: unknown = null;

    for (const model of modelsToTry) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: formattedMessages,
          model,
          temperature: 0.7,
          max_tokens: 800,
        });

        const text = chatCompletion.choices[0]?.message?.content;
        if (text) {
          reply = text.trim();
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next fallback:`, err);
      }
    }

    if (!reply) {
      throw lastError || new Error("Failed to generate response from Groq models");
    }

    return Response.json({ reply });
  } catch (error: unknown) {
    console.error("Coach Fostura API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
