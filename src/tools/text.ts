import { ItemComponent } from "survey-engine/data_types";
import { textComponent, TextProps } from "../compat";
import { _T } from "../studies/common/languages";

/**
 * Text Componenet based on translated text
 */
export const transTextComponent = (id: string, ref:string, opts: Omit<TextProps, "content">): ItemComponent => {
    return textComponent({
        content: _T(id, ref),
        ...opts
    });
}