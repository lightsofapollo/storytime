"use client";

import { Button, Container, Typography } from "@mui/material";
import { Story } from "@prisma/client";
import { useCompletion } from "ai/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import AdvanceCurrentStory from "./AdvanceCurrentStory";

export default function GenerateStory({ story }: { story: Story }) {
  const [isComplete, setComplete] = useState(false);
  const { completion, complete, isLoading, stop } = useCompletion({
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
      return () => stop();
    }
  }, [story.generated]);

  return (
    <Container>
      <ReactMarkdown>
        {isLoading || isComplete ? completion : story.text}
      </ReactMarkdown>
      {(isComplete || story.generated) && !isLoading && (
        <AdvanceCurrentStory id={story.id} />
      )}
      <Container>
        <Button disabled={isLoading} onClick={() => complete("")}>
          Regenerate story
        </Button>
        <Button disabled={!isLoading} onClick={stop}>
          Stop
        </Button>
      </Container>
    </Container>
  );
}
