import { CharacterSheetTemplate } from "@/templates/character_sheet";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt } = body;
  const template = new CharacterSheetTemplate(prompt);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "user",
        content: template.format(),
      },
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
