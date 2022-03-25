import { LanguageMap } from "../languages"
import { SurveyItem, Expression, ExpressionName, ExpressionArg, SurveyGroupItem } from "survey-engine/lib/data_types";
import { SurveyDefinition } from "case-editor-tools/surveys/types";
import { VaccinationQuestions as CommonPoolVaccination } from "../questionPools/vaccinationQuestions";

class VaccinationDef extends SurveyDefinition {

    items: SurveyItem[];

    constructor() {
        super({
            surveyKey: 'vaccination',
            name: new LanguageMap([
                ["id", "vaccination.name.0"],
                ["en", "Vaccination questionnaire"],
            ]),
            description: new LanguageMap([
                ["id", "vaccination.description.0"],
                ["en", "The purpose of the vaccination questionnaire is to find out more about protection given by the vaccine and monitor vaccination uptake in Italy."],
            ]),
            durationText: new LanguageMap([
                ["id", "vaccination.typicalDuration.0"],
                ["en", "Duration 5-10 minutes"],
            ])
        });

        this.items = [];

        const rootKey = this.key

        const Q_vacStart = CommonPoolVaccination.vacStart(rootKey, true);
        this.items.push(Q_vacStart);

        // // -------> VACCINATION GROUP
        const hasVaccineGroup = CommonPoolVaccination.hasVacGroup(rootKey, Q_vacStart.key);
        const hasVaccineGroupKey = hasVaccineGroup.key;

        const Q_flu_vaccine_last_season = CommonPoolVaccination.fluVaccineLastSeason(hasVaccineGroup.key, true);
        hasVaccineGroup.addItem(Q_flu_vaccine_last_season);

        const Q_flu_vaccine_this_season = CommonPoolVaccination.fluVaccineThisSeason(hasVaccineGroup.key, true);
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season);

        const Q_flu_vaccine_this_season_when = CommonPoolVaccination.fluVaccineThisSeasonWhen(hasVaccineGroup.key, Q_flu_vaccine_this_season.key, true);
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_when);

        const Q_flu_vaccine_this_season_reasons_for = CommonPoolVaccination.fluVaccineThisSeasonReasonFor(hasVaccineGroup.key, Q_flu_vaccine_this_season.key, true);
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_reasons_for);

        const Q_flu_vaccine_this_season_reasons_against = CommonPoolVaccination.fluVaccineThisSeasonReasonAgainst(hasVaccineGroup.key, Q_flu_vaccine_this_season.key, true);
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_reasons_against);

        const Q_vac = CommonPoolVaccination.vac(hasVaccineGroupKey, true);
        hasVaccineGroup.addItem(Q_vac);

        const Q_vaccineBrand = CommonPoolVaccination.vaccineBrand(hasVaccineGroupKey, Q_vac.key, true);
        hasVaccineGroup.addItem(Q_vaccineBrand);

        const Q_vaccineShots = CommonPoolVaccination.vaccineShots(hasVaccineGroupKey, Q_vac.key, true);
        hasVaccineGroup.addItem(Q_vaccineShots);

        const Q_dateLastVaccine = CommonPoolVaccination.dateLastVaccine(hasVaccineGroupKey, Q_vac.key, Q_vaccineShots.key, true);
        hasVaccineGroup.addItem(Q_dateLastVaccine);

        const Q_secondShotPlan = CommonPoolVaccination.secondShotPlan(hasVaccineGroupKey, Q_vac.key, Q_vaccineShots.key, true);
        hasVaccineGroup.addItem(Q_secondShotPlan);

        const Q_secondShotContra = CommonPoolVaccination.secondShotContra(hasVaccineGroupKey, Q_vac.key, Q_secondShotPlan.key, true);
        hasVaccineGroup.addItem(Q_secondShotContra);

        const Q_vaccinePro = CommonPoolVaccination.vaccinePro(hasVaccineGroupKey, Q_vac.key, true);
        hasVaccineGroup.addItem(Q_vaccinePro);

        const Q_vaccineContra = CommonPoolVaccination.vaccineContra(hasVaccineGroupKey, Q_vac.key, true);
        hasVaccineGroup.addItem(Q_vaccineContra);

        this.items.push(hasVaccineGroup.get());

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
            this.addItem(item);
        }
    }
}

export const Vaccination = new VaccinationDef();
