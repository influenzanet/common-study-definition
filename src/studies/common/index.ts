import { Study } from "case-editor-tools/types/study";
import { studyRules } from "./rules";
import { Intake } from "./surveys/intake";
import { Weekly } from "./surveys/weekly";
import { Vaccination } from "./surveys/vaccination";


export const CommonStudy: Study = {
    studyKey: 'common',
    outputFolderName: 'common',
    surveys: [
        Intake,
        Weekly,
        Vaccination
    ],
    studyRules: studyRules,
}