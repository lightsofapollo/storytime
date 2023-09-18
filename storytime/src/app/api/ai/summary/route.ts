import { LLMs } from "@/ai/llms";
import { sessionWithMockFallback } from "@/ai/llms/mock";
import { OpenAISession } from "@/ai/llms/openai";
import SummaryTemplate from "@/ai/templates/summary";
import prisma from "@/utils/db";
import { getUser } from "@/utils/get_user";
import logger from "@/utils/logger";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

const handler = async function (req: NextRequest) {
  const llms = new LLMs();
  const { user } = await getUser(req);
  const body: { prompt: string; storyMetadataId: string } = await req.json();
  const { storyMetadataId } = body;

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

  if (!storyMetadata) {
    return new NextResponse(null, {
      statusText: "Another users story",
      status: 403,
    });
  }

  const stream = await llms.summary({ storyMetadataId }).createStream({
    messages: [{ content: template }],
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
