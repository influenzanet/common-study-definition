import { Logger } from "case-editor-tools/logger/logger";
import { Study } from "case-editor-tools/types/study";
import { generateFilesForStudy } from 'case-editor-tools/exporter';
import { writeFileSync } from "fs";
import { LanguageHelpers } from "../studies/common/languages/languageHelpers";
import { Translation, TranslationSet } from "../studies/common/languages";

const usage = () => {
    Logger.log("Expected command line arguments:")
    Logger.log("   - study=<studyKey>")
};

const readStudyKey = () => {
    if (process.argv.length < 3) {
        Logger.criticalError('Not enough arguments provided.')
        usage();
        process.exit(-1)
    }
    const args = process.argv.slice(2);
    const studyKeyArg = args.filter(arg => arg.includes("study="));
    if (!studyKeyArg || studyKeyArg.length < 1) {
        Logger.criticalError('Argument "study=<studyKey> is missing.')
        usage();
        process.exit(1)
    }

    return studyKeyArg[0].replace('study=', '');
}

/**
 *
 * @param studies
 * @param all
 */
export function study_exporter(studies: Study[], all?:boolean) {

    var to_build : Study[] = studies;

    if(!all) {
        const studyKey = readStudyKey();

        const to_build = studies.filter(study => {
            if (study.outputFolderName && study.outputFolderName === studyKey) {
                return true;
            }
            return study.studyKey === studyKey
        });
        if (!to_build || to_build.length < 1) {
            Logger.error(`No study find with key: ${studyKey}.`);
            process.exit(1)
        }
    }

    to_build.forEach(study => generateFilesForStudy(study, true));
}

export function buildMissing(outputFolder:string) {

    LanguageHelpers.missing.forEach((missingKeys, language) =>{
        const m : TranslationSet = {};
        missingKeys.forEach((ref, key)=>{
            const t: Translation = {
                "en": ref,
            };
            t[language] = "_TODO_";
            m[key] = t;
        });

        json_export(outputFolder + '/missing-'+language+'.json', m);

    });
}


export function json_export(filename:string, object:any, pretty?: number) {
    writeFileSync(filename, JSON.stringify(object, undefined, pretty ? 2 : undefined));
}

