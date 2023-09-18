import { api } from "@/trpc/server";
import logger from "@/utils/logger";
import { Paper, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ReactMarkdown from "react-markdown";

type Props = {
  state: NonNullable<Awaited<ReturnType<typeof api.getStoryState.query>>>;
};

export default async function ContinueStory({ state }: Props) {
  logger.info("doing the fetch here", { state });
  const previousStory = await api.getPreviousStory.query({
    storyMetadataId: state.id,
  });

  if (!previousStory) {
    return <div>Story not found</div>;
  }
  console.log("render previous stor", previousStory);
  return (
    <Paper>
      <Grid2 container>
        <Grid2 spacing={2}>
          <Typography variant="h3">In The Previous Chapter</Typography>
          <ReactMarkdown>{previousStory.text}</ReactMarkdown>
        </Grid2>
      </Grid2>
    </Paper>
  );
}
