import prisma from "@/utils/db";
import { Session, getSession } from "@auth0/nextjs-auth0";
import { User } from "@prisma/client";
import { NextRequest } from "next/server";

export async function getUser(req: NextRequest): Promise<{
  user: User;
  session: Session;
}> {
  const session = await getSession(req, {} as any)!;
  if (!session) {
    throw new Error("Session is null");
  }
  const user = await prisma.user.upsert({
    where: {
      foreignId: session.user.sub,
    },
    create: {
      foreignId: session.user.sub,
    },
    update: {},
  });

  return { session, user };
}
