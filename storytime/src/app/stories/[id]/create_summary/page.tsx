import { api } from "@/trpc/server";
import EnterSummary from "./EnterSummary";

export default async function CreateSummary({
  params: { id },
}: {
  params: { id: string };
}) {
  const meta = await api.getStoryState.query({ id });
  if (!meta) {
    return <div>Story not found</div>;
  }
  return <EnterSummary {...meta}></EnterSummary>;
}
