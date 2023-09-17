"use client";

import { api } from "@/trpc/server";

type Props = {
  state: NonNullable<Awaited<ReturnType<typeof api.getStoryState.query>>>;
  story: NonNullable<Awaited<ReturnType<typeof api.getPreviousStory.query>>>;
};

export default function ContinueStory({ state, story }: Props) {}
