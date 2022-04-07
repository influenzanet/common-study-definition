import {  _T } from "../languages"
import { SurveyItem, SurveyGroupItem, ExpressionName } from "survey-engine/data_types";
import { Item, SurveyDefinition } from "case-editor-tools/surveys/types";
import  * as pool from "../questionPools/intakeQuestions";

export class IntakeDef extends SurveyDefinition {

    items: Item[];

    Q_birthdate: Item;

    constructor() {

        super({
            surveyKey: 'intake',
            name: _T("intake.name.0", "Intake questionnaire"),
            description: _T("intake.description.0", "The purpose of the background questionnaire is to find out a little more about each user."),
            durationText: _T( "intake.typicalDuration.0", "Duration 5-10 minutes")
        });

        this.items = [];

        const rootKey = this.key;

        const Q_gender = new pool.Gender(rootKey, true);

        this.items.push(Q_gender);

        const Q_birthdate = new pool.DateOfBirth(rootKey, true);
        this.Q_birthdate = Q_birthdate;

        this.items.push(Q_birthdate);


        const Q_postal = new pool.PostalCode(rootKey, true);
        this.items.push(Q_postal);

        const Q_main_activity = new pool.MainActivity(rootKey, true);
        this.items.push(Q_main_activity);

        const Q_postal_work = new pool.PostalCodeWork(rootKey, Q_main_activity.key, true);
        this.items.push(Q_postal_work);

        const Q_work_type = new pool.WorkTypeEurostat(rootKey, Q_main_activity.key, true);
        this.items.push(Q_work_type);

        const Q_highest_education = new pool.HighestEducation(rootKey, Q_birthdate.key, true);
        this.items.push(Q_highest_education);

        const Q_people_met = new pool.PeopleMet(rootKey, true);
        this.items.push(Q_people_met);

        const Q_age_groups = new pool.AgeGroups(rootKey, true);
        this.items.push(Q_age_groups);

        const Q_people_at_risk = new pool.PeopleAtRisk(rootKey, Q_age_groups.key, true);
        this.items.push(Q_people_at_risk);

        const Q_children_in_school = new pool.ChildrenInSchool(rootKey, Q_age_groups.key, true);
        this.items.push(Q_children_in_school);

        const Q_means_of_transport = new pool.MeansOfTransport(rootKey, true);
        this.items.push(Q_means_of_transport);

        const Q_common_cold_frequ = new pool.CommonColdFrequency(rootKey, true);
        this.items.push(Q_common_cold_frequ);

        const Q_regular_medication = new pool.RegularMedication(rootKey, true);
        this.items.push(Q_regular_medication);

        const Q_pregnancy = new pool.Pregnancy(rootKey, Q_gender.key, Q_birthdate.key, true);
        this.items.push(Q_pregnancy);

        const Q_pregnancy_trimester = new pool.PregnancyTrimester(rootKey, Q_gender.key, Q_birthdate.key, Q_pregnancy.key, true);
        this.items.push(Q_pregnancy_trimester);

        const Q_smoking = new pool.Smoking(rootKey, true);
        this.items.push(Q_smoking);

        const Q_allergies = new pool.Allergies(rootKey, true);
        this.items.push(Q_allergies);

        const Q_special_diet = new pool.SpecialDiet(rootKey, true);
        this.items.push(Q_special_diet);

        const Q_homeopathic_meds = new pool.HomeophaticMedicine(rootKey, true);
        this.items.push(Q_homeopathic_meds);

        const Q_find_platform = new pool.FindOutAboutPlatform(rootKey, true);
        this.items.push(Q_find_platform);

        const surveyEndText = new pool.FinalText(rootKey);
        this.items.push(surveyEndText);
    }

    getBirthDateKey():string {
        return this.Q_birthdate.key;
    }

    buildSurvey() {
        const prefillRules = []

        for (const item of this.items) {

            const surveyItem = item.get();

            this.addItem(surveyItem);

            prefillRules.push(
                {
                    name: <ExpressionName>"GET_LAST_SURVEY_ITEM",
                    data: [
                        { str: "intake" },
                        { str: surveyItem.key }
                    ]
                }
            );
        }

        this.editor.setPrefillRules(prefillRules);
    }
}

