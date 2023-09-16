import MemoryTemplate from "@/templates/memory";
import SummaryTemplate from "@/templates/summary";
import prisma from "@/utils/db";
import { getUser } from "@/utils/get_user";
import logger from "@/utils/logger";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

const handler = async function (req: NextRequest) {
  const body: { prompt: string } = await req.json();
  const { prompt } = body;
  const template = new MemoryTemplate(prompt);

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
