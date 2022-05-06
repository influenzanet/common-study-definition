import { Logger } from "case-editor-tools/logger/logger";
import { isArrayLiteralExpression } from "typescript";

type TranslateArray = [string, string][];
type TranslateMap = Map<string,string>;

/**
 * Language "key" to use for the reference text
 */
const referenceKey:string = "en";

/**
 * Language key for the translation id
 */
const idKey:string = "id";

/**
 * Language key for the translation alternate key (can be used for a very common text to be used as a fallback)
 */
const altKey:string = "alt";

/**
 * Language key for the 'any language' placeholder
 */
const anyKey:string = "any";

export class LanguageMap extends Map<string, string> {

  constructor(text: TranslateArray ) {

    const textMap = new Map(text);
    const key = textMap.get(idKey) || "default";
    const reference = textMap.get(referenceKey);
    if (textMap.get(anyKey) === undefined) {
        const alt = textMap.get(altKey);
        const t = LanguageHelpers.findTranslations(key, reference, alt);
        text.push(...t);
    }
    super(text);
  }
}

export class LanguageHelpers {

  static languages: Map<string, any> = new Map();

  /**
   * Missing keys by language => (key=>reference text)
   */
  static missing: Map<string, TranslateMap>= new Map();

  /**
   *
   * @param languageId language id of this translation set
   * @param translations Translation set, list of named object. The key is the translation text id, each entry is a key value object with 2 entries, the 'en' text for reference text of the translation, the language code with the text to be used a the translated text in this language
   * @param source name of the source file (without .json extension) containing the loaded translation (to be used to generate missings)
   */
  static addLanguage(languageId: string, translations: any, source?:string) {
    console.log('registering translations for '+languageId, source);
    if (!LanguageHelpers.languages.has(languageId))
      LanguageHelpers.languages.set(languageId, {});

    let translations_ = LanguageHelpers.languages.get(languageId);
    translations = { ...translations_, ...translations };
    LanguageHelpers.languages.set(languageId, translations);
  }

  /**
   * Declare a key is missing for a given language
   * @param key Missing key
   * @param language language id
   */
  static setMissing(key: string, language: string, reference?:string) {
    var m = LanguageHelpers.missing.get(language);
    if(m == undefined) {
      m = new Map<string, string>();
      LanguageHelpers.missing.set(language, m);
    }
    m.set(key, typeof(reference) == "undefined" ? "_unknown_" : reference);
  }

  static getStrings(key: string, reference?: string): string {
    return "[ERROR] Translation missing";
  }

  /**
   * Find translations for a given key id, if not exists try to use alt key if provided
   * @param id
   * @param reference
   * @param alt
   * @returns
   */
  static findTranslations(id: string, reference?: string, alt?:string ): TranslateArray {
    const text : TranslateArray = [];

    LanguageHelpers.languages.forEach((translations, languageId) => {

        // Find a translation in the current set
        const get_trans = (key:string): [string,string]|undefined => {

            if(!(key in translations)) {
                return undefined;
            }

            if (reference && translations[key][referenceKey] !== reference) {
                Logger.warn(`[WARNING] string ${key}[${languageId}] does not match survey definition!`);
                Logger.warn(`"${translations[key][referenceKey]}" !== "${reference}"\n`);
              }

              var trans = translations[key][languageId];
              if(trans == "TODO") {
                trans = "TODO[" + reference + ']';
              }
            return [languageId, trans]
        }

        var trans;

        trans = get_trans(id);
        if(!trans && alt) {
            trans = get_trans(alt);
        }

        if(trans) {
            text.push(trans);
        } else {
          LanguageHelpers.setMissing(id, languageId, reference);
          console.warn(`Missing ${id} for ${languageId}`);
        }

      });
      return text;
  }

}

/**
 * Language translation entry helper
 * @param id id of the translations
 * @param en english base version (This english version is targeting translators more than participants)
 * @param alt alternate key to be used as a fallback id if the translation is not found for id
 * @returns
 */
 export function _T(id:string, en:string, alt?:string): LanguageMap {

    const t : TranslateArray= [];

    if(alt) {
        t.push([altKey, alt]);
    }

    return  new LanguageMap([
        [idKey, id],
        [referenceKey, en],
        ...t
    ]);
  }

  export function _T_any(en:string):LanguageMap {
      return new LanguageMap([
          [anyKey, en]
      ]);
  }
