import { Logger } from "case-editor-tools/logger/logger";
import { Study } from "case-editor-tools/types/study";
import { generateFilesForStudy } from 'case-editor-tools/exporter';
import { writeFileSync } from "fs";


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

export function study_exporter(studies: Study[]) {

    const studyKey = readStudyKey();

    const currentStudy = studies.filter(study => {
        if (study.outputFolderName && study.outputFolderName === studyKey) {
            return true;
        }
        return study.studyKey === studyKey
    });
    if (!currentStudy || currentStudy.length < 1) {
        Logger.error(`No study find with key: ${studyKey}.`);
        process.exit(1)
    }

    currentStudy.forEach(study => generateFilesForStudy(study, true));
}

export function json_export(filename:string, object:any, pretty?: number) {
    writeFileSync(filename, JSON.stringify(object, undefined, pretty ? 2 : undefined));
}

