import { _T } from "../languages"
import  * as pool  from "../questionPools/vaccinationQuestions_new";
import { ClientExpression as ce } from "../../../tools";
import { SurveyBuilder } from "../../../tools";
import { VaccinationResponses as responses } from "../responses/vaccination";
import { ParticipantFlags } from "../participantFlags";

export class VaccinationNewDef extends SurveyBuilder {

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

        const FlagVaccinationCompleted = ParticipantFlags.vaccinationCompleted;

        const hasCompletedSurvey = ce.participantFlags.hasKeyAndValue(FlagVaccinationCompleted.key, FlagVaccinationCompleted.values.yes);

        const Q_vacStart = new pool.VacStart({parentKey:rootKey, isRequired: true});
        Q_vacStart.setCondition(hasCompletedSurvey);
        this.items.push(Q_vacStart);

        // // -------> VACCINATION GROUP
        const VacGroupCondition = ce.logic.or(
            ce.singleChoice.none(Q_vacStart.key, responses.vacstart.nothing_changed),
            ce.logic.not(hasCompletedSurvey)
        );
        
        const hasVaccineGroup = new pool.VacGroup({parentKey:rootKey});
        const hasVaccineGroupKey = hasVaccineGroup.key;

        hasVaccineGroup.setCondition(VacGroupCondition);

        const Q_flu_vaccine_last_season = new pool.FluVaccineLastSeason({parentKey:hasVaccineGroupKey, isRequired:true});
        hasVaccineGroup.addItem(Q_flu_vaccine_last_season.get());

        const Q_flu_vaccine_this_season = new pool.FluVaccineThisSeason({parentKey:hasVaccineGroupKey, isRequired:true});
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season.get());

        const FluVaccinatedThisSeason = Q_flu_vaccine_this_season.createIsVaccinatedCondition();
        
        const Q_flu_vaccine_this_season_when = new pool.FluVaccineThisSeasonWhen({parentKey:hasVaccineGroupKey, isRequired:true});
        Q_flu_vaccine_this_season_when.setCondition(FluVaccinatedThisSeason);
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_when.get());

        const Q_flu_vaccine_this_season_reasons_for = new pool.FluVaccineThisSeasonReasonFor({parentKey:hasVaccineGroup.key, isRequired:true});
        Q_flu_vaccine_this_season_reasons_for.setCondition(FluVaccinatedThisSeason);
        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_reasons_for.get());

        const FluNotVaccinatedThisSeason = Q_flu_vaccine_this_season.createNotVaccinatedCondition();
        const Q_flu_vaccine_this_season_reasons_against = new pool.FluVaccineThisSeasonReasonAgainst({parentKey:hasVaccineGroup.key, isRequired:true});
        Q_flu_vaccine_this_season_reasons_against.setCondition(FluNotVaccinatedThisSeason);

        hasVaccineGroup.addItem(Q_flu_vaccine_this_season_reasons_against.get());

        const Q_covidVac = new pool.CovidVac({parentKey:hasVaccineGroupKey, isRequired:true});
        hasVaccineGroup.addItem(Q_covidVac.get());

        const CovidVaccinated = Q_covidVac.createIsVaccinatedCondition();
        const CovidNotVaccinated = Q_covidVac.createNotVaccinatedCondition();

        const Q_vaccineBrand = new pool.CovidVaccineBrand({parentKey:hasVaccineGroupKey,  isRequired:true});
        Q_vaccineBrand.setCondition(CovidVaccinated);
        hasVaccineGroup.addItem(Q_vaccineBrand.get());

        const Q_vaccineShots = new pool.CovidVaccineShots({parentKey:hasVaccineGroupKey,  isRequired:true});
        Q_vaccineShots.setCondition(CovidVaccinated);
        hasVaccineGroup.addItem(Q_vaccineShots.get());

        const Q_dateLastVaccine = new pool.CovidDateLastVaccine({parentKey:hasVaccineGroupKey, isRequired:true});
        Q_dateLastVaccine.setCondition(CovidVaccinated);
        hasVaccineGroup.addItem(Q_dateLastVaccine.get());

        const Q_secondShotPlan = new pool.CovidSecondShotPlan({parentKey:hasVaccineGroupKey, isRequired:true});
        
        const SecondShotCondition = ce.logic.and(
            CovidVaccinated,
            Q_vaccineShots.createOneShotCondition()
        );
        Q_secondShotPlan.setCondition(SecondShotCondition);
        
        hasVaccineGroup.addItem(Q_secondShotPlan.get());

        const Q_secondShotContra = new pool.CovidSecondShotAgainstReason({parentKey:hasVaccineGroupKey, isRequired:true});
       
        // Is vaccinated covid and second shot is 'no' or 'dont know' 
        Q_secondShotContra.setCondition(
            ce.logic.and(
                CovidVaccinated,
                Q_secondShotPlan.createReponseCondition("no","dontknow")
            )
        );
       
        hasVaccineGroup.addItem(Q_secondShotContra.get());

        const Q_vaccinePro = new pool.CovidVaccineProReasons({parentKey:hasVaccineGroupKey, isRequired:true});
        
        Q_vaccinePro.setCondition(CovidVaccinated);
        hasVaccineGroup.addItem(Q_vaccinePro.get());

        const Q_vaccineContra = new pool.CovidVaccineAgainstReasons({parentKey:hasVaccineGroupKey, isRequired:true});
        Q_vaccineContra.setCondition(CovidNotVaccinated);
        hasVaccineGroup.addItem(Q_vaccineContra.get());

        this.items.push(hasVaccineGroup);

        const QSurveyEnd = new pool.FinalText({parentKey: rootKey});
        this.items.push(QSurveyEnd);
    }
}
