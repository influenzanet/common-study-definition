import { OptionDef } from "case-editor-tools/surveys/types";

/**
 * Helper to create a simple option component
 * @param key
 * @param content
 * @param opts
 * @returns
 */
export function as_option(key:string, content: Map<string,string>): OptionDef {

    return {
        role: 'option',
        key: key,
        content: content,
    }
}

export function as_input_option(key:string, content: Map<string,string>, description?: Map<string, string>  ): OptionDef {
    return {
        key: key,
        role: "input",
        style: [{ key: 'className', value: 'w-100' }],
        content: content,
        description: description
    };
}
