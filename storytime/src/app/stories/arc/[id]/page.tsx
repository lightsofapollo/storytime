import prisma from "@/utils/db";
import { Container, Paper, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import GenerateStory from "./GenerateStory";

export default async function StoryArc({
  params: { id },
}: {
  params: { id: string };
}) {
  const story = await prisma.story.findFirst({ where: { id } });
  if (!story) {
    return <div>Story not found</div>;
  }

  return (
    <Paper>
      <Typography variant="h3">Story Arc {story.chapter}</Typography>
      <Container>
        <ReactMarkdown>{story.prompt}</ReactMarkdown>
      </Container>
      <Container>
        <Typography variant="h4">Story</Typography>
        <GenerateStory story={story} />
      </Container>
    </Paper>
  );
}
