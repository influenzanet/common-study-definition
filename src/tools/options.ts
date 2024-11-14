import { OptionDef } from "case-editor-tools/surveys/types";
import { _T } from "../studies/common/languages";
import { ComponentProperties, Expression, ExpressionArg } from "survey-engine/data_types";
import { ClientExpression as client, isExpressionArg, isValidExpressionArg } from "./expressions";
import { QuestionType } from "../types/item";

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

/**
 * Make a list of options exclusive to the others
 * @param key key of the item containing the options
 * @param options options list
 * @param group list of option keys to be exclusives
 * @param otherGroup list of option keys complementary (if not defined, the key not in previous group are used)
 */
export const make_exclusive_options = (key: string, options: OptionDef[], group: string[], otherGroup?:string[])=> {
    const g2 = otherGroup ?? options.filter((o)=> !group.includes(o.key)).map(o => o.key);
   
    const g1Exclusive = client.multipleChoice.any(key, ...group);
    const g2Exclusive = client.multipleChoice.any(key, ...g2);

    options.forEach(o=>{
        if(group.includes(o.key)) {
            o.disabled = g2Exclusive;
        }
        if(g2?.includes(o.key)) {
            o.disabled = g1Exclusive;
        }
    });
}

const check_componenet_props = function(props: ComponentProperties) {
    
    const check = function(name: keyof ComponentProperties) {
        if(typeof(props[name]) === "undefined") {
            return ;
        }
        if(!isExpressionArg(props[name])) {
            throw new Error("ComponentProperties "+ name +" must be an ExpressionArg");
        }
        if(!isValidExpressionArg(props[name] as ExpressionArg)) {
            throw new Error("ComponentProperties "+ name +" must be a valid ExpressionArg");
        }
    }
    check('dateInputMode');
    check('max');
    check('min')
    check('stepSize'); 
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

    if(opts?.optionProps) {
        check_componenet_props(opts.optionProps);
    }

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

// Describe a question class with getResponses() method available
interface ItemWithResponses {
    key: string;
    getResponses(): OptionDef[];
}

// Helper to create condition from an Item class, exposing getResponse()
export const condition_builder = (item: ItemWithResponses, choiceType:QuestionType )=>{
    return new ConditionBuilder(item.key, choiceType,  item.getResponses());
}

// ConditionBuilder for choice (single/mutliple) question
// Simple helper for question without createConditionFrom available
// It creates condition based on response and check if response are 
export class ConditionBuilder {

    itemKey: string;

    choiceType: 'single'|'multiple'

    options: OptionDef[]

    constructor(itemKey: string, choiceType: 'single'|'multiple', options: OptionDef[]) {
        this.itemKey = itemKey;
        this.choiceType = choiceType;
        this.options = options;
    }

    createConditionFrom(...optionKeys: string[]):Expression {
        const keys = this.getOptionKeys();
        const unknown: string[] = [];
        optionKeys.forEach(k => {
            if(!keys.has(k)) {
                console.warn("Key "+ k +" is not defined for " + this.itemKey);
            }
        });
        if(this.choiceType == 'single') {
            return client.singleChoice.any(this.itemKey, ...optionKeys);
        } else {
            return client.multipleChoice.any(this.itemKey, ...optionKeys);
        }
    }
    
    getOptionKeys(): Set<string> {
        const keys = new Set<string>();
        this.options.forEach(o=> {
            keys.add(o.key);
        })
        return keys;
    }
}


