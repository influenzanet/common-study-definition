import { OptionDef } from "case-editor-tools/surveys/types";


export const default_input_option_style = [{ key: 'className', value: 'w-100' }] as const;

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
        style: Array.from(default_input_option_style),
        content: content,
        description: description
    };
}

interface OptionDefOpts extends Omit<OptionDef, "key" | "content" | "role"> {
    role?: string; // Override with optional property, will be set as 'option' by default
    defaultStyle?: boolean; // For input type can apply the default style
}

/**
 * Generic option definition generator
 * By default will generate a simple option
 * @param key
 * @param content
 * @param opts
 * @returns
 */
export const option_def = (key:string, content: Map<string,string>, opts?: OptionDefOpts): OptionDef => {
    const role = opts?.role ?? 'option';

    const o = {
        key: key,
        role: role,
        content: content,
        ...opts,
    };

    if(role == 'input' && opts?.defaultStyle && !opts?.style) {
        o.style = Array.from(default_input_option_style);
    }
    return o;
}
