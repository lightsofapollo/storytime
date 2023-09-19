"use client";

import { Button, Container, Typography } from "@mui/material";
import { Story } from "@prisma/client";
import { useCompletion } from "ai/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import AdvanceCurrentStory from "./AdvanceCurrentStory";

export default function GenerateStory({ story }: { story: Story }) {
  const [isComplete, setComplete] = useState(false);
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/ai/next_story",
    body: {
      storyMetadataId: story.storyMetadataId,
      storyId: story.id,
      chapter: story.chapter,
    },
    onFinish(prompt, completion) {
      setComplete(true);
    },
  });

  useEffect(() => {
    if (!story.generated) {
      complete("");
    }
  }, [story.generated]);

  return (
    <Container>
      <ReactMarkdown>{story.text || completion}</ReactMarkdown>
      {(isComplete || story.generated) && !isLoading && (
        <AdvanceCurrentStory id={story.id} />
      )}
      <Container>
        <Button disabled={isLoading} onClick={() => complete("")}>
          Regenerate story
        </Button>
      </Container>
    </Container>
  );
}
