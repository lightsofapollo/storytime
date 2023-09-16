import { CharacterSheetTemplate } from "@/templates/character_sheet";
import prisma from "@/utils/db";
import { getUser } from "@/utils/get_user";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

const handler = async function (req: NextRequest) {
  const { user } = await getUser(req);
  const body: { prompt: string; storyMetadataId: number } = await req.json();
  const { prompt, storyMetadataId } = body;
  const template = new CharacterSheetTemplate(prompt);

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

  const storyMetadata = await prisma.storyMetadata.findUnique({
    select: {
      id: true,
      userId: true,
    },
    where: {
      id: storyMetadataId,
    },
  });

  if (!storyMetadata) {
    return new NextResponse(null, {
      statusText: "Another users story",
      status: 403,
    });
  }

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await prisma.characterSheet.deleteMany({
        where: {
          storyMetadataId,
        },
      });
      await prisma.$transaction([
        prisma.storyMetadata.update({
          where: {
            id: storyMetadataId,
            userId: user.id,
          },
          data: {
            prompt,
          },
        }),
        prisma.characterSheet.create({
          data: {
            storyMetadataId,
            text: completion,
          },
        }),
      ]);
    },
  });
  return new StreamingTextResponse(stream);
};

export const POST = withApiAuthRequired(handler as any);
