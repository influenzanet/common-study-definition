import { Study } from "case-editor-tools/types/study";
import { StudyRulesBuilder } from "./rules";
import { IntakeDef } from "./surveys/intake";
import { WeeklyDef } from "./surveys/weekly";
import { VaccinationDef } from "./surveys/vaccination";
import { SurveyDefinition } from "case-editor-tools/surveys/types";
import { StudyRules } from "case-editor-tools/types/studyRules";
import { StudyBuilder } from "../../tools/study";
import { SurveyKeys } from "./keys";

export class CommonStudyBuilder extends StudyBuilder {

    constructor() {
        super('common');

    }

    build() {

        const intake = new IntakeDef();
        const weekly = new WeeklyDef();
        const vacc = new VaccinationDef();

        this.surveys = [
            intake,
            weekly,
            vacc
        ];

        // Keys inform the rules builder of the key of all dependent questions
        const keys: SurveyKeys = {
            intake: intake,
            weekly: weekly,
            vaccination: vacc,
        };

        const builder = new StudyRulesBuilder(keys);

        this.studyRules = builder.build();

    }

}
