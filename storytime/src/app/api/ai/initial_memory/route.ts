import { parseMemoryOutput } from "@/parsers/memory";
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
  const { user } = await getUser(req);
  const body: { prompt: string; storyMetadataId: string } = await req.json();
  const { prompt, storyMetadataId } = body;
  const meta = await prisma.storyMetadata.findFirst({
    where: {
      id: storyMetadataId,
      userId: user.id,
    },
    select: {
      Summary: true,
    },
  });

  if (!meta) {
    return new NextResponse(null, { status: 404 });
  }

  if (!meta.Summary) {
    return new NextResponse(null, { status: 404, statusText: "No summary" });
  }

  const template = new MemoryTemplate(meta.Summary.summary);
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

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      const memories = parseMemoryOutput(storyMetadataId, completion);
      // remove old memories...
      await prisma.$transaction([
        prisma.actionMemory.deleteMany({
          where: {
            storyMetadataId,
            storyId: null,
          },
        }),
        prisma.recallMemory.deleteMany({
          where: {
            storyMetadataId,
            storyId: null,
          },
        }),
      ]);

      const result = await prisma.$transaction([
        prisma.actionMemory.createMany({
          data: memories.actions,
        }),
        prisma.recallMemory.createMany({
          data: memories.recalls,
        }),
      ]);
      logger.info({ result }, "Created memories");
    },
  });
  return new StreamingTextResponse(stream);
};

export const POST = withApiAuthRequired(handler as any);
