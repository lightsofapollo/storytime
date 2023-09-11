import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next/types";

export async function GET(req: NextApiRequest) {
  const session = await getSession();
  console.log(session);

  return NextResponse.json({
    jwt: session?.accessToken,
  });
}
