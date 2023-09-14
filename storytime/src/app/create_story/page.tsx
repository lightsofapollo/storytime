"use client";

import { trpc } from "@/utils/trpc";
import { redirect, useRouter } from "next/navigation";
import { Button, Container, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

type Inputs = {
  title: string;
};

export default function CreateStory() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();
  const mutation = trpc.createStoryMeta.useMutation();
  console.log(mutation);

  function onSubmit(data: Inputs) {
    console.log(data);
    mutation.mutate(data, {
      onSuccess: (result) => {
        console.log(`/stories/${result.id}`);
        router.push(`/stories/${result.id}`);
      },
    });
  }

  if (mutation.isLoading) {
    return (
      <Container>
        <h1>Creating story...</h1>
      </Container>
    );
  }

  if (mutation.isSuccess) {
    <Container>
      <h1>Story created!</h1>
    </Container>;
  }

  return (
    <Container>
      <Container>
        <h1>Create new story</h1>
      </Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <TextField label="title" {...register("title")} />
        </Container>
        <Container>
          <Button type="submit">Create</Button>
        </Container>
      </form>
    </Container>
  );
}
