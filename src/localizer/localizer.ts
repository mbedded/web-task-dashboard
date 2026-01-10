export class Localizer {
  // Use EN as the default language
  private locale: string = "en";
  private texts: Record<string, Record<string, string>> = {};

  public constructor() {
  }

  public initialize(texts: Record<string, Record<string, string>>) {
    if (texts == null) {
      throw Error("Localizer cannot be initialized using empty texts");
    }

    this.texts = texts;
  }

  public setLocale(locale: string) {
    this.locale = locale;
  }

  public isLocale(locale: string) {
    return this.texts.hasOwnProperty(locale);
  }

  public add(locale: string, values: Record<string, string>) {
    this.texts[locale] = values;
  }

  public translate(key: string, data: Record<string, string> = {}): string {
    if (!key) {
      throw new Error("Parameter 'key' is required");
    }

    if (this.isLocale(this.locale) == false) {
      return key;
    }

    const text = this.texts[this.locale][key] ?? key;
    return this.interpolate(text, data);
  }

  private interpolate(text: string, data: Record<string, string>): string {
    return text.replace(/{(\w+)}/g, (match, key) => {
      return data.hasOwnProperty(key) ? data[key] : match;
    });
  }

  public reset() {
    this.locale = "en";
    this.texts = {};
  }
}

const localizer = new Localizer();
const t = localizer.translate.bind(localizer);

export { t, localizer as Instance };
export default localizer;
