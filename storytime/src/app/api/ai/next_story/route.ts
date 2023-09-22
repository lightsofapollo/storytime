import { LLMs } from "@/ai/llms";
import { sessionWithMockFallback } from "@/ai/llms/mock";
import { OpenAISession } from "@/ai/llms/openai";
import { ReplicateSession } from "@/ai/llms/replicate";
import { StoryBuilder } from "@/ai/story/StoryBuilder";
import FirstStoryTemplate from "@/ai/templates/first_story";
import TellNextStoryTemplate from "@/ai/templates/tell_next_story";
import prisma from "@/utils/db";
import { getUser } from "@/utils/get_user";
import logger from "@/utils/logger";
import { storyToMemory } from "@/utils/story_to_memory";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

const RECENT_MEMORIES = -200;

const handler = async function (req: NextRequest) {
  const llms = new LLMs();
  const { user } = await getUser(req);
  const body: {
    prompt: string;
    storyMetadataId: string;
    storyId: string;
    chapter: number;
  } = await req.json();
  const { storyMetadataId, storyId, chapter } = body;

  const storyMetadata = await prisma.storyMetadata.findFirst({
    where: {
      userId: user.id,
      id: storyMetadataId,
    },
    include: {
      CharacterSheet: true,
      WriterBrief: true,
      ActionMemory: {
        take: 100,
        orderBy: {
          createdAt: "desc",
        },
      },
      RecallMemory: {
        take: 100,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!storyMetadata) {
    return new NextResponse(null, { status: 404 });
  }

  const [previousStory, currentStory] = await prisma.$transaction([
    prisma.story.findFirst({
      where: {
        storyMetadataId: storyMetadataId,
        chapter: {
          lt: chapter,
        },
      },
      orderBy: {
        chapter: "desc",
      },
    }),
    prisma.story.findFirst({
      where: {
        storyMetadataId: storyMetadataId,
        id: storyId,
        chapter: chapter,
      },
    }),
  ]);

  if (!previousStory || !currentStory) {
    return new NextResponse(null, {
      status: 404,
      statusText: "No previous story",
    });
  }

  const relevantMemories = [];

  for (const memory of storyMetadata.ActionMemory.slice(RECENT_MEMORIES)) {
    relevantMemories.push(`Action: ${memory.text} (${memory.importance})`);
  }

  for (const memory of storyMetadata.RecallMemory.slice(RECENT_MEMORIES)) {
    relevantMemories.push(`Memory: ${memory.text} (${memory.timeAgo})`);
  }

  const builder = new StoryBuilder(llms, storyMetadataId, currentStory.prompt);
  builder.appendSheet(storyMetadata.CharacterSheet?.text || "");

  if (storyMetadata.WriterBrief && storyMetadata.WriterBrief.prompt) {
    builder.appendWriterBrief(storyMetadata.WriterBrief.prompt);
  }

  builder.appendPreviousStory(previousStory.text);
  builder.appendMemories(relevantMemories);
  const storyPromptString = builder.finalize();

  const stream = await llms.tellNextStory({ storyMetadataId }).createStream({
    maxTokens: 4000,
    messages: [{ content: storyPromptString }],
    async onCompletion(completion) {
      const { cost: memoryCost, memories } = await storyToMemory(
        llms,
        storyMetadata.id,
        completion
      );
      await prisma.$transaction([
        prisma.actionMemory.createMany({
          data: memories.actions.map((action) => {
            return {
              ...action,
              storyId: currentStory.id,
            };
          }),
        }),
        prisma.recallMemory.createMany({
          data: memories.recalls.map((recall) => {
            return {
              ...recall,
              storyId: currentStory.id,
            };
          }),
        }),
        prisma.story.update({
          where: {
            id: currentStory.id,
            storyMetadataId: storyMetadata.id,
            chapter,
          },
          data: {
            storyMetadataId: storyMetadata.id,
            text: completion,
            generated: true,
            StoryPrompts: {
              create: {
                prompt: storyPromptString,
              },
            },
          },
        }),
      ]);
    },
  });
  return new StreamingTextResponse(stream);
};

export const POST = withApiAuthRequired(handler as any);
