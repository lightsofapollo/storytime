"use client";

import { Container } from "@mui/material";

export default function StoryPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return <Container>{<h1>Story {id}</h1>}</Container>;
}
