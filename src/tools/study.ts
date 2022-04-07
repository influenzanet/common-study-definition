import { SurveyDefinition } from "case-editor-tools/surveys/types";
import { Study } from "case-editor-tools/types/study";
import { StudyRules } from "case-editor-tools/types/studyRules";
import { Survey } from "survey-engine/data_types";

/**
 * StudyBuilder create a study definition object using dynamic loading
 * The instance of the survey class must be created after the language are loaded (avoid import side effect)
 */
export abstract class StudyBuilder {

    study: Study;

    studyRules?: StudyRules;

    surveys: SurveyDefinition[]

    getSurveys(): SurveyDefinition[] {
        return this.surveys;
    };

    getStudyRules(): StudyRules|undefined {
        return this.studyRules;
    }

    constructor(name:string, outputFolder?: string ) {

        this.surveys = [];

        this.study = {
            studyKey: name,
            outputFolderName: outputFolder ? outputFolder : name,
            surveys: [],
        };

    }

    /*
    * Build method has to be called when all the environment is ready (after translations loaded)
    * And has to initialize surveys
    */
    abstract build():void;

    getStudy(): Study {

        this.study.surveys = this.getSurveys();
        this.study.studyRules = this.getStudyRules();

        return this.study;
    }

}
