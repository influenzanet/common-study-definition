import { OptionDef } from "case-editor-tools/surveys/types";
import { Expression, SurveySingleItem } from "survey-engine/data_types";
import { SurveyItems } from "case-editor-tools/surveys";
import { _T } from "../languages";
import { text_how_answer, text_why_asking } from "./helpers";
import { VaccinationResponses as ResponseEncoding } from "../responses/vaccination";
import { ItemProps, ItemQuestion, BaseChoiceQuestion, LikertQuestion, LikertRow, ScaleOption } from "./types";
import { ClientExpression as client } from "../../../tools";
import { option_input_other, as_option, OptionList } from "../../../tools/options";
import { markdownComponent } from "../../../compat";
import * as VacPool from "./vaccinationQuestions_new";

export { VacPool };
export { FluVaccineThisSeason, FluVaccineThisSeasonWhen, FluVaccineLastSeason, FinalText } from "./vaccinationQuestions_new";

export class SurveyPrelude extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'P0');
    }

    buildItem(): SurveySingleItem {
        return SurveyItems.display({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            content: [
                markdownComponent({ key: 'prelude', content: _T("vaccination.prelude", "Vaccination survey prelude text in markdown") })
            ]
        });
    }
}

export interface FluVaccineReasonForProps extends ItemProps {
    /**
     * @var useVoucher if true adds the vaccination voucher option, to be used with the voucher question (@see FluVaccinationVoucher)
     */
    useVoucher?: boolean
}

export class FluVaccineThisSeasonReasonFor extends VacPool.FluVaccineThisSeasonReasonFor {

    useVoucher: boolean;

    constructor(props: FluVaccineReasonForProps) {
        super(props);
        this.useVoucher = props.useVoucher ?? false;
    }

    getResponses(): OptionDef[] {
        const options = super.getResponses();
        const codes = ResponseEncoding.flu_vac_reason;
        const list = new OptionList(options);
        if (this.useVoucher) {
            list.insertBeforeKey(codes.riskgroup, as_option(codes.voucher, _T("vaccination.Q10c.option.voucher", "I have a voucher")));
        }
        list.insertAfterKey(codes.riskgroup, as_option(codes.pregnant_baby, _T("vaccination.Q10c.option.pregnant_baby", "I'm pregnant and want to protect my baby")));
        return list.values();
    }
}

export class FluVaccineThisSeasonReasonAgainst extends VacPool.FluVaccineThisSeasonReasonAgainst {

    getResponses(): OptionDef[] {
        const prev_options = super.getResponses();
        const codes = ResponseEncoding.flu_notvac_reason;
        const list = new OptionList(prev_options);

        list.insertAfterKey(codes.offer,
            as_option(codes.pregnant_baby, _T("vaccination.Q10d.option.pregnant_baby", "I'm pregnant and fear for my baby"))
        );

        list.insertAfterKey(codes.doubt,
            as_option(codes.prefer_other_measures, _T("vaccination.Q10d.option.prefer_other_measures", "I prefer to protect my self by other protective measures (mask, hand washing...)"))
        );

        list.insertAfterKey(codes.minor_illness,
            as_option(codes.avoid_healthseek, _T("vaccination.Q10d.option.avoid_healthseeking", "Because of pandemic, I avoid to visit doctor or pharmacy")),
            as_option(codes.risk_covid, _T("vaccination.Q10d.option.increase_risk_covid", "I fear the influenza vaccine to increase my risk to get Covid19")),
            option_input_other(codes.covid_other, _T("vaccination.Q10d.option.other_covid19", "Other reason related to Covid19"), "none")
        );

        list.insertAfterKey(codes.doctor,
            as_option(codes.bad_experience, _T("vaccination.Q10d.option.bad_experience", "I had a bad experience with vaccination"))
        );

        const new_options = list.values();

        new_options.forEach(o => {
            if (o.key == codes.no_reason) {
                o.disabled = client.multipleChoice.none(this.key, codes.no_reason);
            } else {
                o.disabled = client.multipleChoice.any(this.key, codes.no_reason);
            }
        });

        return new_options;
    }
}

export class CovidVaccineAgainstReasons extends VacPool.CovidVaccineAgainstReasons {

    getResponses(): OptionDef[] {
        const codes = ResponseEncoding.covid_notvac_reason;
        const r = super.getResponses();
        const list = new OptionList(r);

        list.insertAfterKey(codes.disagree,
            as_option(codes.bad_experience, _T("vaccination.Q35m.option.19", "bad experience with previous vaccine"))
        );

        list.insertAfterKey(codes.notriskgroup,
            as_option(codes.vaccined_or_infected, _T("vaccination.Q35m.option.vaccinated", "I'm already vaccinated or have been tested postivive to covid 19"))
        );

        list.insertAfterKey(codes.natural_immunity,
            as_option(codes.prefer_other_measures, _T("vaccination.Q35m.option.prefer_other_measures", "I prefer to protect my self by other protective measures (mask, hand washing...)"))
        );

        const new_options = list.values();
        new_options.forEach(o => {
            if (o.key == codes.dontknow) {
                o.disabled = client.multipleChoice.none(this.key, codes.dontknow);
            } else {
                o.disabled = client.multipleChoice.any(this.key, codes.dontknow);
            }
        });

        return new_options;
    }
}

/**
 * Vaccination voucher question, for platforms where a voucher is provided by the health system
 * Only built when the vaccination survey is created with the `useVoucher` option (@see VaccinationV2Props)
 */
export class FluVaccinationVoucher extends BaseChoiceQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q18', 'single');
        this.setOptions({
            questionText: _T("vaccination.Q18.text", "Do you have a voucher for influenza vaccine since last october")
        });
    }

    getResponses(): OptionDef[] {
        return [
            as_option('1', _T("vaccination.Q18.option.yes", "Yes")),
            as_option('0', _T("vaccination.Q18.option.no", "No")),
            as_option("2", _T("vaccination.Q18.option.dnk", "I dont know")),
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.Q18.why_asking"),
            { content: _T("vaccination.Q18.asking_reason", "asking_reason") },
            text_how_answer("vaccination.Q18.how_answer"),
            { content: _T("vaccination.Q18.answer_tip", "how_answer") },
        ];
    }
}

export class FluVaccinationByWhom extends BaseChoiceQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q10e', 'single');
        this.setOptions({
            questionText: _T("vaccination.Q10e.text", "By who have you been vaccinated")
        });
    }

    getResponses(): OptionDef[] {
        return [
            as_option('1', _T("vaccination.Q10e.option.gp", "By a generalist practitioner")),
            as_option('2', _T("vaccination.Q10e.option.nurse", "By a nurse")),
            as_option('3', _T("vaccination.Q10e.option.midwife", "By a midwife")),
            as_option('4', _T("vaccination.Q10e.option.pharmacist", "By a pharmacist")),
            as_option('5', _T("vaccination.Q10e.option.occupational", "By an occupational med practitioner")),
            option_input_other('6', _T("vaccination.Q10e.option.other", "By another kind of practitioner"), "none"),
        ];
    }
}

export interface CovidVaccinationSeasonsProps extends ItemProps {
    /**
     * @var useLastSummer if true the row about the previous season spring/summer period
     * (march to september of the previous season) is added.
     * Only relevant for platforms where a covid vaccination campaign is run during this period.
     * Default is false.
     */
    useLastSummer?: boolean
}

export class CovidVaccinationSeasons extends LikertQuestion {

    useLastSummer: boolean;

    constructor(props: CovidVaccinationSeasonsProps) {
        props.transKey = 'vaccination.Q35n';
        super(props, 'Q35n');
        this.useLastSummer = props.useLastSummer ?? false;
        this.setOptions({
            questionText: this.trans("title", "Did you get vaccinated against covid")
        });
    }

    getScaleOptions(): ScaleOption[] {
        const codes = ResponseEncoding.covid_vac;
        return [
            this.scaleItem(codes.yes, 'Yes'),
            this.scaleItem(codes.no, 'No'),
            this.scaleItem(codes.dontknow, "I don't know"),
        ];
    }

    getRows(): LikertRow[] {
        const codes = ResponseEncoding.covid_vac_likert;
        const rows: LikertRow[] = [
            { key: codes.current, content: this.trans('row.current', 'This season') },
        ];
        if (this.useLastSummer) {
            rows.push({ key: codes.last_summer, content: this.trans('row.last_summer', 'Last season during summer (March Y+1 to September Y+1)') });
        }
        rows.push(
            { key: codes.last_winter, content: this.trans('row.last_winter', 'Last season during winter (october Y to february Y+1)') },
            { key: codes.before, content: this.trans('row.before', 'Before last season') },
        );
        return rows;
    }

    createNotVaccinatedForAllCondition(): Expression {
        const optionKeys = ResponseEncoding.covid_vac;
        const rows = this.getRows().map(row => client.responseHasKeysAny(this.key, this.getRowItemKey(row.key), optionKeys.no));
        return client.logic.and(...rows);
    }

    createNotVaccinatedForThisSeasonCondition(): Expression {
        const codes = ResponseEncoding.covid_vac_likert;
        const optionKeys = ResponseEncoding.covid_vac;
        return client.responseHasKeysAny(this.key, this.getRowItemKey(codes.current), optionKeys.no);
    }

    getHelpGroupContent() {
        return [
            text_why_asking('vaccination.Q35n.helpGroup.why_asking'),
            { content: _T('vaccination.Q35n.helpGroup.asking_reason', 'vaccination.Q35n Question asking reason') },
        ];
    }
}
