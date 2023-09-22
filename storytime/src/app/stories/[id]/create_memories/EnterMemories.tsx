"use client";

import { parseMemoryOutput } from "@/parsers/memory";
import logger from "@/utils/logger";
import { trpc } from "@/utils/trpc";
import { Button, Container, FormControl } from "@mui/material";
import { useCompletion } from "ai/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function EnterMemories({
  id,
  title,
  hasMemories,
}: {
  id: string;
  title: string;
  hasMemories: boolean;
}) {
  const summary = trpc.getSummary.useQuery({ storyMetadataId: id });
  const router = useRouter();

  const { completion, complete, isLoading, handleSubmit, stop } = useCompletion(
    {
      api: "/api/ai/initial_memory",
      body: { storyMetadataId: id },
      onFinish() {
        if (!hasMemories) {
          router.push(`/stories/${id}/create_first_story`);
          return;
        }
      },
    }
  );

  useEffect(() => {
    if (!hasMemories) {
      complete("");
      return () => stop();
    }
  }, [hasMemories]);

  if (summary.isLoading) {
    return <div>Loading...</div>;
  }

  if (summary.error) {
    return <div>Error: {summary.error.message}</div>;
  }

  return (
    <Container>
      <h1>Enter Memories {title}</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <Button disabled={isLoading} onClick={() => complete("")}>
            (Re)Generate memories
          </Button>
        </FormControl>
      </form>
      <Container>
        <h3>Raw Memory results</h3>
        <ReactMarkdown>{completion}</ReactMarkdown>
        {hasMemories && (
          <Link href={`/stories/${id}/create_first_story`}>
            Next create first Story
          </Link>
        )}
      </Container>
    </Container>
  );
}
