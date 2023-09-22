import { LLMs } from "@/ai/llms";
import { CharacterSheetTemplate } from "@/ai/templates/character_sheet";
import prisma from "@/utils/db";
import { getUser } from "@/utils/get_user";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

const handler = async function (req: NextRequest) {
  const llms = new LLMs();
  const { user } = await getUser(req);
  const body: { prompt: string; storyMetadataId: string; brief?: string } =
    await req.json();
  const { prompt, storyMetadataId, brief } = body;
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

  const briefData = {
    title: "Writer brief",
    prompt: brief || "",
  };

  const stream = await llms
    .characterSheet({
      storyMetadataId,
    })
    .createStream({
      messages: [{ content: template }],
      async onCompletion(completion) {
        await prisma.$transaction([
          prisma.characterSheet.deleteMany({
            where: {
              storyMetadataId,
            },
          }),
          prisma.writerBrief.deleteMany({
            where: {
              storyMetadataId,
            },
          }),
        ]);
        await prisma.$transaction([
          prisma.storyMetadata.update({
            where: {
              id: storyMetadataId,
              userId: user.id,
            },
            data: {
              prompt,
              WriterBrief: {
                create: {
                  ...briefData,
                },
              },
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
