import { LLMs } from "@/ai/llms";
import NextActionsTemplate from "@/ai/templates/next_actions";
import prisma from "@/utils/db";
import { getUser } from "@/utils/get_user";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

const handler = async function (req: NextRequest) {
  const llms = new LLMs();
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
  const stream = await llms
    .storyChoices({ storyId, storyMetadataId })
    .createStream({
      messages: [{ content: template }],
    });

  return new StreamingTextResponse(stream);
};

export const POST = withApiAuthRequired(handler as any);
