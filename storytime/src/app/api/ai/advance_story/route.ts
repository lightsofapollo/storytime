import { CharacterSheetTemplate } from "@/ai/templates/character_sheet";
import NextActionsTemplate from "@/ai/templates/next_actions";
import prisma from "@/utils/db";
import { getUser } from "@/utils/get_user";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

const handler = async function (req: NextRequest) {
  const { user } = await getUser(req);
  const body: { prompt: string; storyMetadataId: string; storyId: string } =
    await req.json();
  const { storyId, storyMetadataId } = body;

  const storyMetadata = await prisma.storyMetadata.findUnique({
    where: {
      id: storyMetadataId,
      userId: user.id,
    },
  });

  if (!storyMetadata) {
    return new NextResponse(null, {
      statusText: "Another users story",
      status: 403,
    });
  }

  const story = await prisma.story.findFirst({
    where: {
      id: storyId,
      storyMetadataId,
    },
  });

  if (!story) {
    return new NextResponse(null, {
      statusText: "Canot find story",
      status: 404,
    });
  }

  const template = new NextActionsTemplate(story.text);
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
