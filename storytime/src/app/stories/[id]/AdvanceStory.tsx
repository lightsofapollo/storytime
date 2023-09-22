"use client";

import { api } from "@/trpc/server";
import { trpc } from "@/utils/trpc";
import { Button, Input, List, ListItem, ListItemButton } from "@mui/material";
import { Story } from "@prisma/client";
import { useCompletion } from "ai/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  story: Story;
};

type Choices = string[];

const REGEXP = /\s(.*)/;
const NON_LINES = /(next in the story)|(actions that could happen next)/i;

export default function AdvanceStory({ story }: Props) {
  const router = useRouter();
  const mutation = trpc.chooseStoryArc.useMutation();
  const [customPrompt, setCustomPrompt] = useState("");
  const [choices, setChoices] = useState<Choices>([]);
  const { complete, isLoading } = useCompletion({
    api: "/api/ai/advance_story",
    body: { storyMetadataId: story.storyMetadataId, storyId: story.id },
    onFinish(prompt, completion) {
      let finalChoices: string[] = [];
      completion.split("\n").forEach((line) => {
        line = line.trim();
        console.log({ line });
        if (!line || NON_LINES.test(line)) {
          return;
        }
        const matches = line.match(REGEXP);
        if (matches) {
          finalChoices.push(matches[1]);
        }
      });
      setChoices(finalChoices);
    },
  });

  useEffect(() => {
    complete("");
  }, []);

  if (isLoading) {
    return <div>Loading choices...</div>;
  }

  if (mutation.isLoading) {
    return <div>Saving choice...</div>;
  }

  if (mutation.error) {
    return <div>Error saving choice: {mutation.error.message}</div>;
  }

  return (
    <List>
      {choices.map((choice, idx) => {
        return (
          <ListItemButton
            key={idx}
            disabled={mutation.isLoading}
            onClick={() => {
              mutation
                .mutateAsync({
                  storyMetadataId: story.storyMetadataId,
                  prompt: choice,
                })
                .then((data) => {
                  router.push(`/stories/arc/${data.id}`);
                });
            }}
          >
            {choice}
          </ListItemButton>
        );
      })}
      <ListItem key={"custom"}>
        <Input type="text" onChange={(e) => setCustomPrompt(e.target.value)} />
        <Button
          onClick={() => {
            mutation
              .mutateAsync({
                storyMetadataId: story.storyMetadataId,
                prompt: customPrompt,
              })
              .then((data) => {
                router.push(`/stories/arc/${data.id}`);
              });
          }}
        >
          Use custom
        </Button>
        <Button
          disabled={mutation.isLoading || isLoading}
          onClick={() => {
            complete("");
          }}
        >
          Refresh options
        </Button>
      </ListItem>
    </List>
  );
}
