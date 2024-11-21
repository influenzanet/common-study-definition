import { ItemComponent } from "survey-engine/data_types";
import { textComponent, TextProps } from "../compat";
import { _T } from "../studies/common/languages";

/**
 * Text Componenet based on translated text
 */
export const transTextComponent = (id: string, ref:string, opts?: Omit<TextProps, "content">): ItemComponent => {
    return textComponent({
        key: id,
        content: _T(id, ref),
        ...opts
    });
}

/**
 * Simple translated text content (useable in Helpgroup content)
 * @param id id of the translation
 * @param ref reference text
 * @returns 
 */
export const trans_text = (id:string, ref:string) => {
    return {
        content : _T(id, ref)
    }
};

export interface ItemWithKey {
    key: string;
}

export interface ItemWithTransKey {
    transKey?: string;
}

type TranslatableItem = ItemWithKey & ItemWithTransKey;

/**
 * Produce translation for an item holding a key, adding a suffix
 * The item could also have a transKey entry indicating the specific prefix to use for translations
 * @param item 
 * @param name 
 * @param text 
 * @returns 
 */
export const trans_item = function(item: TranslatableItem, name: string, text: string) {
    const prefix = typeof(item.transKey) == "undefined" ? item.key : item.transKey;
    return _T(prefix + '.' + name, text);
}