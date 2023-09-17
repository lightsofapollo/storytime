import SummaryTemplate from "@/ai/templates/summary";
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
  const { prompt: characterSheet, storyMetadataId } = body;

  const storyMetadata = await prisma.storyMetadata.findUnique({
    select: {
      id: true,
      userId: true,
      CharacterSheet: true,
    },
    where: {
      id: storyMetadataId,
      userId: user.id,
    },
  });

  if (!storyMetadata) {
    logger.error({ storyMetadataId }, "Story metadata not found");
    return new NextResponse(null, {
      status: 404,
    });
  }

  const template = new SummaryTemplate(
    storyMetadata.CharacterSheet?.text || ""
  );

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

  if (!storyMetadata) {
    return new NextResponse(null, {
      statusText: "Another users story",
      status: 403,
    });
  }

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await prisma.summary.deleteMany({
        where: {
          storyMetadataId,
        },
      });
      await prisma.$transaction([
        prisma.summary.create({
          data: {
            storyMetadataId,
            summary: completion,
          },
        }),
      ]);
    },
  });
  return new StreamingTextResponse(stream);
};

export const POST = withApiAuthRequired(handler as any);
