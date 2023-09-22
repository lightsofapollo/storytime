"use client";

import { Container } from "@mui/material";
import { useCompletion } from "ai/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  id: string;
  title: string;
  hasSummary: boolean;
};

export default function EnterSummary({ id, title, hasSummary }: Props) {
  const router = useRouter();
  const { completion, isLoading, complete, stop } = useCompletion({
    api: "/api/ai/summary",
    body: { storyMetadataId: id },
    onFinish() {
      if (!hasSummary) {
        router.push(`/stories/${id}/create_memories`);
      }
    },
  });

  useEffect(() => {
    if (!hasSummary) {
      complete("");
      return () => stop();
    }
  }, [hasSummary]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    complete("");
    e.preventDefault();
  }

  return (
    <Container>
      <h1>Generate Story Summary{title}</h1>
      <form onSubmit={handleSubmit}>
        <Container>
          <button disabled={isLoading} type="submit">
            Generate summary
          </button>
        </Container>
      </form>
      <Container>
        <h3>Summary results</h3>
        <ReactMarkdown>{completion}</ReactMarkdown>
        {hasSummary && (
          <Link href={`/stories/${id}/create_memories`}>Memories</Link>
        )}
      </Container>
    </Container>
  );
}
