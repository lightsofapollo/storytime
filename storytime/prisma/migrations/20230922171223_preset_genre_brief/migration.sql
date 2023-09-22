-- CreateTable
CREATE TABLE "PresetGenreBrief" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "PresetGenreBrief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresetCharacter" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "PresetCharacter_pkey" PRIMARY KEY ("id")
);
