import { CharacterSheetTemplate } from "../character_sheet";

describe("CharacterSheet", () => {
  it("should render template", () => {
    new CharacterSheetTemplate("story").format();
  });
});
