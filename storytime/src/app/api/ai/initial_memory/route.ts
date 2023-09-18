import { LLMs } from "@/ai/llms";
import { sessionWithMockFallback } from "@/ai/llms/mock";
import { OpenAISession } from "@/ai/llms/openai";
import MemoryTemplate, { MOCK_MEMORY_OUTPUT } from "@/ai/templates/memory";
import { parseMemoryOutput } from "@/parsers/memory";
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

  const stream = await llms.memories({ storyMetadataId }).createStream({
    messages: [{ content: template }],
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
