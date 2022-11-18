import { Logger } from "case-editor-tools/logger";

/**
 * Response encoding Utilities
 * Encoding tools propose structure to define the encoding of responses of items associating them with a meaning full name
 *
 */

/**
 * Encoding for a question/item
 * Each entry key is a human readable name for the encoding value and value the actual encoding for the response
 *
 * The purpose of this structure is to be used in place of the literal value of the encoding value
 * Example:
 * ```
 *  const my_question = {
 *      yes: '1',
 *      no: '0'
 *   } as const;
 * ```
 *
 * use my_question.yes, instead of '1' literal value, since it adds sematic to the code
 *
 */
export interface EncodingSet {
    // Key = Name (human readable) of the response, value : code for the response
    [key:string]: string
};

/**
 * Collection of EncodingSet
 * For example a collection can regroup all question encoding of given a survey
 * key is a human readable name of the encoding set (like a name of the question) like 'birth_date'
 * It's not the same of the question key (usually not meaning full)
 */
export interface EncodingCollection {
    [key:string]: EncodingSet
}


/**
 * Rebuild library without some keys
 * @param l
 * @param without
 * @returns
 */
export const omitCodes = (l: EncodingCollection, ...without: string[]): EncodingCollection => {
    const o: EncodingCollection = {};
    const excluded = new Set<string>(without);
    Object.entries(l).forEach(e => {
        const name = e[0];
        const codes = e[1];
        if(excluded.has(name)) {
            return;
        }
        o[name] = codes;
    });
    return o;
}

/***
 * Check values are unique in an encoding dict, return duplicates if exists
 */
const check_encoding = (o:EncodingSet): Map<string, string[]> => {
    const codes = new Set<string>();
    const duplicates: Map<string, string[]> = new Map();

    const add = (code:string, name: string)=> {
        const d = duplicates.get(code) ?? [];
        if(d.length == 0) {
            duplicates.set(code, d);
        }
        d.push(name);
    }

    Object.entries(o).forEach(e=>{
        const code = e[1];
        if(codes.has(code)) {
            add(code, e[0] );
        }
    });
    return duplicates;
}

/***
 * Check a encoding library
 * Check that all values are unique in each encoding set
 */
export const check_encoding_collection = (l: EncodingCollection):void =>{
    Object.entries(l).forEach(e => {
        const name = e[0];
        const codes = e[1];
        const dup = check_encoding(codes);
        if(dup.size > 0) {
            dup.forEach( (names, key) => {
                Logger.error("Duplicate encoding in "+ name +" for key "+ key + " in " + names.join(','));
            });
        }
    });
}
