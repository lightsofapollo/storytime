import { api } from "@/trpc/server";
import EnterMemories from "./EnterMemories";

export default async function CreateMemories({
  params: { id },
}: {
  params: { id: string };
}) {
  const meta = await api.getStoryState.query({ id });
  if (!meta) {
    return <div>Story not found</div>;
  }
  return <EnterMemories {...meta} />;
}
