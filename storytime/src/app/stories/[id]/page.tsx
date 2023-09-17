import { trpc } from "@/utils/trpc";
import { Container } from "@mui/material";
import EnterCharacterSheet from "./create_character_sheet/EnterCharacterSheet";
import EnterSummary from "./create_summary/EnterSummary";
import EnterMemories from "./create_memories/EnterMemories";
import EnterFirstStory from "./create_first_story/EnterFirstStory";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

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
  } else if (!state.hasMemories) {
  } else if (!state.hasStories) {
  }

  return <Container>Continue to the next step</Container>;
}
