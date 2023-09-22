"use client";

import { Container } from "@mui/material";
import { useCompletion } from "ai/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  id: string;
  title: string;
  hasStories: boolean;
};

export default function EnterFirstStory({ id, title, hasStories }: Props) {
  const router = useRouter();
  const { completion, isLoading, complete, handleSubmit, stop } = useCompletion(
    {
      api: "/api/ai/initial_story",
      body: { storyMetadataId: id },
      onFinish() {
        router.push(`/stories/${id}/?time=${Date.now()}`);
      },
    }
  );

  useEffect(() => {
    if (!hasStories) {
      complete("");
      return () => stop();
    }
  }, [hasStories]);

  return (
    <Container>
      <h1>Generate Story{title}</h1>
      <form onSubmit={handleSubmit}>
        <Container>
          <button
            disabled={isLoading}
            onClick={() => {
              complete("");
            }}
            type="submit"
          >
            Generate story
          </button>
        </Container>
      </form>
      <Container>
        <h3>Story</h3>
        <ReactMarkdown>{completion}</ReactMarkdown>
      </Container>
    </Container>
  );
}
