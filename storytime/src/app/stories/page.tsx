import { api } from "@/trpc/server";
import Link from "next/link";
import React from "react";

export default async function Stories() {
  let stories = await api.listStoryMeta.query();

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
