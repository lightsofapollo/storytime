-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "foreignType" TEXT NOT NULL,
    "foreignId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSheet" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "storyMetadataId" INTEGER NOT NULL,

    CONSTRAINT "CharacterSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" SERIAL NOT NULL,
    "summary" TEXT NOT NULL,
    "storyMetadataId" INTEGER NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "chapter" INTEGER NOT NULL DEFAULT 0,
    "storyMetadataId" INTEGER NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionMemory" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "importance" INTEGER NOT NULL,
    "storyId" INTEGER NOT NULL,
    "storyMetadataId" INTEGER NOT NULL,

    CONSTRAINT "ActionMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecallMemory" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "time_ago" TEXT NOT NULL,
    "storyId" INTEGER NOT NULL,
    "storyMetadataId" INTEGER NOT NULL,

    CONSTRAINT "RecallMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryMetadata" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "StoryMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_foreignId_key" ON "User"("foreignId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterSheet_storyMetadataId_key" ON "CharacterSheet"("storyMetadataId");

-- CreateIndex
CREATE UNIQUE INDEX "Summary_storyMetadataId_key" ON "Summary"("storyMetadataId");

-- AddForeignKey
ALTER TABLE "CharacterSheet" ADD CONSTRAINT "CharacterSheet_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionMemory" ADD CONSTRAINT "ActionMemory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionMemory" ADD CONSTRAINT "ActionMemory_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecallMemory" ADD CONSTRAINT "RecallMemory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecallMemory" ADD CONSTRAINT "RecallMemory_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryMetadata" ADD CONSTRAINT "StoryMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
