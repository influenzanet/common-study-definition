import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { expWithArgs } from "case-editor-tools/surveys/utils/simple-generators";
//import { ComponentGenerators } from "case-editor-tools/surveys/utils/componentGenerators";
import { LanguageMap, _T } from "../languages"
import { responseGroupKey, singleChoiceKey, multipleChoiceKey } from "case-editor-tools/constants/key-definitions";
import { ItemComponent } from "survey-engine/data_types";
import { textComponent } from "../../../compat";

/**
 * Single choice key prefix (rg.scg)
 */
export const singleChoicePrefix = [responseGroupKey, singleChoiceKey].join('.');

/**
 * Multiple choice key prefix (rg.mcg)
 */
 export const MultipleChoicePrefix = [responseGroupKey, multipleChoiceKey].join('.');

/**
 * Validation constraint
 * @param editor
 * @param itemKey
 * @param responseGroupKey
 */
export function require_response(editor: ItemEditor, itemKey: string, responseGroupKey: string) {
    editor.addValidation({
        key: 'r1',
        type: 'hard',
        rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
    });
}

/**
 * Text component for "select all options apply"
 * @param id id of the translation to override the default common text
 * @returns
 */
export function text_select_all_apply(id:string) {
    return textComponent({
            key: "all_apply",
            className: "mb-2",
            content: trans_select_all_apply(id)
        });
}

/**
 * LocalizedText for "select all options that apply"
 * This function can be used in HelperGroup (text_select_all_apply return a component not handled here)
 * @param id
 * @returns
 */
export function trans_select_all_apply(id:string): LanguageMap {
    return _T(id, 'Select all options that apply', 'common.select_all_apply');
}

/**
 * Text component for "why are we asking this" part
 * @param id id of the translation to override the default common text
 * @returns
 */
export function text_why_asking(id:string) {
    return {
        key: "why_asking",
        content: _T(id, "Why are we asking this?", "common.why_are_we_asking"),
        style: [{ key: 'variant', value: 'h5' }],
    };
}

/**
 * Text component for "How should I answer this question?" part
 * @param id id of the translation to override the default common text
 * @returns
 */
export function text_how_answer(id:string) {
    return {
        key: "how_answer",
        content: _T( id, "How should I answer this question?", "common.how_should_i_answer"),
        style: [{ key: 'variant', value: 'h5' }],
    };
}
