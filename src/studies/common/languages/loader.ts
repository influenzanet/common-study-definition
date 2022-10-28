
import { readdirSync } from 'fs';
import path from 'path';
import { LanguageHelpers } from './languageHelpers';
import { Translation, TranslationSet } from "./types";

/**
 * A translation file contents
 */
interface TranslationFile {
    translations: TranslationSet;
    name: string;
}

function loadModule(file:string):Promise<TranslationFile> {
    const name = path.basename(file, '.json');
    return new Promise<TranslationFile>(function(resolve, reject) {
        import(file).then(function(module:any) {
            resolve({'translations': module.default, name: name });
        }).catch(reason=>{
            reject(reason);
        })
    });
}

/**
 * Load all json in a directory
 * @param dir
 *
 * @returns
 */
export async function load(dir:string):Promise<TranslationFile[]> {

    console.log(dir);
    const files = readdirSync(dir, {withFileTypes: true})
    .filter(item => {
        !item.isDirectory() && item.name.endsWith('.json')
    })
    .map(item => loadModule(item.name));

    return Promise.all(files);
}

export async function loadLanguage(languageId: string, dir: string) {
    const transFiles = await load(dir);
    for(const trans of transFiles) {
        LanguageHelpers.addLanguage(languageId, trans.translations, trans.name);
    }
}
