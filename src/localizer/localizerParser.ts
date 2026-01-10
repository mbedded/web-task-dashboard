import en from "locales/locale.en.json";

/**
 * This is a simple parser to flatten a given JSON object to a key-value dictionary.
 */
export class LocalizerParser {

  private files: [string, object][] = [
    ["en", en],
  ];

  public getParsedFiles(): Record<string, Record<string, string>> {
    const parsedData: Record<string, Record<string, string>> = {};

    for (const entry of this.files) {

      const parsed = this.parseObjectToKeyValues(entry[1]);
      parsedData[entry[0]] = parsed;
    }

    return parsedData;
  }

  private parseObjectToKeyValues(element: object): Record<string, string> {
    const entries: Record<string, string> = {};

    for (const [key, value] of Object.entries(element)) {
      if (typeof value === "string") {
        entries[key] = value;
        continue;
      }

      const newEntries = this.parseObjectToKeyValues(value);
      for (const entry in newEntries) {
        const newKey = `${key}.${entry}`;
        entries[newKey] = newEntries[entry];
      }
    }

    return entries;
  }

}

