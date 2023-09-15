import { Container } from "@mui/material";

type Props = {
  id: number;
  title: string;
};

export default function EnterSummary({ id, title }: Props) {
  return (
    <Container>
      <h1>Enter Summary {title}</h1>
    </Container>
  );
}
