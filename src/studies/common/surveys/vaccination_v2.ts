import { SurveyBuilder, ItemBuilder } from "../../../tools";
import * as pool from "../questionPools/vaccinationQuestions_v2";

export interface VaccinationV2Props {
    surveyKey: string;
    name: Map<string, string>;
    description: Map<string, string>;
    durationText: Map<string, string>;
    metadata?: Map<string, string>;

    /**
     * @var useVoucher if true the vaccination voucher question (Q18) is built and the voucher option
     * is added to the reasons for vaccination question (Q10c).
     * Only relevant for platforms where a vaccination voucher is provided by the health system.
     * Default is false.
     */
    useVoucher?: boolean;

    /**
     * @var useCovidLastSummer if true the covid vaccination question (Q35n) shows the row about the
     * previous season spring/summer period (march to september of the previous season).
     * Only relevant for platforms where a covid vaccination campaign is run during this period.
     * Default is false.
     */
    useCovidLastSummer?: boolean;
}

export class VaccinationDefV2 extends SurveyBuilder {

    useVoucher: boolean;

    useCovidLastSummer: boolean;

    constructor(props: VaccinationV2Props) {
        super({
            surveyKey: props.surveyKey,
            name: props.name,
            description: props.description,
            durationText: props.durationText,
            metadata: props.metadata,
        });

        this.useVoucher = props.useVoucher ?? false;
        this.useCovidLastSummer = props.useCovidLastSummer ?? false;

        const rootKey = this.key;

        const prelude = this.buildPrelude(rootKey);
        if (prelude) this.items.push(prelude);

        const lastSubmit = this.buildLastSubmissionItem(rootKey);
        if (lastSubmit) this.items.push(lastSubmit);

        this.buildVaccGroup(rootKey).forEach(item => this.items.push(item));

        this.items.push(new pool.FinalText({ parentKey: rootKey }));
    }

    buildPrelude(rootKey: string): ItemBuilder | undefined {
        return new pool.SurveyPrelude({ parentKey: rootKey });
    }

    buildLastSubmissionItem(_rootKey: string): ItemBuilder | undefined {
        return undefined;
    }

    buildVoucherQuestion(rootKey: string): ItemBuilder | undefined {
        if (!this.useVoucher) {
            return undefined;
        }
        return new pool.FluVaccinationVoucher({ parentKey: rootKey, isRequired: true });
    }

    buildFluReasonForQuestion(rootKey: string): pool.FluVaccineThisSeasonReasonFor {
        return new pool.FluVaccineThisSeasonReasonFor({ parentKey: rootKey, isRequired: false, useVoucher: this.useVoucher });
    }

    buildFluReasonAgainstQuestion(rootKey: string): pool.FluVaccineThisSeasonReasonAgainst {
        return new pool.FluVaccineThisSeasonReasonAgainst({ parentKey: rootKey, isRequired: false });
    }

    buildCovidVaccinationSeasonsQuestion(rootKey: string): pool.CovidVaccinationSeasons {
        return new pool.CovidVaccinationSeasons({ parentKey: rootKey, isRequired: true, useLastSummer: this.useCovidLastSummer });
    }

    buildCovidReasonAgainstQuestion(rootKey: string): pool.CovidVaccineAgainstReasons {
        return new pool.CovidVaccineAgainstReasons({ parentKey: rootKey, isRequired: false });
    }

    buildVaccGroup(rootKey: string): ItemBuilder[] {
        const items: ItemBuilder[] = [];

        const voucher = this.buildVoucherQuestion(rootKey);
        if (voucher) items.push(voucher);

        const Q_flu_vaccine_this_season = new pool.FluVaccineThisSeason({ parentKey: rootKey, isRequired: true });
        items.push(Q_flu_vaccine_this_season);

        const FluVaccinated = Q_flu_vaccine_this_season.createIsVaccinatedCondition();
        const FluNotVaccinated = Q_flu_vaccine_this_season.createNotVaccinatedCondition();

        const Q_flu_vaccine_when = new pool.FluVaccineThisSeasonWhen({ parentKey: rootKey, isRequired: false });
        Q_flu_vaccine_when.setCondition(FluVaccinated);
        items.push(Q_flu_vaccine_when);

        const Q_flu_by_whom = new pool.FluVaccinationByWhom({ parentKey: rootKey, isRequired: false });
        Q_flu_by_whom.setCondition(FluVaccinated);
        items.push(Q_flu_by_whom);

        const Q_flu_reason_for = this.buildFluReasonForQuestion(rootKey);
        Q_flu_reason_for.setCondition(FluVaccinated);
        items.push(Q_flu_reason_for);

        const Q_flu_reason_against = this.buildFluReasonAgainstQuestion(rootKey);
        Q_flu_reason_against.setCondition(FluNotVaccinated);
        items.push(Q_flu_reason_against);

        const Q_flu_last_season = new pool.FluVaccineLastSeason({ parentKey: rootKey, isRequired: true });
        items.push(Q_flu_last_season);

        const Q_covid_vac = this.buildCovidVaccinationSeasonsQuestion(rootKey);
        items.push(Q_covid_vac);

        const CovidNotVaccinatedThisSeason = Q_covid_vac.createNotVaccinatedForThisSeasonCondition();

        const Q_covid_contra = this.buildCovidReasonAgainstQuestion(rootKey);
        Q_covid_contra.setCondition(CovidNotVaccinatedThisSeason);
        items.push(Q_covid_contra);

        return items;
    }

}
