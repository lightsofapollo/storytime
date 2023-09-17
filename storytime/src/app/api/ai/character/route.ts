import { sessionWithMockFallback } from "@/ai/session/mock";
import { OpenAISession } from "@/ai/session/openai";
import {
  CharacterSheetTemplate,
  MOCK_CHARACTER_SHEET,
} from "@/ai/templates/character_sheet";
import prisma from "@/utils/db";
import { getUser } from "@/utils/get_user";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

const aiSession = sessionWithMockFallback(() => {
  return new OpenAISession("gpt-3.5-turbo");
}, [MOCK_CHARACTER_SHEET]);

const handler = async function (req: NextRequest) {
  const { user } = await getUser(req);
  const body: { prompt: string; storyMetadataId: string } = await req.json();
  const { prompt, storyMetadataId } = body;
  const template = new CharacterSheetTemplate(prompt);
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

  const stream = await aiSession.createStream({
    messages: [{ content: template }],
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
