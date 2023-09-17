import { TemplateModelTypes } from "@/templates/base";
import FirstStoryTemplate from "@/templates/first_story";
import prisma from "@/utils/db";
import { getUser } from "@/utils/get_user";
import { storyToMemory } from "@/utils/story_to_memory";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { ReplicateStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

const handler = async function (req: NextRequest) {
  const { user } = await getUser(req);
  const body: { prompt: string; storyMetadataId: string } = await req.json();
  const { prompt, storyMetadataId } = body;

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

  const response = await replicate.predictions.create({
    stream: true,
    version: "f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d",
    input: {
      prompt: template.format(TemplateModelTypes.LLAMA2),
      max_new_tokens: 3000,
    },
  });

  const stream = await ReplicateStream(response, {
    async onCompletion(completion) {
      const memory = await storyToMemory(results.id, completion);
      // check if we already have chapter 0 if we do update it...
      const story = await prisma.story.findFirst({
        where: {
          storyMetadataId: results.id,
          chapter: 0,
        },
      });

      if (!story) {
        await prisma.$transaction([
          prisma.story.create({
            data: {
              storyMetadataId: results.id,
              chapter: 0,
              text: completion,
            },
          }),
          prisma.actionMemory.createMany({
            data: memory.actions,
          }),
          prisma.recallMemory.createMany({
            data: memory.recalls,
          }),
        ]);
      } else {
        await prisma.$transaction([
          prisma.actionMemory.createMany({
            data: memory.actions,
          }),
          prisma.recallMemory.createMany({
            data: memory.recalls,
          }),
          prisma.story.upsert({
            where: {
              id: story.id,
              storyMetadataId: results.id,
              chapter: 0,
            },
            create: {
              storyMetadataId: results.id,
              text: completion,
            },
            update: {
              text: completion,
            },
          }),
        ]);
      }
    },
  });
  return new StreamingTextResponse(stream);
};

export const POST = withApiAuthRequired(handler as any);
