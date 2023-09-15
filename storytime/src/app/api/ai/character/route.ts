import { CharacterSheetTemplate } from "@/templates/character_sheet";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

const handler = async function (req: NextRequest) {
  const session = await getSession(req, {} as any);
  console.log({ session });
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
};

export const POST = withApiAuthRequired(handler as any);
