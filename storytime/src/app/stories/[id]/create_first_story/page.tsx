import { api } from "@/trpc/server";
import EnterFirstStory from "./EnterFirstStory";

export default async function CreateFirstStory({
  params: { id },
}: {
  params: { id: string };
}) {
  const meta = await api.getStoryState.query({ id });
  if (!meta) {
    return <div>Story not found</div>;
  }
  return <EnterFirstStory {...meta} />;
}
