import { parseMemoryOutput } from "@/parsers/memory";
import logger from "@/utils/logger";
import { trpc } from "@/utils/trpc";
import { Container, FormControl } from "@mui/material";
import { useCompletion } from "ai/react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function EnterMemories({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const summary = trpc.getSummary.useQuery({ storyMetadataId: id });
  const memoryMutation = trpc.createStoryMemories.useMutation();

  const { completion, complete } = useCompletion({
    api: "/api/ai/memory",
    body: { storyMetadataId: id },
    onFinish(prompt, completion) {
      const stream = parseMemoryOutput(completion);
      memoryMutation
        .mutateAsync({
          storyMetadataId: id,
          memories: stream,
        })
        .then(() => {
          logger.info("saved memories");
        })
        .catch((e) => {
          console.error("failed to save memories", e);
        });
    },
  });

  useEffect(() => {
    if (summary.data?.summary) {
      complete(summary.data?.summary);
    }
  }, [summary.data?.summary]);

  if (summary.isLoading) {
    return <div>Loading...</div>;
  }

  if (summary.error) {
    return <div>Error: {summary.error.message}</div>;
  }

  return (
    <Container>
      <h1>Enter Memories {title}</h1>
      <FormControl></FormControl>
      <Container>
        <h3>Raw Memory results</h3>
        <ReactMarkdown>{completion}</ReactMarkdown>
      </Container>
    </Container>
  );
}
