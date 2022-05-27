import { _T } from "../languages"
import { Group } from "case-editor-tools/surveys/types";
import { expWithArgs} from "case-editor-tools/surveys/utils/simple-generators";
import { ComponentGenerators } from "case-editor-tools/surveys/utils/componentGenerators";
import { SurveyItems } from 'case-editor-tools/surveys';
import { singleChoicePrefix, text_how_answer, text_select_all_apply, text_why_asking } from "./helpers";
import { ParticipantFlags } from "../participantFlags";

import { VaccinationResponses as ResponseEncoding } from "../responses/vaccination";
import { ItemProps, GroupProps, ItemQuestion } from "./types";

export class VacStart extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q0');
    }

    getCondition() {
        const hadCompletedVaccSurvey = expWithArgs('eq', expWithArgs('getAttribute', expWithArgs('getAttribute', expWithArgs('getContext'), 'participantFlags'), 'completedVaccSurvey'), "1");
        return hadCompletedVaccSurvey;
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T(
                "vaccination.Q0.title.0",
                "Four weeks ago you received a questionnaire about your vaccination status.  This new questionnaire is to monitor any further changes. Select the option that applies to you."
                ),
            //helpGroupContent: this.getHelpGroupContent(),
            bottomDisplayCompoments: [
                ComponentGenerators.text({
                    'content': _T(
                        "vaccination.Q0.privacy.note",
                        "(**) By selecting one of these options you give your consent to use your historical data to prefill this survey's responses."
                    )
                })
            ],
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: ResponseEncoding.vacstart.nothing_changed, role: 'option',
                content: _T("vaccination.Q0.rg.scg.option.1", "In the meantime nothing has changed in terms of vaccination for me.")
            },
            {
                key: '1', role: 'option',
                content: _T(
                    "vaccination.Q0.rg.scg.option.0",
                    "In the meantime I received a new vaccine dose, or a new invitation to be vaccinated. (**)")
            },
            {
                key: '3', role: 'option',
                content: _T("vaccination.Q0.rg.scg.option.2", "I'm not sure, and would like to take these questions to make sure my information on vaccination is up to date. (**)")
            },
        ]
    }

    getHelpGroupContent() {

    }
}

interface VacGroupProps extends GroupProps {
    keyVacStart: string
}


/**
 * GROUP DEPENDING VACCINATION SURVEY ROUND
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyVacStart reference to the vac survey
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export const hasVacGroup = (props: VacGroupProps): Group => {

    const flagVac = ParticipantFlags.vaccinationCompleted;
    class HasVacGroup extends Group {
        constructor(parentKey: string, defaultKey: string) {
            super(parentKey, defaultKey);
            this.groupEditor.setCondition(
                expWithArgs('or',
                    expWithArgs('responseHasOnlyKeysOtherThan', props.keyVacStart, singleChoicePrefix, ResponseEncoding.vacstart.nothing_changed),
                    expWithArgs('not',
                        expWithArgs('eq',
                            expWithArgs('getAttribute', expWithArgs('getAttribute', expWithArgs('getContext'), 'participantFlags'), flagVac.key ),
                            flagVac.values.yes
                        )
                    ),
                )
            );
        }

        buildGroup() { }
    }

    return new HasVacGroup(props.parentKey, 'HV');
}

/**
 * FLU VACCINE LAST SEASON: single choice about last season's vaccine
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class FluVaccineLastSeason extends ItemQuestion {

    constructor(props:ItemProps) {
        super(props, 'Q9');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q9.title.0", "Did you receive a flu vaccine during the previous flu season (2020-2021)?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
                {
                key: ResponseEncoding.flu_vaccine_last.yes, role: 'option',
                content: _T("vaccination.HV.Q9.rg.scg.option.0", "Yes")
            },
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q9.rg.scg.option.1", "No")
            },
            {
                key: '2', role: 'option',
                content: _T("vaccination.HV.Q9.rg.scg.option.2", "I don't know/can't remember")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q9.helpGroup.text.0"),
            {
                content: _T(
                    "vaccination.HV.Q9.helpGroup.text.1",
                    "We would like to study what level of protection the vaccine provides. We would also like to know if there is any protection from vaccines received in previous years."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("vaccination.HV.Q9.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q9.helpGroup.text.3", "Answer 'yes' if you were vaccinated in autumn/winter 2020-2021."),
            },
        ];
    }
}


/**
 * FLU VACCINE THIS SEASON: single choice about this season's vaccine
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class FluVaccineThisSeason extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q10');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q10.title.0", "Have you received a flu vaccine this autumn/winter season? (2021-2022)"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: ResponseEncoding.flu_vaccine_season.yes, role: 'option',
                content: _T("vaccination.HV.Q10.rg.scg.option.0", "Yes")
            },
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q10.rg.scg.option.1", "No")
            },
            {
                key: '2', role: 'option',
                content: _T("vaccination.HV.Q10.rg.scg.option.2", "I don't know/can't remember")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q10.helpGroup.text.0"),
            {
                content: _T("vaccination.HV.Q10.helpGroup.text.1", "We would like to be able to work out how much protection the vaccine gives."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("vaccination.HV.Q10.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q10.helpGroup.text.3", "Report yes, if you received the vaccine this season, usually in the autumn. If you get vaccinated after filling in this questionnaire, please return to this and update your answer."),
            },
        ];
    }
}

class QuestionException extends Error {
    constructor(itemKey:string, message:string) {
        super("["+itemKey+"] " + message);
    }
}

interface SubVaccineQuestionProps extends ItemProps {
    triggerQuestion: string;
}

abstract class SubVaccineQuestion extends ItemQuestion {

    triggerQuestion?: string;
    triggerResponse?: string;

    constructor(props: SubVaccineQuestionProps, defaultKey: string) {
        super(props, defaultKey);
        this.triggerQuestion =  props.triggerQuestion;
    }

    getCondition() {
        if(!this.triggerQuestion) {
            return undefined;
        }
        if( this.triggerResponse == undefined) {
            throw new QuestionException(this.key, " Vaccination trigger response must be set");
        }
        return expWithArgs('responseHasKeysAny', this.triggerQuestion, singleChoicePrefix, this.triggerResponse);
    }
}

interface FluVaccineProps extends ItemProps {
    keyFluVaccineThisSeason: string
}

/**
 * WHEN RECEIVED FLU VACCINE THIS SEASON: single choice about this season's vaccine
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyFluVaccineThisSeason full key of the question about if you received flu vaccine this year, if set, dependency is applied
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class FluVaccineThisSeasonWhen extends SubVaccineQuestion {

    constructor( props: FluVaccineProps) {
        const p = {  triggerQuestion:props.keyFluVaccineThisSeason, ...props};
        super(p, 'Q10b');
        this.triggerResponse = ResponseEncoding.flu_vaccine_season.yes;
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q10b.title.0", "When were you vaccinated against flu this season (2021-2022)?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: [
                {
                    key: '1', role: 'dateInput',
                    optionProps: {
                        min: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', -21427200) },
                        max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 0) }
                    },
                    description: _T("vaccination.HV.Q10b.rg.scg.description.dateInput.0", "Choose date"),
                },
                {
                    key: '0', role: 'option',
                    content: _T("vaccination.HV.Q10b.rg.scg.option.1", "I don't know (anymore)")
                },
            ]
        });
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q10b.helpGroup.text.0"),

            {
                content: _T("vaccination.HV.Q10b.helpGroup.text.1", "Knowing when people get vaccinated tells us how the vaccination program is being followed, as well as the effectiveness of the vaccine."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("vaccination.HV.Q10b.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q10b.helpGroup.text.3", "Try to answer as precisely as possible. If you do not know the exact date, provide as close an estimate as possible. For example, if you remember the month, try to recall if it was in the beginning or end of the month. Did any important events take place (such as holidays or birthdays) that may help you to refresh your memory?"),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ]
    }
}


/**
 *  REASONS FOR FLU VACCINE THIS SEASON: multiple choice
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyFluVaccineThisSeason full key of the question about if you received flu vaccine this year, if set, dependency is applied
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class FluVaccineThisSeasonReasonFor extends SubVaccineQuestion {

    constructor( props: FluVaccineProps ) {
         const p = {  triggerQuestion:props.keyFluVaccineThisSeason, ...props};
        super(p, 'Q10c');
        this.triggerResponse = ResponseEncoding.flu_vaccine_season.yes;
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q10c.title.0", "What were your reasons for getting a seasonal influenza vaccination this year?"),
            topDisplayCompoments: [
                text_select_all_apply("vaccination.HV.Q10c.rg.LlBq.text.0")
            ],
            //helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '0', role: 'option',
                content: _T("vaccination.HV.Q10c.rg.mcg.option.0", "I belong to a risk group (e.g, pregnant, over 65, underlying health condition, etc)")
            },
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q10c.rg.mcg.option.1", "Vaccination decreases my risk of getting influenza")
            }, {
                key: '2', role: 'option',
                content: _T("vaccination.HV.Q10c.rg.mcg.option.2", "Vaccination decreases the risk of spreading influenza to others")
            },
            {
                key: '3', role: 'option',
                content: _T("vaccination.HV.Q10c.rg.mcg.option.3", "My doctor recommended it")
            },
            {
                key: '4', role: 'option',
                content: _T("vaccination.HV.Q10c.rg.mcg.option.4", "It was recommended in my workplace/school")
            },
            {
                key: '5', role: 'option',
                content: _T("vaccination.HV.Q10c.rg.mcg.option.5", "The vaccine was readily available and vaccine administration was convenient")
            },
            {
                key: '6', role: 'option',
                content: _T("vaccination.HV.Q10c.rg.mcg.option.6", "The vaccine was free (no cost)")
            },
            {
                key: '7', role: 'option',
                content: _T("vaccination.HV.Q10c.rg.mcg.option.7", "I don't want to miss work/school")
            }, {
                key: '8', role: 'option',
                content: _T("vaccination.HV.Q10c.rg.mcg.option.8", "I always get the vaccine")
            }, {
                key: '12', role: 'option',
                content: _T("vaccination.HV.Q10c.rg.mcg.option.9", "I try to protect myself against infections, because of the circulation of the pandemic coronavirus")
            }, {
                key: '9', role: 'input',
                style: [{ key: 'className', value: 'w-100' }],
                content: _T("vaccination.HV.Q10c.rg.mcg.input.10", "Other reason(s)"),
                description: _T("vaccination.HV.Q10c.rg.mcg.description.input.10", "Describe here (optional)")
            },
        ];
    }

    getHelpGroupContent() {

    }
}

/**
 *  REASONS AGAINST FLU VACCINE THIS SEASON: multiple choice
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyFluVaccineThisSeason full key of the question about if you received flu vaccine this year, if set, dependency is applied
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class FluVaccineThisSeasonReasonAgainst extends SubVaccineQuestion {

    constructor( props: FluVaccineProps) {
        const p = {  triggerQuestion:props.keyFluVaccineThisSeason, ...props};
        super(p, 'Q10d');
        this.triggerResponse = ResponseEncoding.flu_vaccine_season.no;
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            topDisplayCompoments: [
                text_select_all_apply("vaccination.HV.Q10d.rg.t2y2.text.0")
            ],
            questionText: _T("vaccination.HV.Q10d.title.0", "What were your reasons for NOT getting a seasonal influenza vaccination in seaseon 2020/2021?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '0', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.0", "I am planning to be vaccinated, but haven't been yet")
            },
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.1", "I haven't been offered the vaccine")
            },
            {
                key: '2', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.2", "I don't belong to a risk group")
            },
            {
                key: '3', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.3", "It is better to build your own natural immunity against influenza")
            },
            {
                key: '4', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.4", "I doubt that the influenza vaccine is effective")
            },
            {
                key: '5', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.5", "Influenza is a minor illness")
            },
            {
                key: '6', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.6", "I don't think I am likely to get influenza")
            },
            {
                key: '7', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.7", "I believe that influenza vaccine can cause influenza")
            }, {
                key: '8', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.8", "I am worried that the vaccine is not safe or will cause illness or other adverse events")
            }, {
                key: '9', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.9", "I don't like having vaccinations")
            }, {
                key: '10', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.10", "The vaccine is not readily available to me")
            }, {
                key: '11', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.11", "The vaccine is not free of charge")
            }, {
                key: '12', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.12", "No particular reason")
            }, {
                key: '13', role: 'option',
                content: _T("vaccination.HV.Q10d.rg.mcg.option.13", "Although my doctor recommend a vaccine, I do not get one")
            }, {
                key: '14', role: 'input',
                content: _T("vaccination.HV.Q10d.rg.mcg.input.14", "Other reason(s)"),
                description: _T("vaccination.HV.Q10d.rg.mcg.description.input.14", "Describe here (optional)")
            },
        ]
    }

    getHelpGroupContent() {
       return [
            text_why_asking("vaccination.HV.Q10d.helpGroup.text.0"),
            {
                content: _T("vaccination.HV.Q10d.helpGroup.text.1", "We would like to know why some people get vaccinated and others do not."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer( "vaccination.HV.Q10d.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q10d.helpGroup.text.3", "Tick all those reasons that were important in your decision."),
            },
        ]
    }
}


/**
 * CovidVac: single choice question about vaccination status
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class CovidVac extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props,  'Q35');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q35.title.0", "Have you received a COVID-19 vaccine?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q35.rg.scg.option.0", "Yes, I received at least one COVID-19 vaccine")
            },
            {
                key: '0', role: 'option',
                content: _T("vaccination.HV.Q35.rg.scg.option.1", "No, I did not receive the COVID-19 vaccine")
            },
            {
                key: '2', role: 'option',
                content: _T("vaccination.HV.Q35.rg.scg.option.2", "I don't know/can't remember.")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q35.helpGroup.text.0"),
                {
                    content: _T("vaccination.HV.Q35.helpGroup.text.1", "We would like to be able to work out how much protection the vaccine gives."),
                    style: [{ key: 'variant', value: 'p' }],
                },
                text_how_answer("vaccination.HV.Q35.helpGroup.text.2"),
                {
                    content: _T("vaccination.HV.Q35.helpGroup.text.3", "Report yes, if you received a COVID-19 vaccine (since December 2020)."),
                    // style: [{ key: 'variant', value: 'p' }],
                },
        ];

    }
}


interface CovidVacProps extends ItemProps {
    keyVac: string // Dependent question Covid Vaccination question key
}

/**
 * Covid VACCINE BRAND: Which vaccine was provided
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyVac Covid vaccination question key
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class CovidVaccineBrand extends SubVaccineQuestion {

    constructor(props: CovidVacProps) {
        const p = {triggerQuestion: props.keyVac, ...props}
        super(p, 'Q35i');
        this.triggerResponse = ResponseEncoding.covid_vac.yes;
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q35i.title.0", "Which COVID-19 vaccine(s) did you receive?"),
            helpGroupContent: this.getHelpGroupContent(),
            topDisplayCompoments: [
                text_select_all_apply("vaccination.HV.Q35i.rg.LMsj.text.0"),
            ],
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q35i.rg.mcg.option.0", "Pfizer/BioNTech")
            },
            {
                key: '2', role: 'option',
                content: _T("vaccination.HV.Q35i.rg.mcg.option.1", "Moderna")
            },
            {
                key: '3', role: 'option',
                content: _T("vaccination.HV.Q35i.rg.mcg.option.2", "AstraZeneca")
            },
            {
                key: '4', role: 'option',
                content: _T("vaccination.HV.Q35i.rg.mcg.option.3", "Janssen Pharmaceutica (Johnson & Johnson)")
            },
            {
                key: '99', role: 'option',
                content: _T("vaccination.HV.Q35i.rg.mcg.option.5", "I Don't know/Can't remember")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q35i.helpGroup.text.0"),
            {
                content: _T("vaccination.HV.Q35i.helpGroup.text.1", "We want to know how many people got vaccinated with what brand"),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("vaccination.HV.Q35i.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q35i.helpGroup.text.3", "Specify which brand (or brands if you hade more than one type) you got vaccinated with"),
            },
        ];
    }
}

/**
 * VACCINE SHOTS: How many times has the participant been vaccinated
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyVac Covid vaccination question key
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class CovidVaccineShots extends SubVaccineQuestion {

    constructor(props: CovidVacProps) {
        const p = { triggerQuestion: props.keyVac, ...props}
        super(p, 'Q35c');
        this.triggerResponse = ResponseEncoding.covid_vac.yes;
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q35c.title.0", "How many doses of the vaccine did you receive?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q35c.rg.scg.option.0", "One")
            },
            {
                key: '2', role: 'option',
                content: _T("vaccination.HV.Q35c.rg.scg.option.1", "Two")
            },
            {
                key: '4', role: 'option',
                content: _T("vaccination.HV.Q35c.rg.scg.option.2", "Three")
            },
            {
                key: '5', role: 'option',
                content: _T("vaccination.HV.Q35c.rg.scg.option.3", "More than three")
            },
            {
                key: '99', role: 'option',
                content: _T("vaccination.HV.Q35c.rg.scg.option.4", "I Don't know/Can't remember")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q35c.helpGroup.text.0"),
            {
                content: _T("vaccination.HV.Q35c.helpGroup.text.1", "We would like to be able to work out how much protection a complete vaccination scheme gives."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("vaccination.HV.Q35c.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q35c.helpGroup.text.3", "Report the number of doses you received (which corresponds to the number of time you were vaccinated against COVID-19 )."),
            },
        ];
    }
}


/**
 * DATE LAST VACCINE: What is the date of the last vaccination
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyvac Key of the question vaccination
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class CovidDateLastVaccine extends SubVaccineQuestion {

    constructor(props: CovidVacProps) {
        const p = {triggerQuestion: props.keyVac, ...props}
        super(p, 'Q35j');
        this.triggerResponse =ResponseEncoding.covid_vac.yes;
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q35j.title.0", "When did you receive your last injection of a vaccine against COVID-19? If you do not know the exact date, provide an estimate."),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: [
                {
                    key: '1', role: 'dateInput',
                    optionProps: {
                        max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 10) },
                    },
                    description: _T("vaccination.HV.Q35j.rg.scg.dateInput.0", "Choose date")
                },
                {
                    key: '0', role: 'option',
                    content: _T("vaccination.HV.Q35j.rg.scg.option.1", "I don’t know/can’t remember")
                },
            ]
        });
    }

    getResponses() {
        return ;
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q35j.helpGroup.text.0"),
            {
                content: _T("vaccination.HV.Q35j.helpGroup.text.1", "Knowing when people are vaccinated tells us how well the vaccination program is being carried out."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("vaccination.HV.Q35j.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q35j.helpGroup.text.3", "Please try and answer as accurately as possible. If you do not know the precise date, please give your best estimate of the month and year of vaccination."),
            },
        ];
    }
}


interface CovidSecondVacProps extends CovidVacProps {
    keyVaccineShots?: string // Key for number of Vaccine Short question
}

/**
 * SECOND SHOT: single choice question about second shot planned
 */

 export class CovidSecondShotPlan extends SubVaccineQuestion {

    keyVaccineShots?:string;

    /**
    * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
    * @param keyVac Question about Covid Vaccination status
    * @param keyVaccineShots question key about vaccination shots count
    * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
    * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
    */

    constructor(props: CovidSecondVacProps) {
 const p = {triggerQuestion: props.keyVac, ...props}
        super(p,'Q35k');
        this.keyVaccineShots = props.keyVaccineShots;
        this.triggerResponse = ResponseEncoding.covid_vac.yes;
    }

    getCondition() {
        const cond = super.getCondition();
        if(this.keyVaccineShots) {
            return expWithArgs('and',
                cond,
                expWithArgs('responseHasKeysAny', this.keyVaccineShots, singleChoicePrefix, ResponseEncoding.covid_vac_shots.one)
            );
        }
        return cond;
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q35k.title.0", "Do you plan to receive a second injection in the upcoming weeks?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q35k.rg.scg.option.0", "Yes")
            },
            {
                key: '0', role: 'option',
                content: _T("vaccination.HV.Q35k.rg.scg.option.1", "No")
            },
            {
                key: '99', role: 'option',
                content: _T("vaccination.HV.Q35k.rg.scg.option.2", "I don't know")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q35k.helpGroup.text.0"),
            {
                content: _T("vaccination.HV.Q35k.helpGroup.text.1", "We want to study how long it takes for people to get the second dose after having received the first"),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("vaccination.HV.Q35k.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q35k.helpGroup.text.3", "Select the option that is most appropriate for your situation"),
            },
        ];
    }
}


/**
 * CovidSecondShotAgainstReason: reasons why no second dose
 */
export class CovidSecondShotAgainstReason extends SubVaccineQuestion {

    keyVaccineShots?:string;

    /**
    * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
    * @param keyVac Question about Covid Vaccination status
    * @param keyVaccineShots question key about vaccination shots count
    * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
    * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
    */

     constructor(props: CovidSecondVacProps) {
        const p = {triggerQuestion: props.keyVac, ...props}
        super(p, 'Q35l');
        this.keyVaccineShots = props.keyVaccineShots;
        this.triggerResponse = ResponseEncoding.covid_vac.yes;
    }

    getCondition() {
        const cond = super.getCondition();
        // '0' response ?
        if(this.keyVaccineShots) {
            return expWithArgs('and',
                cond,
                expWithArgs('responseHasKeysAny', this.keyVaccineShots, singleChoicePrefix, '0', ResponseEncoding.covid_vac_shots.dontknow )
            );
        }
        return cond;
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q35l.title.0", "Why receiving a single injection?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q35l.rg.scg.option.0", "I had COVID-19 before my first injection.")
            },
            {
                key: '2', role: 'option',
                content: _T("vaccination.HV.Q35l.rg.scg.option.1", "I had COVID-19 shortly after my first injection, and have to wait several months to receive the second injection.")
            },
            {
                key: '3', role: 'option',
                content: _T("vaccination.HV.Q35l.rg.scg.option.2", " I received Janssen vaccine, which requires only one injection.")
            },
            {
                key: '4', role: 'option',
                content: _T("vaccination.HV.Q35l.rg.scg.option.3", "A second injection was contraindicated for me by a doctor (I had a severe allergic reaction, or a severe adverse effect after the first injection, or I have a temporary contraindication due to a treatment or a disease).")
            },
            {
                key: '5', role: 'option',
                content: _T("vaccination.HV.Q35l.rg.scg.option.4", "I changed my mind and don’t want to be vaccinated anymore.")
            },
            {
                key: '6', role: 'input',
                style: [{ key: 'className', value: 'w-100' }],
                content: _T("vaccination.HV.Q35l.rg.scg.input.5", "Other"),
                description: _T("vaccination.HV.Q35l.rg.scg.description.input.5", "Describe here (optional)")
            },
            {
                key: '0', role: 'option',
                content: _T("vaccination.HV.Q35l.rg.scg.option.6", "I don't know")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q35l.helpGroup.text.0"),
            {
                content: _T("vaccination.HV.Q35l.helpGroup.text.1", "We would like to know the reasons behind the selected option of receiving just one dose"),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer( "vaccination.HV.Q35l.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q35l.helpGroup.text.3", "Select the option that is most appropriate for your situation"),
            },
        ];
    }
}

/**
 * VACCINE PRO: reasons why pro vaccination
 */
export class CovidVaccineProReasons extends SubVaccineQuestion {

    /**
    * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
    * @param keyvac Covid Vaccination question key
    * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
    * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
     */
    constructor(props: CovidVacProps) {
        const p = {triggerQuestion: props.keyVac, ...props}
        super(p, 'Q35f');
        this.triggerResponse = ResponseEncoding.covid_vac.yes;
    }

    buildItem() {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q35f.title.0", "What are your reason(s) for getting a COVID-19 vaccination?"),
            topDisplayCompoments: [
                text_select_all_apply("vaccination.HV.Q35f.rg.T5UL.text.0"),
            ],
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '21', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.0", "The vaccination is recommended by public health authorities.")
            },
            {
                key: '0', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.1", "I belong to a group who is at risk of complications in case of COVID-19 (over 65 of age, underlying health condition, obesity, etc.).")
            },
            {
                key: '20', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.2", "I work in close contact with people at risk of complications in case of COVID-19 (working in a nursing home, health staff…).")
            },
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.3", "Vaccination decreases my risk of getting COVID-19.")
            },
            {
                key: '2', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.4", "Vaccination decreases the risk of spreading COVID-19 to others.")
            },
            {
                key: '3', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.5", "My doctor recommended it.")
            },
            {
                key: '4', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.6", "It was recommended in my workplace/school.")
            },
            {
                key: '5', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.7", "The vaccine was readily available and vaccine administration was convenient.")
            },
            {
                key: '6', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.8", "The vaccine was free (no cost).")
            },
            {
                key: '7', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.9", "I don’t want to miss work/school.")
            },
            {
                key: '8', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.10", "I always accept vaccination when it is offered to me.")
            },
            {
                key: '22', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.11", "I have to be vaccinated to work.")
            },
            {
                key: '23', role: 'option',
                content: _T("vaccination.HV.Q35f.rg.mcg.option.12", "To obtain a valid vaccination passport.")
            },
            {
                key: '9', role: 'input',
                style: [{ key: 'className', value: 'w-100' }],
                content: _T("vaccination.HV.Q35f.rg.mcg.input.13", "Other"),
                description: _T("vaccination.HV.Q35f.rg.mcg.description.input.13", "Describe here (optional)")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q35f.helpGroup.text.0"),
            {
                content: _T("vaccination.HV.Q35f.helpGroup.text.1", "We would like to know the main reasons why people get the vaccine."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("vaccination.HV.Q35f.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q35f.helpGroup.text.3", "Please select the options that mattered to take your decision."),
            },
        ];
    }
}

export class CovidVaccineAgainstReasons extends SubVaccineQuestion {

    /**
    * @param parentKey * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
    * @param keyvac Covid Vaccination question key
    * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
    * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
     */
     constructor(props: CovidVacProps) {
        const p = {triggerQuestion: props.keyVac, ...props}
        super(p, 'Q35m');
        this.triggerResponse = ResponseEncoding.covid_vac.no;
    }

    buildItem() {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("vaccination.HV.Q35m.title.0", "What were your reasons for NOT getting a COVID-19 vaccination? Select the options that are most applicable."),
            topDisplayCompoments: [
                text_select_all_apply("vaccination.HV.Q35m.rg.nm76.text.0"),
            ],
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '0', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.0", "I am planning to be vaccinated but haven’t been yet")
            },
            {
                key: '1', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.1", "I haven't been offered the vaccine")
            },
            {
                key: '15', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.2", "I have been discouraged from being vaccinated because I am pregnant")
            },
            {
                key: '16', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.3", "I am pregnant and I fear the vaccine could be dangerous for my baby")
            },
            {
                key: '2', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.4", "I don’t belong to a risk group")
            },
            {
                key: '3', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.5", "It is better to build your own natural immunity against COVID-19")
            },
            {
                key: '4', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.6", "I doubt that the COVID-19 vaccine is effective")
            },
            {
                key: '5', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.7", "COVID-19 is a minor illness")
            },
            {
                key: '17', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.8", "Because of COVID-19 pandemic, I avoid seeing doctors or going to the pharmacy")
            },
            {
                key: '6', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.9", "I don't think I am likely to get the COVID-19")
            },
            {
                key: '7', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.10", "I believe that the COVID-19 vaccine can cause COVID-19")
            },
            {
                key: '8', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.11", "I am worried that the vaccine is not safe or will cause illness or other adverse events")
            },
            {
                key: '9', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.12", "I don't like having vaccinations")
            },
            {
                key: '10', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.13", "The vaccine is not readily available to me")
            },
            {
                key: '20', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.14", "I disagree with the current vaccine policy")
            },
            {
                key: '11', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.15", "The vaccine is not free of charge")
            },
            {
                key: '12', role: 'option',
                content: _T("vaccination.HV.Q35m.rg.mcg.option.16", "I don't know")
            },
            {
                key: '14', role: 'input',
                content: _T("vaccination.HV.Q35m.rg.mcg.input.17", "Other reason(s)"),
                description: _T("vaccination.HV.Q35m.rg.mcg.description.input.17", "Describe here (optional)")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("vaccination.HV.Q35m.helpGroup.text.0"),
            {
                content: _T("vaccination.HV.Q35m.helpGroup.text.1", "We would like to know the main reasons why people are declining COVID-19 vaccination."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("vaccination.HV.Q35m.helpGroup.text.2"),
            {
                content: _T("vaccination.HV.Q35m.helpGroup.text.3", "Please select the options that mattered to take your decision."),
            },
        ];
    }
}
