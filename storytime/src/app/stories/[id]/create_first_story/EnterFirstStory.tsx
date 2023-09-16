import { Container } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useCompletion } from "ai/react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  id: string;
  title: string;
};

export default function EnterFirstStory({ id, title }: Props) {
  const { completion, isLoading, complete, handleSubmit } = useCompletion({
    api: "/api/ai/initial_story",
    body: { storyMetadataId: id },
    onFinish(prompt, completion) {
      // todo save story...
      // todo save memories for the story...
    },
  });

  useEffect(() => {
    complete("");
  }, []);

  return (
    <Container>
      <h1>Generate Story{title}</h1>
      <form onSubmit={handleSubmit}>
        <Container>
          <button disabled={isLoading} type="submit">
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
