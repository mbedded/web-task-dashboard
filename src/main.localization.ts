/**
 * Localization has been outsourced to this file to keep the code and implementation together.
 * Especially the header and method may become long when more languages are added.
 * "localizer" provides a singleton, so it's safe to configure it here.
 */
import { LocalizerParser } from "./localizer/localizerParser";
import localizer from "./localizer/localizer";

const FALLBACK_LANGUAGE: string = "en"

export function setupLocalization() {
  // Setup languages
  const parsedTexts = new LocalizerParser().getParsedFiles();
  localizer.initialize(parsedTexts);


  // Get UI language or fallback
  let locale = window.localStorage.getItem("language");
  if (!locale || !localizer.isLocale(locale)) {
    locale = FALLBACK_LANGUAGE;
  }

  localizer.setLocale(locale);
}
