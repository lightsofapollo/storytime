import { api } from "@/trpc/server";
import EnterCharacterSheet from "./EnterCharacterSheet";

export default async function CreateCharacterSheet({
  params: { id },
}: {
  params: { id: string };
}) {
  const meta = await api.getStoryState.query({ id });
  if (!meta) {
    return <div>Story not found</div>;
  }
  return <EnterCharacterSheet {...meta} />;
}
