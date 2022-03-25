import { LanguageMap } from "../languages"
import { SurveyItem, SurveyGroupItem, ExpressionName } from "survey-engine/lib/data_types";
import { SurveyDefinition } from "case-editor-tools/surveys/types";
import { IntakeQuestions as CommonPoolIntake } from "../questionPools/intakeQuestions";

class IntakeDef extends SurveyDefinition {

    items: SurveyItem[];
    Q_birthdate: SurveyItem;

    constructor() {
        super({
            surveyKey: 'intake',
            name: new LanguageMap([
                ["id", "intake.name.0"],
                ["en", "Intake questionnaire"],
            ]),
            description: new LanguageMap([
                ["id", "intake.description.0"],
                ["en", "The purpose of the background questionnaire is to find out a little more about each user."],
            ]),
            durationText: new LanguageMap([
                ["id", "intake.typicalDuration.0"],
                ["en", "Duration 5-10 minutes"],
            ])

        });

        this.items = [];

        const rootKey = this.key;

        const Q_gender = CommonPoolIntake.gender(rootKey, true);
        this.items.push(Q_gender);

        const Q_birthdate = CommonPoolIntake.dateOfBirth(rootKey, true);
        this.items.push(Q_birthdate);

        this.Q_birthdate = Q_birthdate;

        const Q_postal = CommonPoolIntake.postalCode(rootKey, true);
        this.items.push(Q_postal);

        const Q_main_activity = CommonPoolIntake.mainActivity(rootKey, true);
        this.items.push(Q_main_activity);

        const Q_postal_work = CommonPoolIntake.postalCodeWork(rootKey, Q_main_activity.key, true);
        this.items.push(Q_postal_work);

        const Q_work_type = CommonPoolIntake.workType(rootKey, Q_main_activity.key, true);
        this.items.push(Q_work_type);

        const Q_highest_education = CommonPoolIntake.highestEducation(rootKey, Q_birthdate.key, true);
        this.items.push(Q_highest_education);

        const Q_people_met = CommonPoolIntake.peopleMet(rootKey, true);
        this.items.push(Q_people_met);

        const Q_age_groups = CommonPoolIntake.ageGroups(rootKey, true);
        this.items.push(Q_age_groups);

        const Q_people_at_risk = CommonPoolIntake.peopleAtRisk(rootKey, Q_age_groups.key, true);
        this.items.push(Q_people_at_risk);

        const Q_children_in_school = CommonPoolIntake.childrenInSchool(rootKey, Q_age_groups.key, true);
        this.items.push(Q_children_in_school);

        const Q_means_of_transport = CommonPoolIntake.meansOfTransport(rootKey, true);
        this.items.push(Q_means_of_transport);

        const Q_common_cold_frequ = CommonPoolIntake.commonColdFrequency(rootKey, true);
        this.items.push(Q_common_cold_frequ);

        const Q_regular_medication = CommonPoolIntake.regularMedication(rootKey, true);
        this.items.push(Q_regular_medication);

        const Q_pregnancy = CommonPoolIntake.pregnancy(rootKey, Q_gender.key, Q_birthdate.key, true);
        this.items.push(Q_pregnancy);

        const Q_pregnancy_trimester = CommonPoolIntake.pregnancyTrimester(rootKey, Q_gender.key, Q_birthdate.key, Q_pregnancy.key, true);
        this.items.push(Q_pregnancy_trimester);

        const Q_smoking = CommonPoolIntake.smoking(rootKey, true);
        this.items.push(Q_smoking);

        const Q_allergies = CommonPoolIntake.allergies(rootKey, true);
        this.items.push(Q_allergies);

        const Q_special_diet = CommonPoolIntake.specialDiet(rootKey, true);
        this.items.push(Q_special_diet);

        const Q_homeopathic_meds = CommonPoolIntake.homeopathicMeds(rootKey, true);
        this.items.push(Q_homeopathic_meds);

        const Q_find_infectieradar = CommonPoolIntake.findPlatform(rootKey, true);
        this.items.push(Q_find_infectieradar);

        const surveyEndText = CommonPoolIntake.surveyEnd(rootKey);
        this.items.push(surveyEndText);

        const prefillRules = []
        for (const item of this.items) {
            prefillRules.push(
                {
                    name: <ExpressionName>"GET_LAST_SURVEY_ITEM",
                    data: [
                        { str: "intake" },
                        { str: item.key }
                    ]
                }
            );
        }

        this.editor.setPrefillRules(prefillRules);
    }

    buildSurvey() {
        for (const item of this.items) {
            this.addItem(item);
        }
    }
}

export const Intake = new IntakeDef();
