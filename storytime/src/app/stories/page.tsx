"use client";

import { trpc } from "@/utils/trpc";
import Link from "next/link";
import React from "react";

export default function Stories() {
  let { data: stories, isLoading, isFetching } = trpc.listStoryMeta.useQuery();
  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 20,
      }}
    >
      <Link href="/stories/new">Create new story</Link>
      {stories?.map((story) => (
        <div
          key={story.id}
          style={{ border: "1px solid #ccc", textAlign: "center" }}
        >
          <Link href={`/stories/${story.id}`}>
            <img
              src={`https://robohash.org/${story.id}?set=set2&size=180x180`}
              alt={story.title}
              style={{ height: 180, width: 180 }}
            />
            <h3>{story.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
}
