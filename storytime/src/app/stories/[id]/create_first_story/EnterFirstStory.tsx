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
  const { completion, isLoading, complete, handleSubmit } = useCompletion({
    api: "/api/ai/initial_story",
    body: { storyMetadataId: id },
    onFinish() {
      if (!hasStories) {
        router.push(`/stories/${id}/`);
      }
    },
  });

  useEffect(() => {
    if (!hasStories) {
      complete("");
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
