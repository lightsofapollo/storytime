import { Container, TextField } from "@mui/material";
import { useCompletion } from "ai/react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";

type Props = {
  id: number;
  title: string;
};

export default function EnterCharacterSheet({ id, title }: Props) {
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
  });

  return (
    <Container>
      <h1>Enter Character Sheet {title}</h1>
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
      </Container>
    </Container>
  );
}
