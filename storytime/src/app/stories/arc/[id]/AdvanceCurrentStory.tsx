import { trpc } from "@/utils/trpc";
import AdvanceStory from "../../[id]/AdvanceStory";

export default function AdvanceCurrentStory({ id }: { id: string }) {
  const query = trpc.getStory.useQuery({ id });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>{query.error.message}</div>;
  }

  return <AdvanceStory story={query.data!} />;
}
