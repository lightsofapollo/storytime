-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "foreignId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSheet" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "storyMetadataId" UUID NOT NULL,

    CONSTRAINT "CharacterSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" UUID NOT NULL,
    "summary" TEXT NOT NULL,
    "storyMetadataId" UUID NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" UUID NOT NULL,
    "chapter" INTEGER NOT NULL DEFAULT 0,
    "prompt" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "generated" BOOLEAN NOT NULL DEFAULT false,
    "storyMetadataId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionMemory" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "importance" INTEGER NOT NULL,
    "storyId" UUID,
    "storyMetadataId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecallMemory" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "timeAgo" TEXT NOT NULL,
    "storyId" UUID,
    "storyMetadataId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecallMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryMetadata" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "prompt" TEXT NOT NULL DEFAULT '',
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cost" (
    "id" UUID NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "action" TEXT NOT NULL,
    "storyMetadataId" UUID NOT NULL,
    "storyId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_foreignId_key" ON "User"("foreignId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterSheet_storyMetadataId_key" ON "CharacterSheet"("storyMetadataId");

-- CreateIndex
CREATE UNIQUE INDEX "Summary_storyMetadataId_key" ON "Summary"("storyMetadataId");

-- CreateIndex
CREATE UNIQUE INDEX "Story_chapter_storyMetadataId_key" ON "Story"("chapter", "storyMetadataId");

-- CreateIndex
CREATE INDEX "Cost_action_idx" ON "Cost"("action");

-- CreateIndex
CREATE INDEX "Cost_storyMetadataId_idx" ON "Cost"("storyMetadataId");

-- AddForeignKey
ALTER TABLE "CharacterSheet" ADD CONSTRAINT "CharacterSheet_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionMemory" ADD CONSTRAINT "ActionMemory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionMemory" ADD CONSTRAINT "ActionMemory_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecallMemory" ADD CONSTRAINT "RecallMemory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecallMemory" ADD CONSTRAINT "RecallMemory_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryMetadata" ADD CONSTRAINT "StoryMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;
