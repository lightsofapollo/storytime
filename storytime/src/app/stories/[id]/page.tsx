"use client";

import { trpc } from "@/utils/trpc";
import { Container } from "@mui/material";
import EnterCharacterSheet from "./EnterCharacterSheet";
import EnterSummary from "./EnterSummary";
import EnterMemories from "./EnterMemories";
import EnterFirstStory from "./EnterFirstStory";

export default function StoryPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const query = trpc.getStoryState.useQuery({ id });

  if (query.isLoading) {
    return (
      <>
        <Container>{<h1>Story {id}</h1>}</Container>
        <Container>loading...</Container>
      </>
    );
  }

  if (query.isError) {
    return (
      <Container>
        <Container>{<h1>Story {id}</h1>}</Container>; Error:{" "}
        <Container>{query.error.message}</Container>
      </Container>
    );
  }

  if (query.data) {
    if (!query.data.hasCharacterSheet) {
      return (
        <EnterCharacterSheet id={query.data.id} title={query.data.title} />
      );
    }

    if (!query.data.hasSummary) {
      return <EnterSummary id={query.data.id} title={query.data.title} />;
    }

    if (!query.data.hasMemories) {
      return <EnterMemories id={query.data.id} title={query.data.title} />;
    }

    if (!query.data.hasStories) {
      return <EnterFirstStory id={query.data.id} title={query.data.title} />;
    }
  }

  return <div></div>;
}
