import { api } from "@/trpc/server";
import logger from "@/utils/logger";
import { Container, Grid, Paper, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ReactMarkdown from "react-markdown";
import AdvanceStory from "./AdvanceStory";

type Props = {
  state: NonNullable<Awaited<ReturnType<typeof api.getStoryState.query>>>;
};

export default async function ContinueStory({ state }: Props) {
  const previousStory = await api.getPreviousStory.query({
    storyMetadataId: state.id,
  });

  if (!previousStory) {
    return <div>Story not found</div>;
  }
  return (
    <Paper>
      <Grid2 container>
        <Grid2 spacing={2}>
          <Typography variant="h3">In The Previous Chapter</Typography>
          <ReactMarkdown>{previousStory.text}</ReactMarkdown>
        </Grid2>
        <Grid2>
          <Typography variant="h3">Continue The Story</Typography>
          <AdvanceStory story={previousStory} />
        </Grid2>
      </Grid2>
    </Paper>
  );
}
