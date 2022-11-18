import { Logger } from "case-editor-tools/logger/logger";
import { Study } from "case-editor-tools/types/study";
import { generateFilesForStudy } from 'case-editor-tools/exporter';
import { writeFileSync } from "fs";
import { LanguageHelpers } from "../studies/common/languages/languageHelpers";
import { Translation, TranslationSet } from "../studies/common/languages";
import { StudyChecker } from "./checker";
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

export const selectFromStudyKey = (studies: Study[]): Study[] => {
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
    return to_build;
}

interface ExporterOpts {
    missing? : boolean;
    check?: boolean;
}

/**
 *
 * @param studies
 */
export function study_exporter(studies: Study[], o?: ExporterOpts|boolean) {

    if(typeof(o) == "boolean") {
       Logger.warn("Using old study_exporter() behaviour, do not accept boolean as second argument any more");
       o = {};
    }

    const opts = Object.assign(o ?? {}, {missing: true, check:true});

    const outputBase = './output';
    studies.forEach(study => {

        const output = outputBase + '/' +(study.outputFolderName ?? study.studyKey);

        LanguageHelpers.missing.clear();

        generateFilesForStudy(study, true);

        if(opts.check) {
            const checker = new StudyChecker(study);
            const result = checker.check();
            if(result.size > 0) {
                result.forEach((r, key) => {
                    const n = r.problems.length;
                    Logger.warn(`check for ${key} has ${n} problems`);
                });
                console.log(result);
            }
            json_export(output + '/checks.json', result);
        }

        if(opts.missing) {
            console.log("Build missing translation file");
            buildMissing(output);
        }
    });
}

export function buildMissing(outputFolder:string) {

    console.log(LanguageHelpers.missing);
    LanguageHelpers.missing.forEach((missingKeys, language) =>{
        const m : TranslationSet = {};
        missingKeys.forEach((ref, key)=>{
            const t: Translation = {
                "en": ref,
            };
            t[language] = "_TODO_";
            m[key] = t;
        });

        const file = outputFolder + '/missing-' + language + '.json';
        console.log("Missing file " + file);
        json_export(file, m);

    });
}

export function json_export(filename:string, object:any, pretty?: number) {
    writeFileSync(filename, JSON.stringify(object, undefined, pretty ? 2 : undefined));
}

