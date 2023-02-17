import { OptionDef } from "case-editor-tools/surveys/types";
import { _T } from "../studies/common/languages";


export const default_input_option_style = [{ key: 'className', value: 'w-100' }] as const;

// Common roles available for options
export const optionRoles = {
    'option': 'option', // Only the label
    'text': 'text', // Text View
    'number': 'numberInput',
    'input': 'input',
    'time': 'timeInput',
    'date': 'dateInput', // Only available for singleChoice group
} as const;

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
 * Option input with automatic description "describe here"
 * The description text is using "common" text or use the trans id as translation text
 * @param key option key
 * @param content option content
 * @param trans translation id for the text "Describe here (optional)", if not available will lookup common text entry
 * @param opts other option parameters
 * @returns
 */
export const option_input_other = (key:string, content: Map<string,string>, trans:string, opts?:OptionDefOpts) => {
    const defaultStyle = opts?.defaultStyle ?? true;
    const o: OptionDefOpts = {
        ...opts,
        role: 'input',
        defaultStyle: defaultStyle,
        description: _T(trans, "Describe here (optional)", "common.other_describe_here")
    };
    return option_def(key, content, o )
}

/**
 * Generic option definition generator
 * By default will generate a simple option
 * @param key option key
 * @param content option content text
 * @param opts other option parameters. For input 'defaultStyle' option will add styles from @see{default_input_option_style}
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

/**
 * Manipulate an already existing option list
 * Can insert a new option before or after another existing one, or remove options
 */
export class OptionList {
    options: OptionDef[]

    constructor(options:OptionDef[]) {
        this.options = options;
    }

    /**
     *
     * @param key key to find and insert element after this element
     * @param oo list of options to add
     * @returns OptionList fluent interface
     */
    insertAfterKey(key:string, ...oo:OptionDef[]) {
        const index = this.indexOf(key);
        if(index < 0) {
            throw new Error("Option key '"+key+"' is not found in list");
        }
        this.insertAt(index + 1, ...oo);
        return this;
    }

    insertBeforeKey(key:string, ...oo:OptionDef[]) {
        const index = this.indexOf(key);
        if(index < 0) {
            throw new Error("Option key '"+key+"' is not found in list");
        }
        var i = index;
        if(i < 0) {
            i = 0;
        }
        this.insertAt(i, ...oo);
        return this;
    }

    indexOf(key:string):number {
        return this.options.findIndex((o)=>{
            return o.key == key;
        });
    }

    insertAt(index: number, ...oo:OptionDef[]) {
        this.options.splice(index, 0, ...oo);
        return this;
    }

    without(...keys:string[]) {
        this.options = this.options.filter((o)=> !keys.includes(o.key));
    }

    /**
     * Get options after update
     * @returns Get
     */
    values(): OptionDef[] {
        return this.options;
    }
}
