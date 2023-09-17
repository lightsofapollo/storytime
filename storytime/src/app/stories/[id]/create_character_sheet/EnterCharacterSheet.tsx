"use client";

import logger from "@/utils/logger";
import { Container, TextField } from "@mui/material";
import { useCompletion } from "ai/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

type Props = {
  id: string;
  title: string;
  hasCharacterSheet: boolean;
};

export default function EnterCharacterSheet({
  id,
  title,
  hasCharacterSheet,
}: Props) {
  const router = useRouter();

  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/ai/character",
    body: { storyMetadataId: id },
    onFinish() {
      logger.info({ hasCharacterSheet }, "Finished generating character sheet");
      if (!hasCharacterSheet) {
        router.push(`/stories/${id}/create_summary`);
      }
    },
  });

  return (
    <Container>
      <h1>Generate Character Sheet {title}</h1>
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
          <button disabled={isLoading} type="submit">
            Generate
          </button>
        </Container>
      </form>
      <Container>
        <h3>Character sheet results</h3>
        <ReactMarkdown>{completion}</ReactMarkdown>
        {hasCharacterSheet && (
          <Link href={`/stories/${id}/create_summary`}>
            Next create summary
          </Link>
        )}
      </Container>
    </Container>
  );
}
