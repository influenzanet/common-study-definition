import { Logger } from "case-editor-tools/logger/logger";

export class LanguageMap extends Map<string, string> {

  constructor(text: [string, string][]) {

    const textMap = new Map(text);
    const key = textMap.get("id") || "default";
    const reference = textMap.get("en");

    if (textMap.get("any") === undefined) {
      LanguageHelpers.languages.forEach((translations, languageId) => {
        if (key in translations) {
          if (reference && translations[key]["en"] !== reference) {
            Logger.warn(`[WARNING] string ${key}[${languageId}] does not match survey definition!`);
            Logger.warn(`${translations[key]["en"]} !== ${reference}\n`);
          }
          text.push([languageId, translations[key][languageId]]);
        }
        else {
          Logger.warn(`[WARNING] missing key ${key}[${languageId}] in`);
          console.log(textMap);
        }
      });
    }

    super(text);
  }
}

export class LanguageHelpers {

  static languages: Map<string, any> = new Map();

  static addLanguage(languageId: string, translations: any) {

    if (!LanguageHelpers.languages.has(languageId))
      LanguageHelpers.languages.set(languageId, {});

    let translations_ = LanguageHelpers.languages.get(languageId);
    translations = { ...translations_, ...translations };
    LanguageHelpers.languages.set(languageId, translations);
  }

  static getStrings(key: string, reference?: string): string {
    return "[ERROR] Translation missing";
  }
}

/**
 * Language translation entry helper
 * @param id id of the translations
 * @param en english base version (This english version is targetting translators more than participants)
 * @returns
 */
export function _T(id:string, en:string): LanguageMap {
  return  new LanguageMap([
          ["id", id],
          ["en", en],
      ]);
}

export function _T_any(en:string) {
    return new LanguageMap([
        ["any", en]
    ]);
}
