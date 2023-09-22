import { api } from "@/trpc/server";
import EnterCharacterSheet from "./EnterCharacterSheet";

export default async function CreateCharacterSheet({
  params: { id },
}: {
  params: { id: string };
}) {
  const [meta, presetCharacters] = await Promise.all([
    api.getStoryState.query({ id }),
    api.getPresetCharacters.query(),
  ]);
  if (!meta) {
    return <div>Story not found</div>;
  }
  return <EnterCharacterSheet {...meta} presetCharacters={presetCharacters} />;
}
