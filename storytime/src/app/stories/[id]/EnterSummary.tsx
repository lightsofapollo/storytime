import { Container, TextField } from "@mui/material";
import { useCompletion } from "ai/react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  id: number;
  title: string;
};

export default function EnterSummary({ id, title }: Props) {
  const {
    completion,
    input,
    stop,
    isLoading,
    complete,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/ai/summary",
    body: { storyMetadataId: id },
  });

  useEffect(() => {
    complete("");
  }, []);

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
      </Container>
    </Container>
  );
}
