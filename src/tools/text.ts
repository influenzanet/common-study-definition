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