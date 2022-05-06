
/**
 * A translation entry is a set of key-value object
 * Each key is a language code (or a placeholder)
 */
export interface Translation {
    [language:string]: string;
}

/**
 * A translation set is a set of translation for a list of translation id
 * Each key is the translation text id, the object contains the translations for various languages.
 */
export interface TranslationSet {
    [key:string]: Translation;
};
