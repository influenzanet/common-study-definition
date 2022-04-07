import { _T } from "../languages"
import { ExpressionName, SurveyGroupItem } from "survey-engine/data_types";
import {  SurveyDefinition } from "case-editor-tools/surveys/types";
import  * as pool  from "../questionPools/vaccinationQuestions";
import { ItemBuilder } from "../../../tools/items";
export class VaccinationDef extends SurveyDefinition {

    items: ItemBuilder[];

    constructor() {
        super({
            surveyKey: 'vaccination',
            name: _T( "vaccination.name.0", "Vaccination questionnaire"),
            description: _T(
                "vaccination.description.0",
                 "The purpose of the vaccination questionnaire is to find out more about protection given by the vaccine and monitor vaccination uptake in Italy.",
            ),
            durationText: _T(
                "vaccination.typicalDuration.0", "Duration 5-10 minutes"
            )
        });

        this.items = [];

        const rootKey = this.key

        const Q_vacStart = new pool.VacStart(rootKey, true);
        this.items.push(Q_vacStart);

        // // -------> VACCINATION GROUP
        const hasVaccineGroup = pool.hasVacGroup(rootKey, Q_vacStart.key);
        const hasVaccineGroupKey = hasVaccineGroup.key;

        const Q_flu_vaccine_last_season = new pool.FluVaccineLastSeason(hasVaccineGroup.key, true);
        hasVaccineGroup.addItem(Q_flu_vaccine_last_season.get());

        const Q_flu_vaccine_this_season = new pool.FluVaccineThisSeason(hasVaccineGroup.key, true);
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season.get());

        const Q_flu_vaccine_this_season_when = new pool.FluVaccineThisSeasonWhen(hasVaccineGroup.key, Q_flu_vaccine_this_season.key, true);
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_when.get());

        const Q_flu_vaccine_this_season_reasons_for = new pool.FluVaccineThisSeasonReasonFor(hasVaccineGroup.key, Q_flu_vaccine_this_season.key, true);
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_reasons_for.get());

        const Q_flu_vaccine_this_season_reasons_against = new pool.FluVaccineThisSeasonReasonAgainst(hasVaccineGroup.key, Q_flu_vaccine_this_season.key, true);
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_reasons_against.get());

        const Q_covidVac = new pool.CovidVac(hasVaccineGroupKey, true);
        hasVaccineGroup.addItem(Q_covidVac.get());

        const Q_vaccineBrand = new pool.CovidVaccineBrand(hasVaccineGroupKey, Q_covidVac.key, true);
        hasVaccineGroup.addItem(Q_vaccineBrand.get());

        const Q_vaccineShots = new pool.CovidVaccineShots(hasVaccineGroupKey, Q_covidVac.key, true);
        hasVaccineGroup.addItem(Q_vaccineShots.get());

        const Q_dateLastVaccine = new pool.CovidDateLastVaccine(hasVaccineGroupKey, Q_covidVac.key, true);
        hasVaccineGroup.addItem(Q_dateLastVaccine.get());

        const Q_secondShotPlan = new pool.CovidSecondShotPlan(hasVaccineGroupKey, Q_covidVac.key, Q_vaccineShots.key, true);
        hasVaccineGroup.addItem(Q_secondShotPlan.get());

        const Q_secondShotContra = new pool.CovidSecondShotAgainstReason(hasVaccineGroupKey, Q_covidVac.key, Q_secondShotPlan.key, true);
        hasVaccineGroup.addItem(Q_secondShotContra.get());

        const Q_vaccinePro = new pool.CovidVaccineProReasons(hasVaccineGroupKey, Q_covidVac.key, true);
        hasVaccineGroup.addItem(Q_vaccinePro.get());

        const Q_vaccineContra = new pool.CovidVaccineAgainstReasons(hasVaccineGroupKey, Q_covidVac.key, true);
        hasVaccineGroup.addItem(Q_vaccineContra.get());

        this.items.push(hasVaccineGroup);

        const prefillRules = []
        for (const item of (<SurveyGroupItem>hasVaccineGroup.get()).items) {
            prefillRules.push(
                {
                    name: <ExpressionName>"GET_LAST_SURVEY_ITEM",
                    data: [
                        { str: "vaccination" },
                        { str: item.key }
                    ]
                }
            );
        }

        this.editor.setPrefillRules(prefillRules);
    }

    buildSurvey() {
        for (const item of this.items) {
            this.addItem(item.get());
        }
    }
}
