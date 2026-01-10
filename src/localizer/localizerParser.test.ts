import { expect, test } from "@jest/globals";
import { LocalizerParser } from "./localizerParser";

test("Ensure files are parsed correctly", () => {
  const sut = new LocalizerParser();
  const result = sut.getParsedFiles();
  const resultEn = result["en"];

  // Check language as such
  expect(result).toBeTruthy();
  expect(resultEn).toBeTruthy();
  // Check keys, normal and nested
  expect(resultEn["settings.tracks-username-header"]).toBe("Username");
});
