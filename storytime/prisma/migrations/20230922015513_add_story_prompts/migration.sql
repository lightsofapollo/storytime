-- CreateTable
CREATE TABLE "StoryPrompts" (
    "id" UUID NOT NULL,
    "prompt" TEXT NOT NULL,
    "storyId" UUID NOT NULL,

    CONSTRAINT "StoryPrompts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StoryPrompts" ADD CONSTRAINT "StoryPrompts_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
