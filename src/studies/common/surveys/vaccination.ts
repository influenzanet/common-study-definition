import { _T } from "../languages"
import { ExpressionName, SurveyGroupItem } from "survey-engine/data_types";
import {  SurveyDefinition } from "case-editor-tools/surveys/types";
import  * as pool  from "../questionPools/vaccinationQuestions";
import { ItemBuilder } from "../../../tools/items";
import { SurveyBuilder } from "../../../tools";

export class VaccinationDef extends SurveyBuilder {

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

        const Q_vacStart = new pool.VacStart({parentKey:rootKey, isRequired: true});
        this.items.push(Q_vacStart);

        // // -------> VACCINATION GROUP
        const hasVaccineGroup = pool.hasVacGroup({parentKey:rootKey, keyVacStart:Q_vacStart.key});
        const hasVaccineGroupKey = hasVaccineGroup.key;

        const Q_flu_vaccine_last_season = new pool.FluVaccineLastSeason({parentKey:hasVaccineGroup.key, isRequired:true});
        hasVaccineGroup.addItem(Q_flu_vaccine_last_season.get());

        const Q_flu_vaccine_this_season = new pool.FluVaccineThisSeason({parentKey:hasVaccineGroup.key, isRequired:true});
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season.get());

        const Q_flu_vaccine_this_season_when = new pool.FluVaccineThisSeasonWhen({parentKey:hasVaccineGroup.key, keyFluVaccineThisSeason:Q_flu_vaccine_this_season.key, isRequired:true});
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_when.get());

        const Q_flu_vaccine_this_season_reasons_for = new pool.FluVaccineThisSeasonReasonFor({parentKey:hasVaccineGroup.key, keyFluVaccineThisSeason:Q_flu_vaccine_this_season.key, isRequired:true});
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_reasons_for.get());

        const Q_flu_vaccine_this_season_reasons_against = new pool.FluVaccineThisSeasonReasonAgainst({parentKey:hasVaccineGroup.key, keyFluVaccineThisSeason: Q_flu_vaccine_this_season.key, isRequired:true});
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_reasons_against.get());

        const Q_covidVac = new pool.CovidVac({parentKey:hasVaccineGroupKey, isRequired:true});
        hasVaccineGroup.addItem(Q_covidVac.get());

        const Q_vaccineBrand = new pool.CovidVaccineBrand({parentKey:hasVaccineGroupKey, keyVac:Q_covidVac.key, isRequired:true});
        hasVaccineGroup.addItem(Q_vaccineBrand.get());

        const Q_vaccineShots = new pool.CovidVaccineShots({parentKey:hasVaccineGroupKey, keyVac:Q_covidVac.key, isRequired:true});
        hasVaccineGroup.addItem(Q_vaccineShots.get());

        const Q_dateLastVaccine = new pool.CovidDateLastVaccine({parentKey:hasVaccineGroupKey, keyVac:Q_covidVac.key, isRequired:true});
        hasVaccineGroup.addItem(Q_dateLastVaccine.get());

        const Q_secondShotPlan = new pool.CovidSecondShotPlan({parentKey:hasVaccineGroupKey, keyVac:Q_covidVac.key, keyVaccineShots: Q_vaccineShots.key, isRequired:true});
        hasVaccineGroup.addItem(Q_secondShotPlan.get());

        const Q_secondShotContra = new pool.CovidSecondShotAgainstReason({parentKey:hasVaccineGroupKey, keyVac: Q_covidVac.key, keyVaccineShots:Q_secondShotPlan.key, isRequired:true});
        hasVaccineGroup.addItem(Q_secondShotContra.get());

        const Q_vaccinePro = new pool.CovidVaccineProReasons({parentKey:hasVaccineGroupKey, keyVac:Q_covidVac.key, isRequired:true});
        hasVaccineGroup.addItem(Q_vaccinePro.get());

        const Q_vaccineContra = new pool.CovidVaccineAgainstReasons({parentKey:hasVaccineGroupKey, keyVac:Q_covidVac.key, isRequired:true});
        hasVaccineGroup.addItem(Q_vaccineContra.get());

        this.items.push(hasVaccineGroup);

        const QSurveyEnd = new pool.FinalText({parentKey: rootKey});
        this.items.push(QSurveyEnd);
    }
}
