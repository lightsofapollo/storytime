"use client";

import type characters from "@/data/characters";
import logger from "@/utils/logger";
import { Card, Container, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useCompletion } from "ai/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import CharacterSelect from "./CharacterSelect";
import { useState } from "react";

type Props = {
  id: string;
  title: string;
  hasCharacterSheet: boolean;
  presetCharacters: typeof characters;
};

export default function EnterCharacterSheet({
  id,
  title,
  hasCharacterSheet,
  presetCharacters,
}: Props) {
  const router = useRouter();
  const [writerBrief, setWriterBrief] = useState("");
  const {
    completion,
    input,
    stop,
    isLoading,
    complete,
    setInput,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/ai/character",
    body: { storyMetadataId: id, brief: writerBrief },
    onFinish() {
      logger.info({ hasCharacterSheet }, "Finished generating character sheet");
      if (!hasCharacterSheet) {
        router.push(`/stories/${id}/create_memories`);
      }
    },
  });

  return (
    <Grid2 container>
      <Grid2 xs={12}>
        <Typography variant="h2">Create Character Sheet</Typography>
      </Grid2>
      <Grid2 xs={12}>
        <Container>
          <form onSubmit={handleSubmit}>
            <Container>
              <TextField
                fullWidth
                multiline
                placeholder="My primary character walks down the street"
                value={input}
                label="Prompt"
                onChange={handleInputChange}
              />
            </Container>
            <Container>
              <TextField
                multiline
                fullWidth
                placeholder="Optional writers brief to include in each story..."
                value={writerBrief}
                label="Writer Brief"
                onChange={(e) => {
                  setWriterBrief(e.target.value);
                }}
              />
            </Container>
            <Container>
              <button disabled={isLoading} type="submit">
                Generate
              </button>
            </Container>
          </form>
          <Container>
            <h3>Character sheet results</h3>
            <ReactMarkdown>{completion}</ReactMarkdown>
            {hasCharacterSheet && (
              <Link href={`/stories/${id}/create_memories`}>
                Next create memories
              </Link>
            )}
          </Container>
        </Container>
      </Grid2>
      <Grid2>
        {!isLoading && (
          <CharacterSelect
            presetCharacters={presetCharacters}
            onSelect={(character) => {
              setWriterBrief(character.brief || "");
              complete(character.prompt, {
                body: {
                  brief: character.brief,
                },
              });
              setInput(character.prompt);
            }}
          />
        )}
      </Grid2>
    </Grid2>
  );
}
