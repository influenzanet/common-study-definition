import { Item, SurveyDefinition } from "case-editor-tools/surveys/types";
import { Survey } from "survey-engine/data_types";

export interface SurveyKeys {

    intake: IntakeSurveyDefinition;
    weekly: WeeklySurveyDefinition;
    vaccination: SurveyDefinition;
}

export interface WeeklySurveyDefinition {
    key: string
    getSymptomEnd(): Item
}

export interface IntakeSurveyDefinition {
    key:string
    getBirthDateItem(): Item
}
