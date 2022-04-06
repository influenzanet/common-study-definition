import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { expWithArgs } from "case-editor-tools/surveys/utils/simple-generators";
import { ComponentGenerators } from "case-editor-tools/surveys/utils/componentGenerators";
import { LanguageMap } from "../languages"
import { responseGroupKey, singleChoiceKey, multipleChoiceKey } from "case-editor-tools/constants/key-definitions";

/**
 * Single choice key prefix (rg.scg)
 */
export const singleChoicePrefix = [responseGroupKey, singleChoiceKey].join('.');

/**
 * Multiple choice key prefix (rg.scg)
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
 * @param id
 * @returns
 */
export function text_select_all_apply(id:string) {
    return   ComponentGenerators.text({
            className: "mb-2",
            content:
                new LanguageMap([
                    ["id", id],
                    ["en", 'Select all options that apply'],
                ])
        });
}

export function text_why_asking(id:string) {
    return {
        content: new LanguageMap([
            ["id", id],
            ["en", "Why are we asking this?"],
        ]),
        style: [{ key: 'variant', value: 'h5' }],
    };
}

export function text_how_answer(id:string) {
    return {
        content: new LanguageMap([
            ["id", id],
            ["en", "How should I answer this question?"],
        ]),
        style: [{ key: 'variant', value: 'h5' }],
    };
}
