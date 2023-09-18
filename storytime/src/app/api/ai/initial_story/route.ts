import { LLMs } from "@/ai/llms";
import { sessionWithMockFallback } from "@/ai/llms/mock";
import { OpenAISession } from "@/ai/llms/openai";
import { ReplicateSession } from "@/ai/llms/replicate";
import FirstStoryTemplate from "@/ai/templates/first_story";
import prisma from "@/utils/db";
import { getUser } from "@/utils/get_user";
import logger from "@/utils/logger";
import { storyToMemory } from "@/utils/story_to_memory";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

const handler = async function (req: NextRequest) {
  const llms = new LLMs();
  const { user } = await getUser(req);
  const body: { prompt: string; storyMetadataId: string } = await req.json();
  const { storyMetadataId } = body;

  const results = await prisma.storyMetadata.findFirst({
    where: {
      userId: user.id,
      id: storyMetadataId,
    },
    select: {
      id: true,
      prompt: true,
      Summary: true,
      CharacterSheet: true,
      ActionMemory: true,
      RecallMemory: true,
    },
  });

  if (!results) {
    return new NextResponse(null, { status: 404 });
  }

  const relevantMemories = [];

  for (const memory of results.ActionMemory) {
    relevantMemories.push(`Action: ${memory.text} (${memory.importance})`);
  }

  for (const memory of results.RecallMemory) {
    relevantMemories.push(`Memory: ${memory.text} (${memory.timeAgo})`);
  }

  const template = new FirstStoryTemplate(
    results.CharacterSheet?.text || "",
    relevantMemories.join("\n"),
    results?.prompt || ""
  );

  const stream = await llms.tellFirstStory({ storyMetadataId }).createStream({
    maxTokens: 10,
    messages: [{ content: template }],
    async onCompletion(completion) {
      const { cost: memoryCost, memories } = await storyToMemory(
        llms,
        results.id,
        completion
      );
      // check if we already have chapter 0 if we do update it...
      const story = await prisma.story.findFirst({
        where: {
          storyMetadataId: results.id,
        },
      });
      logger.info({ story }, "Story");

      if (!story) {
        logger.info({ storyMetadataId: results.id }, "Creating new story");
        await prisma.$transaction([
          prisma.story.create({
            data: {
              storyMetadataId: results.id,
              chapter: 0,
              text: completion,
            },
          }),
          prisma.actionMemory.createMany({
            data: memories.actions,
          }),
          prisma.recallMemory.createMany({
            data: memories.recalls,
          }),
        ]);
      } else {
        logger.info(
          { storyMetadataId: results.id, completion },
          "Updating story"
        );
        await prisma.$transaction([
          prisma.actionMemory.createMany({
            data: memories.actions,
          }),
          prisma.recallMemory.createMany({
            data: memories.recalls,
          }),
          prisma.story.upsert({
            where: {
              id: story.id,
              storyMetadataId: results.id,
              chapter: 0,
            },
            create: {
              storyMetadataId: results.id,
              chapter: 0,
              text: completion,
            },
            update: {
              chapter: 0,
              text: completion,
            },
          }),
        ]);
      }
      logger.info({ storyMetadataId: results.id }, "Created story");
    },
  });
  return new StreamingTextResponse(stream);
};

export const POST = withApiAuthRequired(handler as any);
