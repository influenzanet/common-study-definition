import { _T } from "../languages"
import { Item, SurveyDefinition } from "case-editor-tools/surveys/types";
import * as pool from "../questionPools/weeklyQuestions";
import { ItemBuilder } from "../../../tools/items";

export class WeeklyDef extends SurveyDefinition {

    items: ItemBuilder[];

    Q_same_illnes: Item;

    constructor() {
        super({
            surveyKey: 'weekly',
            name: _T( "weekly.name.0", "Weekly questionnaire"),
            description:_T("weekly.description.0", "Please also report if you had no complaints."),
            durationText: _T( "weekly.typicalDuration.0", "Duration 1-5 minutes")
        });

        this.items = [];

        const rootKey = this.key

        // Symptoms Q1
        const Q_symptoms = new pool.Symptoms(rootKey, true);
        this.items.push(Q_symptoms);

        // // -------> HAS SYMPTOMS GROUP
        const hasSymptomGroup = new pool.SymptomsGroup(rootKey, Q_symptoms.key);
        const hasSymptomGroupKey = hasSymptomGroup.key;

        // // Q2 same illnes --------------------------------------
        const Q_same_illnes = new pool.SameIllnes(hasSymptomGroupKey, true);
        hasSymptomGroup.addItem(Q_same_illnes.get());
        this.Q_same_illnes = Q_same_illnes;

        // // Qcov3 pcr tested contact COVID-19--------------------------------------
        const Q_covidPCRTestedContact = new pool.PcrTestedContact(hasSymptomGroupKey, true);
        hasSymptomGroup.addItem(Q_covidPCRTestedContact.get());

        // Qcov3b household pcr contacts COVID-19--------------------------
        const Q_pcrHouseholdContact = new pool.PcrHouseholdContact(hasSymptomGroupKey, Q_covidPCRTestedContact.key, true);
        hasSymptomGroup.addItem(Q_pcrHouseholdContact.get());

        // // Q3 when first symptoms --------------------------------------
        const Q_symptomStart = new pool.SymptomsStart(hasSymptomGroupKey, Q_same_illnes.key, true);
        hasSymptomGroup.addItem(Q_symptomStart.get());

        // // Q4 when symptoms end --------------------------------------
        const Q_symptomsEnd = new pool.SymptomsEnd(hasSymptomGroupKey, Q_symptomStart.key, true);
        hasSymptomGroup.addItem(Q_symptomsEnd.get());

        // // Q5 symptoms developed suddenly --------------------------------------
        const Q_symptomsSuddenlyDeveloped = new pool.SymptomsSuddenlyDeveloped(hasSymptomGroupKey, true);
        hasSymptomGroup.addItem(Q_symptomsSuddenlyDeveloped.get());

        // Q6 fever start questions
        // Separated into individual questions and Key code overriden to prevent Q6.a and keep Q6
        const Q_feverStart = new pool.FeverStart(hasSymptomGroupKey, Q_symptoms.key, Q_symptomStart.key, true, "Q6");
        hasSymptomGroup.addItem(Q_feverStart.get());

        // Q6b fever developed suddenly
        const Q_feverDevelopedSuddenly = new pool.FeverDevelopedSuddenly(hasSymptomGroupKey, Q_symptoms.key, true, "Q6b");
        hasSymptomGroup.addItem(Q_feverDevelopedSuddenly.get());

        // Q6c temperature taken
        const Q_didUMeasureTemp = new pool.DidUMeasureTemperature(hasSymptomGroupKey, Q_symptoms.key, true, "Q6c");
        hasSymptomGroup.addItem(Q_didUMeasureTemp.get());

        // Q6d highest temperature taken
        const Q_highestTempMeasured = new pool.HighestTemprerature(hasSymptomGroupKey, Q_symptoms.key, Q_didUMeasureTemp.key, true, "Q6d");
        hasSymptomGroup.addItem(Q_highestTempMeasured.get());

        // Q36 optional information
        const Q_wantsMore = new pool.ConsentForMore(hasSymptomGroupKey, true);
        hasSymptomGroup.addItem(Q_wantsMore.get());

        this.items.push(hasSymptomGroup);

        const hasMoreGroup = new pool.HasMoreGroup(rootKey, Q_wantsMore.key);
        const hasMoreGroupKey = hasMoreGroup.key;

        // // Q7 visited medical service --------------------------------------
        const Q_visitedMedicalService = new pool.VisitedMedicalService(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_visitedMedicalService.get());

        // // Q7b how soon visited medical service --------------------------------------
        const Q_visitedMedicalServiceWhen = new pool.VisitedMedicalServiceWhen(hasMoreGroupKey, Q_visitedMedicalService.key, true);
        hasMoreGroup.addItem(Q_visitedMedicalServiceWhen.get());

        // // Qcov18 reasons no medical services-----------------------------------------
        const Q_visitedNoMedicalService = new pool.WhyVisitedNoMedicalService(hasMoreGroupKey, Q_visitedMedicalService.key, true);
        hasMoreGroup.addItem(Q_visitedNoMedicalService.get());

        // // Qcov16h test -----------------------------------------------------
        const Q_symptomImpliedCovidTest = new pool.SymptomImpliedCovidTest(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_symptomImpliedCovidTest.get());

        // Qcov16i test type -----------------------------------------------------
        const Q_covidTestType = new pool.CovidTestType(hasMoreGroupKey, Q_symptomImpliedCovidTest.key, true);
        hasMoreGroup.addItem(Q_covidTestType.get());

        // Qcov16b PCR test result
        const Q_resultPCRTest = new pool.ResultPCRTest(hasMoreGroupKey, Q_covidTestType.key, true)
        hasMoreGroup.addItem(Q_resultPCRTest.get());

        //Qcov16f Serological test result
        const Q_resultAntigenicTest = new pool.ResultAntigenicTest(hasMoreGroupKey, Q_covidTestType.key, true)
        hasMoreGroup.addItem(Q_resultAntigenicTest.get());

        //Qcov16k Serological test result
        const Q_resultRapidAntigenicTest = new pool.ResultRapidAntigenicTest(hasMoreGroupKey, Q_covidTestType.key, true)
        hasMoreGroup.addItem(Q_resultRapidAntigenicTest.get());

        // // Qcov19 test -----------------------------------------------------
        const Q_fluTest = new pool.FluTest(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_fluTest.get());

        //Qcov19b Flu PCR test result
        const Q_resultFluPCRTest = new pool.ResultFluTest(hasMoreGroupKey, Q_fluTest.key, true)
        hasMoreGroup.addItem(Q_resultFluPCRTest.get());

        // // Q9 took medication --------------------------------------
        const Q_tookMedication = new pool.TookMedication(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_tookMedication.get());

        // // Q14 hospitalized ------------------------------------------------
        const Q_hospitalized = new pool.Hospitalized(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_hospitalized.get());

        // // Q10 daily routine------------------------------------------------
        const Q_dailyRoutine = new pool.DailyRoutine(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_dailyRoutine.get());

        // // Q10b today-------------------------------------------------------
        const Q_dailyRoutineToday = new pool.DailyRoutineToday(hasMoreGroupKey, Q_dailyRoutine.key, true);
        hasMoreGroup.addItem(Q_dailyRoutineToday.get());

        // // Q10c daily routine days-----------------------------------------
        const Q_dailyRoutineDaysMissed = new pool.DailyRoutineDaysMissed(hasMoreGroupKey, Q_dailyRoutine.key, true);
        hasMoreGroup.addItem(Q_dailyRoutineDaysMissed.get());

        // // Qcov7 Covid 19 habits change question ------------------------------------------------------
        const Q_covidHabits = new pool.CovidHabitsChange(hasMoreGroupKey, false);
        hasMoreGroup.addItem(Q_covidHabits.get());

        // // Q11 think cause of symptoms --------------------------------------
        const Q_causeOfSymptoms = new pool.CauseOfSymptoms(hasMoreGroupKey, true);
        hasMoreGroup.addItem(Q_causeOfSymptoms.get());

        this.items.push(hasMoreGroup);

        const surveyEndText = new pool.SurveyEnd(rootKey);
        this.items.push(surveyEndText);
    }

    getSameIllnessKey() {
        return this.Q_same_illnes.key;
    }

    buildSurvey() {
        for (const item of this.items) {
            this.addItem(item.get());
        }
    }
}
