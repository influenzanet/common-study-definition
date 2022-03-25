import { LanguageMap } from "../languages"
import { SurveyItem, Expression, ExpressionName, ExpressionArg, SurveyGroupItem } from "survey-engine/lib/data_types";
import { SurveyDefinition } from "case-editor-tools/surveys/types";
import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { generateTitleComponent } from "case-editor-tools/surveys/utils/simple-generators";
import { WeeklyQuestions as CommonPoolWeekly } from "../questionPools/weeklyQuestions";

class WeeklyDef extends SurveyDefinition {

    items: SurveyItem[];
    Q_same_illnes: SurveyItem;

    constructor() {
        super({
            surveyKey: 'weekly',
            name: new LanguageMap([
                ["id", "weekly.name.0"],
                ["en", "Weekly questionnaire"],
            ]),
            description: new LanguageMap([
                ["id", "weekly.description.0"],
                ["en", "Please also report if you had no complaints."],
            ]),
            durationText: new LanguageMap([
                ["id", "weekly.typicalDuration.0"],
                ["en", "Duration 1-5 minutes"],
            ])
        });

        this.items = [];

        const rootKey = this.key

        // Symptoms Q1
        const Q_symptoms = CommonPoolWeekly.symptomps(rootKey, true);
        this.items.push(Q_symptoms);

        // // -------> HAS SYMPTOMS GROUP
        const hasSymptomGroup = CommonPoolWeekly.hasSymptomsGroup(rootKey, Q_symptoms.key);
        const hasSymptomGroupKey = hasSymptomGroup.key;

        // // Q2 same illnes --------------------------------------
        const Q_same_illnes = CommonPoolWeekly.sameIllnes(hasSymptomGroupKey, true);
        hasSymptomGroup.addItem(Q_same_illnes);
        this.Q_same_illnes = Q_same_illnes;

        // // Qcov3 pcr tested contact COVID-19--------------------------------------
        const Q_covidPCRTestedContact = CommonPoolWeekly.pcrTestedContact(hasSymptomGroupKey, true);
        hasSymptomGroup.addItem(Q_covidPCRTestedContact);

        // // Qcov3b household pcr contacts COVID-19--------------------------
        const Q_pcrHouseholdContact = CommonPoolWeekly.pcrHouseholdContact(hasSymptomGroupKey, Q_covidPCRTestedContact.key, true);
        hasSymptomGroup.addItem(Q_pcrHouseholdContact);

        // // Q3 when first symptoms --------------------------------------
        const Q_symptomStart = CommonPoolWeekly.symptomsStart(hasSymptomGroupKey, Q_same_illnes.key, true);
        hasSymptomGroup.addItem(Q_symptomStart);

        // // Q4 when symptoms end --------------------------------------
        const Q_symptomsEnd = CommonPoolWeekly.symptomsEnd(hasSymptomGroupKey, Q_symptomStart.key, true);
        hasSymptomGroup.addItem(Q_symptomsEnd);

        // // Q5 symptoms developed suddenly --------------------------------------
        const Q_symptomsSuddenlyDeveloped = CommonPoolWeekly.symptomsSuddenlyDeveloped(hasSymptomGroupKey, true);
        hasSymptomGroup.addItem(Q_symptomsSuddenlyDeveloped);

        // Q6 fever start questions
        // Separated into individual questions and Key code overriden to prevent Q6.a and keep Q6
        const Q_feverStart = CommonPoolWeekly.feverGroup.feverStart(hasSymptomGroupKey, Q_symptoms.key, Q_symptomStart.key, true, "Q6");
        hasSymptomGroup.addItem(Q_feverStart);

        // Q6b fever developed suddenly
        const Q_feverDevelopedSuddenly = CommonPoolWeekly.feverGroup.feverDevelopedSuddenly(hasSymptomGroupKey, Q_symptoms.key, true, "Q6b");
        hasSymptomGroup.addItem(Q_feverDevelopedSuddenly);

        // Q6c temperature taken
        const Q_didUMeasureTemp = CommonPoolWeekly.feverGroup.didUMeasureTemperature(hasSymptomGroupKey, Q_symptoms.key, true, "Q6c");
        hasSymptomGroup.addItem(Q_didUMeasureTemp);

        // Q6d highest temperature taken
        const Q_highestTempMeasured = CommonPoolWeekly.feverGroup.highestTemprerature(hasSymptomGroupKey, Q_symptoms.key, Q_didUMeasureTemp.key, true, "Q6d");
        hasSymptomGroup.addItem(Q_highestTempMeasured);

        // Q36 optional information
        const Q_wantsMore = CommonPoolWeekly.consentForMore(hasSymptomGroupKey, true);
        hasSymptomGroup.addItem(Q_wantsMore);

        this.items.push(hasSymptomGroup.get());

        const hasMoreGroup = CommonPoolWeekly.hasMoreGroup(rootKey, Q_wantsMore.key);
        const hasMoreGroupKey = hasMoreGroup.key;

        // // Q7 visited medical service --------------------------------------
        const Q_visitedMedicalService = CommonPoolWeekly.visitedMedicalService(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_visitedMedicalService);

        // // Q7b how soon visited medical service --------------------------------------
        const Q_visitedMedicalServiceWhen = CommonPoolWeekly.visitedMedicalServiceWhen(hasMoreGroupKey, Q_visitedMedicalService.key, true);
        hasMoreGroup.addItem(Q_visitedMedicalServiceWhen);

        // // Qcov18 reasons no medical services-----------------------------------------
        const Q_visitedNoMedicalService = CommonPoolWeekly.visitedNoMedicalService(hasMoreGroupKey, Q_visitedMedicalService.key, true);
        hasMoreGroup.addItem(Q_visitedNoMedicalService);

        // // Qcov16h test -----------------------------------------------------
        const Q_symptomImpliedCovidTest = CommonPoolWeekly.symptomImpliedCovidTest(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_symptomImpliedCovidTest);

        // Qcov16i test type -----------------------------------------------------
        const Q_covidTestType = CommonPoolWeekly.covidTestType(hasMoreGroupKey, Q_symptomImpliedCovidTest.key, true);
        hasMoreGroup.addItem(Q_covidTestType);

        // Qcov16b PCR test result
        const Q_resultPCRTest = CommonPoolWeekly.resultPCRTest(hasMoreGroupKey, Q_covidTestType.key, true)
        hasMoreGroup.addItem(Q_resultPCRTest);

        //Qcov16f Serological test result
        const Q_resultAntigenicTest = CommonPoolWeekly.resultAntigenicTest(hasMoreGroupKey, Q_covidTestType.key, true)
        hasMoreGroup.addItem(Q_resultAntigenicTest);

        //Qcov16k Serological test result
        const Q_resultRapidAntigenicTest = CommonPoolWeekly.resultRapidAntigenicTest(hasMoreGroupKey, Q_covidTestType.key, true)
        hasMoreGroup.addItem(Q_resultRapidAntigenicTest);

        // // Qcov19 test -----------------------------------------------------
        const Q_fluTest = CommonPoolWeekly.fluTest(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_fluTest);

        //Qcov19b Flu PCR test result
        const Q_resultFluPCRTest = CommonPoolWeekly.resultFluTest(hasMoreGroupKey, Q_fluTest.key, true)
        hasMoreGroup.addItem(Q_resultFluPCRTest);

        // // Q9 took medication --------------------------------------
        const Q_tookMedication = CommonPoolWeekly.tookMedication(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_tookMedication);

        // // Q14 hospitalized ------------------------------------------------
        const Q_hospitalized = CommonPoolWeekly.hospitalized(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_hospitalized);

        // // Q10 daily routine------------------------------------------------
        const Q_dailyRoutine = CommonPoolWeekly.dailyRoutine(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_dailyRoutine);

        // // Q10b today-------------------------------------------------------
        const Q_dailyRoutineToday = CommonPoolWeekly.dailyRoutineToday(hasMoreGroupKey, Q_dailyRoutine.key, true);
        hasMoreGroup.addItem(Q_dailyRoutineToday);

        // // Q10c daily routine days-----------------------------------------
        const Q_dailyRoutineDaysMissed = CommonPoolWeekly.dailyRoutineDaysMissed(hasMoreGroupKey, Q_dailyRoutine.key, true);
        hasMoreGroup.addItem(Q_dailyRoutineDaysMissed);

        // // Qcov7 Covid 19 habits change question ------------------------------------------------------
        const Q_covidHabits = CommonPoolWeekly.covidHabitsChange(hasMoreGroupKey, false);
        hasMoreGroup.addItem(Q_covidHabits);

        // // Q11 think cause of symptoms --------------------------------------
        const Q_causeOfSymptoms = CommonPoolWeekly.causeOfSymptoms(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_causeOfSymptoms);

        this.items.push(hasMoreGroup.get());

        const surveyEndText = surveyEnd(rootKey);
        this.items.push(surveyEndText);
    }

    buildSurvey() {
        for (const item of this.items) {
            this.addItem(item);
        }
    }
}

/**
 * SURVEY END TEXT
*/
const surveyEnd = (parentKey: string): SurveyItem => {
    const defaultKey = 'surveyEnd'
    const itemKey = [parentKey, defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, type: 'surveyEnd', isGroup: false });

    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.surveyEnd.title.0"],
            ["en", "Thank you! This was all for now, please submit (push « send ») your responses. We will ask you again next week."],
        ]))
    );

    // CONDITION
    // None

    return editor.getItem();
}

export const Weekly = new WeeklyDef();