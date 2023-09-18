import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import ContinueStory from "./ContinueStory";
import logger from "@/utils/logger";

export default async function StoryPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const state = await api.getStoryState.query({ id });

  if (!state) {
    return <div>Story not found</div>;
  }

  if (!state.hasCharacterSheet) {
    redirect(`/stories/${id}/create_character_sheet`);
  } else if (!state.hasSummary) {
    redirect(`/stories/${id}/create_summary`);
  } else if (!state.hasMemories) {
    redirect(`/stories/${id}/create_memories`);
  } else if (!state.hasStories) {
    redirect(`/stories/${id}/create_first_story`);
  }

  return <ContinueStory state={state} />;
}
