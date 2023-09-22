-- CreateTable
CREATE TABLE "WriterBrief" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "storyMetadataId" UUID NOT NULL,

    CONSTRAINT "WriterBrief_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WriterBrief_storyMetadataId_key" ON "WriterBrief"("storyMetadataId");

-- AddForeignKey
ALTER TABLE "WriterBrief" ADD CONSTRAINT "WriterBrief_storyMetadataId_fkey" FOREIGN KEY ("storyMetadataId") REFERENCES "StoryMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
