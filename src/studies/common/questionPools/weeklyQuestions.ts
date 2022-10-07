import { LanguageMap, _T } from "../languages"
import { Group, Item, OptionDef } from "case-editor-tools/surveys/types";
import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { initMatrixQuestion,  ResponseRowCell } from "case-editor-tools/surveys/responseTypeGenerators/matrixGroupComponent";
import { initLikertScaleItem } from "case-editor-tools/surveys/responseTypeGenerators/likertGroupComponents";
import { expWithArgs, generateHelpGroupComponent, generateLocStrings, generateTitleComponent } from "case-editor-tools/surveys/utils/simple-generators";
import { likertScaleKey, matrixKey, responseGroupKey } from "case-editor-tools/constants/key-definitions";
import { MultipleChoicePrefix, singleChoicePrefix, text_how_answer, text_select_all_apply, text_why_asking, require_response, trans_select_all_apply } from "./helpers";
import { SurveyItems } from 'case-editor-tools/surveys';
import { ComponentGenerators } from "case-editor-tools/surveys/utils/componentGenerators";
import { SymptomKeysType, WeeklyResponses as ResponseEncoding } from "../responses/weekly";
import { GroupProps, GroupQuestion, ItemProps, ItemQuestion } from "./types";
import { ClientExpression as client } from "../../../tools/expressions";
import { Expression } from "survey-engine/data_types";

interface SymptomsProps extends ItemProps {
    useRash: boolean;
}

/**
 * SYMPTOMS: multiple choice question about allergies
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class Symptoms extends ItemQuestion {
    useRash: boolean;

    constructor(props: SymptomsProps) {
        super(props, 'Q1');
        this.useRash = props.useRash;
    }

    /**
     * Helper to create a condition based on this question response
     * @param symptoms
     * @returns
     */
    createSymptomCondition(...symptoms: SymptomKeysType[]) {

        const r : string[] = [];
        symptoms.forEach(symptom=> {
            r.push(ResponseEncoding.symptoms[symptom]);
        })

        return client.multipleChoice.any(this.key, ...r);
    }

    /**
     * Helper to create a condition based on this question response checking for any response except 'no-symptom' response
     * @returns
     */
    createAnySymptomCondition() {
        return client.responseHasOnlyKeysOtherThan(this.key, MultipleChoicePrefix, ResponseEncoding.symptoms.no_symptom);
    }

    buildItem() {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T(
                "weekly.Q1.title.0",
                "Have you had any of the following symptoms since your last questionnaire (or in the past week, if this the first tie you are taking this questionnaire)?"
            ),
            helpGroupContent: this.getHelpGroupContent(),
            bottomDisplayCompoments: [
                ComponentGenerators.text({
                    content: _T(
                        "weekly.Q1.rg.cGJZ.text.0",
                        "Multiple answers possible. If you suffer from chronic illness, only indicate symptoms that have changed. For example, if you experience chronic shortness of breath, only mark this symptom if it has recently gotten worse."
                    ),
                })
            ],
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        const codes = ResponseEncoding.symptoms;
        const exclusiveOptionRule =  client.multipleChoice.any(this.key, codes.no_symptom);
        const r : OptionDef[] =  [
            {
                key: codes.no_symptom,
                role: 'option',
                content: _T("weekly.Q1.rg.mcg.option.0", "No symptoms"),
            },
            {
                key: codes.fever, role: 'option',
                disabled:exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.1", "Fever")
            },
            {
                key: codes.chills, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T("weekly.Q1.rg.mcg.option.2", "Chills")
            },
            {
                key: codes.rhino, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T("weekly.Q1.rg.mcg.option.3", "Runny or blocked nose")
            },
            {
                key: codes.sneeze, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T("weekly.Q1.rg.mcg.option.4","Sneezing")
            },
            {
                key: codes.sorethroat, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.5", "Sore throat")
            },
            {
                key: codes.cough, role: 'option',
                disabled:exclusiveOptionRule,
                content: _T("weekly.Q1.rg.mcg.option.6", "Cough")
            },
            {
                key: codes.dyspnea, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.7", "Shortness of breath")
            },
            {
                key: codes.headache, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T("weekly.Q1.rg.mcg.option.8", "Headache")
            },
            {
                key: codes.pain, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.9", "Muscle/joint pain")
            },
            {
                key: codes.chestpain, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.10", "Chest pain")
            },
            {
                key: codes.asthenia, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T("weekly.Q1.rg.mcg.option.11", "Feeling tired or exhausted (malaise)")
            },
            {
                key: codes.anorexia, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.12", "Loss of appetite")
            },
            {
                key: codes.sputum, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.13", "Coloured sputum/phlegm")
            },
            {
                key: codes.wateryeye, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.14", "Watery, bloodshot eyes")
            },
            {
                key: codes.nausea, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T("weekly.Q1.rg.mcg.option.15", "Nausea")
            },
            {
                key: codes.vomiting, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T("weekly.Q1.rg.mcg.option.16",  "Vomiting")
            },
            {
                key: codes.diarrhea, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.17", "Diarrhoea")
            },
            {
                key: codes.abdopain, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.18", "Stomachache")
            },
            {
                key: codes.loss_smell, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T("weekly.Q1.rg.mcg.option.19", "Loss of smell")
            },
            {
                key: codes.loss_taste, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.20", "Loss of taste"),
            },
            {
                key: codes.nose_bleed, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T("weekly.Q1.rg.mcg.option.21","Nose bleed"),
            },
        ];

        if(this.useRash) {

            r.push({
                key: codes.rash, role: 'option',
                disabled: exclusiveOptionRule,
                content: _T( "weekly.Q1.rg.mcg.option.22","Rash")
            });
        }

        r.push(
        {
            key: codes.other, role: 'option',
            disabled: exclusiveOptionRule,
            content: _T( "weekly.Q1.rg.mcg.option.23", "Other"),
        });

        return r;
    }

    getHelpGroupContent() {
       return [
            text_why_asking("weekly.Q1.helpGroup.text.0"),
            {
                content: _T(
                    "weekly.Q1.helpGroup.text.1",
                    "The most important part of this study is about following up on the symptoms you have reported."
                ),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.Q1.helpGroup.text.2"),
            {
                content: _T(
                    "weekly.Q1.helpGroup.text.3",
                    "If you suffer from chronic illness, only indicate symptoms that have changed. For example, if you experience chronic shortness of breath, only mark this symptom if it has recently gotten worse. Multiple answers possible."
                ),
            },
        ];
    }
}

interface SymptomsGroupProps {
    parentKey: string
    keySymptomsQuestion: string
    defaultKey?: string
}

/**
 * GROUP DEPENDING ON IF ANY SYMPTOMS PRESENT
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySymptomsQuestion reference to the symptom survey
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class SymptomsGroup extends GroupQuestion {

    keySymptomsQuestion: string;

    getCondition() {
        return client.responseHasOnlyKeysOtherThan(this.keySymptomsQuestion, MultipleChoicePrefix, ResponseEncoding.symptoms.no_symptom);
    }

    constructor(props:SymptomsGroupProps) {
        super(props, 'HS');
        this.keySymptomsQuestion = props.keySymptomsQuestion;
    }

    buildGroup() {

    }
}

/**
 * SAME ILLNESS
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class SameIllness extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q2');
    }

    getCondition() {
        const hadOngoingSymptomsLastWeek = expWithArgs('eq',
                    expWithArgs('getAttribute', expWithArgs('getAttribute', expWithArgs('getContext'), 'participantFlags'), 'prev'),
                    "1"
              );
        return hadOngoingSymptomsLastWeek;
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T(
                "weekly.HS.Q2.title.0",
                "When you filled in the previous questionnaire, you indicated that you were still sick. Are the symptoms you are  reporting now from the same timeframe as the symptoms you reported the last time?"
                ),
            helpGroupContent: this.getHelpGroupContent(),
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
                key: '0', role: 'option',
                content: _T("weekly.HS.Q2.rg.scg.option.0", "Yes")
            },
            {
                key: '1', role: 'option',
                content: _T("weekly.HS.Q2.rg.scg.option.1", "No")
            },
            {
                key: '2', role: 'option',
                content: _T("weekly.HS.Q2.rg.scg.option.2", "I don’t know/can’t remember")
            },
            {
                key: '9', role: 'option',
                content: _T("weekly.HS.Q2.rg.scg.option.3", "This does not apply to me")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.HS.Q2.helpGroup.text.0"),
            {
                content: _T("weekly.HS.Q2.helpGroup.text.1", "To speed up the completion of the rest of the questionnaire."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.HS.Q2.helpGroup.text.2"),
            {
                content: _T("weekly.HS.Q2.helpGroup.text.3", "If you think that the complaints you are indicating today are caused by the same infection or the same problem (the same period during which you experienced the complaints), answer 'yes'."),
            },
        ];
    }
}


/**
 * PCR TESTED CONTACTS COVID-19: single choice question about contact with PCR tested Covid19 patients
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
 export class PcrTestedContact extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Qcov3');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T(
                "weekly.HS.Qcov3.title.0",
                 "In the 14 days before your symptoms started, have you been in close contact with someone for whom an antigenic or PCR test has confirmed that they have COVID-19?"
            ),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        const codes = ResponseEncoding.pcr_contacts;
        return [
            {
                key: codes.yes, role: 'option', content: _T("weekly.HS.Qcov3.rg.scg.option.0", "Yes")
            },
            {
                key: codes.no, role: 'option',
                content: _T( "weekly.HS.Qcov3.rg.scg.option.1",  "No")
            },
            {
                key: codes.dont_know, role: 'option',
                content: _T( "weekly.HS.Qcov3.rg.scg.option.2",  "I don’t know/can’t remember")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.HS.Qcov3.helpGroup.text.0"),
            {
                content: _T( "weekly.HS.Qcov3.helpGroup.text.1", "In  order to study how the coronavirus spreads within the general population.")
            },
        ];
    }
}

interface PcrCovidProps extends ItemProps {
    covid19ContactKey: string
}

export class PcrHouseholdContact extends ItemQuestion {
    covid19ContactKey: string

    constructor(props: PcrCovidProps) {
        super(props, 'Qcov3b');
        this.covid19ContactKey = props.covid19ContactKey;
    }

    getCondition() {
        return client.responseHasKeysAny(this.covid19ContactKey, singleChoicePrefix, ResponseEncoding.pcr_contacts.yes);
        // expWithArgs('responseHasKeysAny', covid19ContactKey, [responseGroupKey, singleChoiceKey].join('.'), '1')
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T(
                "weekly.HS.Qcov3b.title.0", "Was this person or one of these persons a member of your household?"
            ),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '1', role: 'option', content: _T("weekly.HS.Qcov3b.rg.scg.option.0",  "Yes")
            },
            {
                key: '0', role: 'option',
                content: _T( "weekly.HS.Qcov3b.rg.scg.option.1",  "No")
            },
            {
                key: '2', role: 'option',
                content: _T( "weekly.HS.Qcov3b.rg.scg.option.2", "I don’t know")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.HS.Qcov3b.helpGroup.text.0"),
            {
                content: _T( "weekly.HS.Qcov3b.helpGroup.text.1", "The coronavirus and influenza spread quickly indoors."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.HS.Qcov3b.helpGroup.text.2"),
            {
                content: _T(
                    "weekly.HS.Qcov3b.helpGroup.text.3",
                    "A member of the household is defined as a person (not necessary a family member) who lives at the same address as you, and who shares the kitchen, living room, family room or dining room."
                ),
            },
        ]
    }
}

interface SameIllnessProps extends ItemProps {
    keySameIllness: string; // reference to 'same illness' question
}


/**
 * SYMPTOMS START
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySameIllness reference to 'same illness' question
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class SymptomsStart extends ItemQuestion {

    keySameIllness: string;

    constructor(props: SameIllnessProps) {
        super(props, 'Q3');
        this.keySameIllness = props.keySameIllness;
    }

    getCondition() {
        const codes = ResponseEncoding.same_illness;
        return expWithArgs('not',
            expWithArgs('responseHasKeysAny', this.keySameIllness, singleChoicePrefix, codes.yes, codes.notapply)
        );
    }

    buildItem() {

        const date_input_key = ResponseEncoding.symptoms_start.date_input;

        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T(
                "weekly.HS.Q3.title.0",
                "On what day did you begin feeling the first symptoms? If you do not recall the exact date, please give an approximate date."
            ),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: [
                {
                    key: date_input_key, role: 'dateInput',
                    optionProps: {
                        min: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', -5184000) },
                        max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 10) },
                    },
                    description: _T( "weekly.HS.Q3.rg.scg.dateInput.0", "Choose date"),
                },
                {
                    key: '1', role: 'option',
                    content: _T("weekly.HS.Q3.rg.scg.option.1", "I don't know/can't remember"),
                },
            ]
        });
    }

    getResponses() {
        return ;
    }

    getHelpGroupContent() {
        return [
            text_why_asking( "weekly.HS.Q3.helpGroup.text.0"),
            {
                content: _T(
                    "weekly.HS.Q3.helpGroup.text.1",
                    "This question will help us to determine how many people are experiencing symptoms per day/week."
                ),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.HS.Q3.helpGroup.text.2"),
            {
                content: _T( "weekly.HS.Q3.helpGroup.text.3", "Answer as precisely as possible.")
            },
        ]
    }
}

interface SymptomEndProps extends ItemProps {
    keySymptomsStart: string
}


/**
 * Get the value of the date of symptomStartDate question
 * @param keySymptomsStart The item key of the question
 * @returns
 */
const getSymptomStartDate = (keySymptomsStart: string): Expression => {
    const date_input_key = ResponseEncoding.symptoms_start.date_input;

    return {
        name: 'getAttribute',
        data: [
            { dtype: 'exp', exp: client.getResponseItem(keySymptomsStart, [singleChoicePrefix, date_input_key].join('.')) },
            { str: 'value', dtype: 'str' }
        ],
        returnType: 'int',
    };

}


/**
 * SYMPTOMS END
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySymptomsStart reference to symptoms start question
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class SymptomsEnd extends ItemQuestion {

    keySymptomsStart: string;

    constructor(props: SymptomEndProps) {
        super(props, 'Q4');
        this.keySymptomsStart = props.keySymptomsStart;
    }

    buildItem() {

        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T( "weekly.HS.Q4.title.0", "When did your symptoms end?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: [
                {
                    key: '0', role: 'dateInput',
                    optionProps: {
                        min: { dtype: 'exp', exp: getSymptomStartDate(this.keySymptomsStart) },
                        max: { dtype: 'exp', exp: client.timestampWithOffset({seconds: 10}) },
                    },
                    description: _T("weekly.HS.Q4.rg.scg.dateInput.0", "Choose date"),
                },
                {
                    key: '1', role: 'option',
                    content: _T( "weekly.HS.Q4.rg.scg.option.1", "I don't know/can't remember")
                },
                {
                    key: '2', role: 'option',
                    content: _T( "weekly.HS.Q4.rg.scg.option.2", "I am still ill")
                },
            ]
        });
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.HS.Q4.helpGroup.text.0"),
            {
                content: _T(
                    "weekly.HS.Q4.helpGroup.text.1",
                    "We can use the first and last dates of the complaints to calculate how long your complaints lasted. "
                ),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.HS.Q4.helpGroup.text.2"),
            {
                content: _T( "weekly.HS.Q4.helpGroup.text.3", "Answer as precisely as possible.")
            },
        ];
    }
}

/**
 * SYMPTOMS DEVELOPED SUDDENLY
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class SymptomsSuddenlyDeveloped extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q5');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T( "weekly.HS.Q5.title.0", "Did your symptoms develop suddenly over a few hours?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {

        return [
            {
                key: '0', role: 'option',
                content: _T( "weekly.HS.Q5.rg.scg.option.0", "Yes"),
            },
            {
                key: '1', role: 'option',
                content: _T( "weekly.HS.Q5.rg.scg.option.1", "No"),
            },
            {
                key: '2', role: 'option',
                content: _T( "weekly.HS.Q5.rg.scg.option.2", "I don’t know/can’t remember")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.HS.Q5.helpGroup.text.0"),
            {
                content: _T(  "weekly.HS.Q5.helpGroup.text.1", "The sudden onset of symptoms (within a few hours) is linked to the coronavirus and influenza."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.HS.Q5.helpGroup.text.2"),
            {
                content: _T( "weekly.HS.Q5.helpGroup.text.3", "Answer “yes” if your symptoms appeared within a few hours, and not gradually over a period of several days."),
            },
        ];
    }
}

interface SymptomsAndStartProps extends ItemProps {
    keySymptomsQuestion: string
    keySymptomStart: string
}

export class FeverStart extends ItemQuestion {
    keySymptomsQuestion: string
    keySymptomStart: string

    constructor(props: SymptomsAndStartProps) {
        super(props, '');
        this.keySymptomsQuestion = props.keySymptomsQuestion;
        this.keySymptomStart = props.keySymptomStart;
    }

    getCondition() {
        return client.responseHasKeysAny(this.keySymptomsQuestion, MultipleChoicePrefix, ResponseEncoding.symptoms.fever);
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T(
                "weekly.HS.Q6.title.0",
                "On what day did your fever start? If you do not recall the exact date, please give an approximate date."
            ),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: [
                {
                    key: '1', role: 'dateInput',
                    optionProps: {
                        min: { dtype: 'exp', exp: getSymptomStartDate(this.keySymptomStart)},
                        max: { dtype: 'exp', exp: client.timestampWithOffset({ seconds: 10 }) },
                    },
                    description: _T("weekly.HS.Q6.rg.scg.dateInput.0", "Choose date")
                },
                {
                    key: '2', role: 'option',
                    content: _T( "weekly.HS.Q6.rg.scg.option.1", "I don’t know/can’t remember")
                },
            ]
        });
    }

    getHelpGroupContent() {
        return [
            text_why_asking( "weekly.HS.Q6.helpGroup.text.0"),
            {
                content:_T(  "weekly.HS.Q6.helpGroup.text.1", "Fever is an important diagnostic symptom, so we would like to know when the fever appeared."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.HS.Q6.helpGroup.text.2"),

            {
                content: _T(  "weekly.HS.Q6.helpGroup.text.3", "Answer as precisely as possible."),
                style: [{ key: 'variant', value: 'p' }],
            },
        ]
    }
}

interface SymptomDependentProps extends ItemProps {
    keySymptomsQuestion: string
}

abstract class SymptomDependentQuestion extends ItemQuestion {

    keySymptomsQuestion: string;

    constructor(defaultKey: string, props:SymptomDependentProps ) {
        super(props, defaultKey);
        this.keySymptomsQuestion = props.keySymptomsQuestion;
    }

    abstract getTriggerSymptoms(): Array<string>;

    getCondition() {
        const symptoms = this.getTriggerSymptoms();
        return client.multipleChoice.any(this.keySymptomsQuestion, ...symptoms);
        //expWithArgs('responseHasKeysAny', keySymptomsQuestion, [responseGroupKey, multipleChoiceKey].join('.'), '1')
    }
}


/**
 * FEVER DEVELOPED SUDDENLY
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class FeverDevelopedSuddenly extends SymptomDependentQuestion {

    constructor(props: SymptomDependentProps) {
        super('b', props );
    }

    getTriggerSymptoms() {
        return [
            ResponseEncoding.symptoms.fever
        ];
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.HS.Q6b.title.0" , "Did your fever develop suddenly over a few hours?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '0', role: 'option',
                content: _T(  "weekly.HS.Q6b.rg.scg.option.0", "Yes")
            },
            {
                key: '1', role: 'option',
                content: _T(  "weekly.HS.Q6b.rg.scg.option.1",  "No")
            },
            {
                key: '3', role: 'option',
                content: _T(  "weekly.HS.Q6b.rg.scg.option.2", "I don’t know/can’t remember")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.HS.Q6b.helpGroup.text.0"),
            {
                content: _T("weekly.HS.Q6b.helpGroup.text.1", "The sudden onset of symptoms (within a few hours) is linked to the coronavirus and influenza."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.HS.Q6b.helpGroup.text.2"),
            {
                content: _T("weekly.HS.Q6b.helpGroup.text.3", "Answer “yes” if your symptoms appeared within a few hours, and not gradually over a period of several days."),
            },
        ];
    }
}


export class DidUMeasureTemperature extends SymptomDependentQuestion {

    constructor(props: SymptomDependentProps) {
        super('c', props );
    }

    getTriggerSymptoms() {
        return [
            ResponseEncoding.symptoms.fever
        ];
    }


    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.HS.Q6c.title.0", "Did you take your temperature?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        const codes = ResponseEncoding.measure_temp;
        return  [
            {
                key: codes.yes, role: 'option',
                content: _T("weekly.HS.Q6c.rg.scg.option.0", "Yes")
            },
            {
                key: codes.no, role: 'option',
                content: _T("weekly.HS.Q6c.rg.scg.option.1", "No")
            },
            {
                key: codes.dont_know, role: 'option',
                content: _T("weekly.HS.Q6c.rg.scg.option.2", "I don’t know/can’t remember")
            },
        ]
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.HS.Q6c.helpGroup.text.0"),
            {
                content: _T("weekly.HS.Q6c.helpGroup.text.1", "If you have taken your temperature, we would like to know the highest body temperature you have measured."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.HS.Q6c.helpGroup.text.2"),
            {
                content: _T("weekly.HS.Q6c.helpGroup.text.3", "Answer yes, if you took your temperature using a thermometer."),
            },
        ];
    }
}

interface TemperatureProps extends SymptomDependentProps {
    keyDidYouMeasureTemperature: string
}

/**
 * HIGHEST TEMPERATURE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyDidYouMeasureTemperature reference to the question if temperature was taken
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class HighestTemprerature extends SymptomDependentQuestion {

    keyDidYouMeasureTemperature: string;

    constructor(props: TemperatureProps) {
        super('d', props );
        this.keyDidYouMeasureTemperature = props.keyDidYouMeasureTemperature;
    }

    getCondition() {
        return client.logic.and(
            client.singleChoice.any(this.keyDidYouMeasureTemperature, ResponseEncoding.measure_temp.yes),
            super.getCondition()
        );
    }

    getTriggerSymptoms() {
        return [
            ResponseEncoding.symptoms.fever
        ];
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.HS.Q6d.title.0", "What was your highest temperature measured?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return  [
            {
                key: '0', role: 'option',
                content: _T("weekly.HS.Q6d.rg.scg.option.0", "Below 37.0°C")
            },
            {
                key: '1', role: 'option',
                content: _T("weekly.HS.Q6d.rg.scg.option.1", "37.0°C - 37.4°C")
            },
            {
                key: '2', role: 'option',
                content: _T("weekly.HS.Q6d.rg.scg.option.2", "37.5°C - 37.9°C")
            },
            {
                key: '3', role: 'option',
                content: _T("weekly.HS.Q6d.rg.scg.option.3", "38.0°C - 38.9°C")
            },
            {
                key: '4', role: 'option',
                content: _T("weekly.HS.Q6d.rg.scg.option.4", "39.0°C - 39.9°C")
            }, {
                key: '5', role: 'option',
                content: _T("weekly.HS.Q6d.rg.scg.option.5", "40.0°C or more")
            },
            {
                key: '6', role: 'option',
                content: _T("weekly.HS.Q6d.rg.scg.option.6", "I don't know/can't remember")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.HS.Q6d.helpGroup.text.0"),
            {
                content: _T("weekly.HS.Q6d.helpGroup.text.1", "Certain infectious diseases cause a raised temperature."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.HS.Q6d.helpGroup.text.2"),
            {
                content: _T("weekly.HS.Q6d.helpGroup.text.3", "Please indicate the highest temperature you measured during the period in which you experienced your symptoms."),
            },
        ];
    }
}

interface FeverGroupProps extends SymptomsAndStartProps {
}

export class FeverGroup extends GroupQuestion {

    keySymptomsQuestion: string

    keySymptomStart: string

    isRequired?: boolean;

    getCondition() {
        return client.multipleChoice.any(this.keySymptomsQuestion, ResponseEncoding.symptoms.fever);
    }

    constructor(props: FeverGroupProps) {
        super(props, 'Q6');
        this.isRequired = props.isRequired;
        this.keySymptomsQuestion = props.keySymptomsQuestion;
        this.keySymptomStart = props.keySymptomStart;
    }

    buildItems() {

        const measure = new DidUMeasureTemperature({parentKey: this.key, keySymptomsQuestion: this.keySymptomsQuestion, isRequired: this.isRequired});
        return [
            new FeverStart({parentKey: this.key, keySymptomsQuestion: this.keySymptomsQuestion, keySymptomStart: this.keySymptomStart, isRequired: this.isRequired}),
            new FeverDevelopedSuddenly({parentKey: this.key, keySymptomsQuestion: this.keySymptomsQuestion, isRequired: this.isRequired}),
            measure,
            new HighestTemprerature({parentKey: this.key, keySymptomsQuestion:this.keySymptomsQuestion, keyDidYouMeasureTemperature: measure.key, isRequired: this.isRequired})
        ];
    }


    buildGroup() {
        this.buildItems().forEach(item=>{
            this.addItem(item.get());
        })
    }
}

/**
 * CONSENT FOR MORE QUESTIONS: single choice question to get consent for further questions
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySymptomsQuestion reference to the symptom survey
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class ConsentForMore extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q36');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.HS.Q36.title.0", "Thank you for all these information. They will help us to estimate the frequency of symptoms among general population. You can stop here. If you have a little more time, we propose you to answer further questions about your symptoms and care. Do you accept to answer to these additional questions?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return  [
            {
                key: ResponseEncoding.consent_more.yes, role: 'option', content: _T("weekly.HS.Q36.rg.scg.option.0", "Yes")
            },
            {
                key: ResponseEncoding.consent_more.no, role: 'option',
                content: _T("weekly.HS.Q36.rg.scg.option.1", "No")
            }
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.HS.Q36.helpGroup.text.0"),
            {
                content: _T("weekly.HS.Q36.helpGroup.text.1", "We want to know if you are willing to answer the follow-up questions. Your answers to the follow-up questions may assist our research."),
            },
        ];
    }
}

interface HasMoreGroupProps extends GroupProps {
    consentForMoreKey: string;
}

/**
 * GROUP DEPENDING ON IF ANY SYMPTOMS PRESENT AND USER WANTS TO ANSWER MORE QUESTIONS
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param userConsentForSymptoms reference to the symptom survey
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class HasMoreGroup extends GroupQuestion {

    consentForMoreKey : string;

    getCondition() {
        return client.singleChoice.any(this.consentForMoreKey, ResponseEncoding.consent_more.yes)
    }

    constructor(props: HasMoreGroupProps) {
        const defaultKey = 'EX';
        super(props, defaultKey);
        this.consentForMoreKey = props.consentForMoreKey;
    }

    buildGroup() {

    }
}

/**
 * SYMPTOM IMPLIED COVID-19 TEST PERFORMED
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class SymptomImpliedCovidTest extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Qcov16h');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Qcov16h.title.0", "Because of your symptoms, did you undergo a test/analyses to know if you have COVID-19?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: ResponseEncoding.symptom_test.yes, role: 'option',
                content: _T("weekly.EX.Qcov16h.rg.scg.option.0", "Yes")
            },
            {
                key: ResponseEncoding.symptom_test.not_yet, role: 'option',
                content: _T("weekly.EX.Qcov16h.rg.scg.option.1", "Not yet, I plan to shortly undergo a test")
            },
            {
                key: ResponseEncoding.symptom_test.no_wont, role: 'option',
                content: _T("weekly.EX.Qcov16h.rg.scg.option.2", "No, I have a prescription but will not undergo a test")
            },
            {
                key: ResponseEncoding.symptom_test.no, role: 'option',
                content: _T("weekly.EX.Qcov16h.rg.scg.option.3", "No")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Qcov16h.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Qcov16h.helpGroup.text.1", "We want to know which complaints lead people to get tested for the coronavirus."),
            },
        ];
    }
}

interface CovidTestQuestionProps extends ItemProps {
    keySymptomImpliedCovidTest: string;
}

/**
 * TEST TYPE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keysymptomImpliedCovidTest key to the answer of Qcov16
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class CovidTestType extends ItemQuestion {

    keySymptomImpliedCovidTest: string;

    constructor(props: CovidTestQuestionProps) {
        super(props, 'Qcov16i');
        this.keySymptomImpliedCovidTest = props.keySymptomImpliedCovidTest;
    }

    getCondition() {
        // FIXME: in case keysymptomImpliedCovidTest chnges type eg: single -> multiple, this will break unless
        // singleChoiceKey is changed to multipleChoiceKey
        return  client.responseHasKeysAny(this.keySymptomImpliedCovidTest, singleChoicePrefix, ResponseEncoding.symptom_test.yes);
        //expWithArgs('responseHasKeysAny', keysymptomImpliedCovidTest, responseGroupKey + '.' + singleChoiceKey, '1'),
    }

    buildItem() {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Qcov16i.title.0", "Which analyse(s) was it?"),
            helpGroupContent: this.getHelpGroupContent(),
            topDisplayCompoments: [
                text_select_all_apply("weekly.EX.Qcov16i.rg.tyZC.text.0")
            ],
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: ResponseEncoding.test_type.pcr, role: 'option',
                content: _T("weekly.EX.Qcov16i.rg.mcg.option.0", "A PCR test (virus search, on a swab in nose or mouth, or a sputum or saliva sample)")
            },
            {
                key: ResponseEncoding.test_type.sero, role: 'option',
                content: _T("weekly.EX.Qcov16i.rg.mcg.option.1", "A serological analysis (screening for antibodies against this virus, from a drop of blood at fingertip or a blood sample)")
            },
            {
                key: ResponseEncoding.test_type.antigenic, role: 'option',
                content: _T("weekly.EX.Qcov16i.rg.mcg.option.2", "A rapid antigen detection test on a sample realized in the back of the nose (nasopharyngeal sampling, done by a health professional or a trained person, with a swab inserted to 15 cm into the nose, result obtained in less than one hour)")
            },
            {
                key: ResponseEncoding.test_type.antigenic_nasal, role: 'option',
                content: _T("weekly.EX.Qcov16i.rg.mcg.option.3", "A rapid antigen detection test or autotest done on a nasal sample (a swab inserted to 1 - 4 cm into the nostril, sampling that can be done by oneself, result obtained in a few minutes)")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Qcov16i.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Qcov16i.helpGroup.text.1", "We are interested in knowing how many people with symptoms have udergone a test"),
            },
        ];
    }
}

interface TestTypeProps extends ItemProps {
    keyTestType: string
}

abstract class TestTypeDependentQuestion extends ItemQuestion {

    keyTestType: string;

    constructor(defaultKey: string, props: TestTypeProps) {
        super(props, defaultKey);
        this.keyTestType = props.keyTestType;
    }

    abstract getTriggerTests(): Array<string>;

    getCondition() {
        const test_types = this.getTriggerTests();
        return client.multipleChoice.any(this.keyTestType, ...test_types);
        //expWithArgs('responseHasKeysAny', keySymptomsQuestion, [responseGroupKey, multipleChoiceKey].join('.'), '1')
    }
}


/**
 * RESULT COVID-19 PCR TEST: result COVID-19 test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyTestType key to the answer of Qcov16
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class ResultPCRTest extends TestTypeDependentQuestion {

    constructor(props: TestTypeProps) {
        super('Qcov16b', props );
    }

    getTriggerTests() {
        return [
            ResponseEncoding.test_type.pcr
        ]
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Qcov16b.title.0", "Do you know the result of your PCR test? (if several were performed and at least one was positive, chose the “Positive” answer)"),
            helpGroupContent: this.getHelpGroupContent(),

            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '1', role: 'option',
                content: _T("weekly.EX.Qcov16b.rg.scg.option.0", "Yes, positive for COVID-19")
            },
            {
                key: '2', role: 'option',
                content: _T("weekly.EX.Qcov16b.rg.scg.option.1", "Yes, negative for COVID-19")
            },
            {
                key: '3', role: 'option',
                content: _T("weekly.EX.Qcov16b.rg.scg.option.2", "Yes, the results are inconclusive")
            },
            {
                key: '4', role: 'option',
                content: _T("weekly.EX.Qcov16b.rg.scg.option.3", "No, I have not yet received the test results")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Qcov16b.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Qcov16b.helpGroup.text.1", "We want to understand how the coronavirus is spreading within the population."),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ];
    }
}

/**
 * RESULT COVID-19 RAPID TEST: result COVID-19 rapid test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyTestType key to the answer of test type
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class ResultAntigenicTest extends TestTypeDependentQuestion {

    constructor(props: TestTypeProps) {
        super('Qcov16f', props );
    }

    getTriggerTests() {
        return [
            ResponseEncoding.test_type.antigenic
        ]
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Qcov16f.title.0", "Do you know the result of this rapid antigen detection test on nasopharyngeal sample? (if several were performed and at least one was positive, chose the “Positive” answer)"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return  [
            {
                key: '1', role: 'option',
                content: _T("weekly.EX.Qcov16f.rg.scg.option.0", "Yes, positive for COVID-19")
            },
            {
                key: '2', role: 'option',
                content: _T("weekly.EX.Qcov16f.rg.scg.option.1", "Yes, negative for COVID-19")
            },
            {
                key: '3', role: 'option',
                content: _T("weekly.EX.Qcov16f.rg.scg.option.2", "Yes, the results are inconclusive")
            },
            {
                key: '99', role: 'option',
                content: _T("weekly.EX.Qcov16f.rg.scg.option.3", "I don't know / I don't want to answer"),
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Qcov16f.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Qcov16f.helpGroup.text.1", "We want to understand how the coronavirus is spreading within the population."),
            },
        ];
    }
}

/**
 * RESULT COVID-19 RAPID TEST: result COVID-19 rapid test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyTestType key to the answer of Qcov16
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class ResultRapidAntigenicTest extends TestTypeDependentQuestion {

    constructor(props: TestTypeProps) {
        super('Qcov16k', props );
    }

    getTriggerTests() {
        return [
            ResponseEncoding.test_type.antigenic_nasal
        ];
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Qcov16k.title.0", "Do you know the result of this antigenic test or self-test on nasal sample? (if several were performed and at least one was positive, chose the “Positive” answer)"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '1', role: 'option',
                content: _T("weekly.EX.Qcov16k.rg.scg.option.0", "Yes, positive for COVID-19")
            },
            {
                key: '2', role: 'option',
                content: _T("weekly.EX.Qcov16k.rg.scg.option.1", "Yes, negative for COVID-19")
            },
            {
                key: '3', role: 'option',
                content: _T("weekly.EX.Qcov16k.rg.scg.option.2", "Yes, the results are inconclusive")
            },
            {
                key: '99', role: 'option',
                content: _T("weekly.EX.Qcov16k.rg.scg.option.3", "I don't know / I don't want to answer"),
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Qcov16k.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Qcov16k.helpGroup.text.1", "We want to understand how the coronavirus is spreading within the population."),
            },
        ];
    }
}



export class FluTest extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Qcov19');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Qcov19.title.0", "Because of your symptoms, did you undergo a test/analyses to know if you have the Flu?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        const codes = ResponseEncoding.flu_test;
        return [
            {
                key: codes.yes, role: 'option',
                content: _T("weekly.EX.Qcov19.rg.scg.option.0", "Yes, a PCR test based on a swab in nose or mouth, or a sputum or saliva sample")
            },
            {
                key: codes.yes_antigenic, role: 'option',
                content: _T("weekly.EX.Qcov19.rg.scg.option.1", "Yes, a rapid detection test (result available in less than an hour)")
            },
            {
                key: codes.plan, role: 'option',
                content: _T("weekly.EX.Qcov19.rg.scg.option.2", "Not yet, I have a prescription and plan to shortly undergo a test")
            },
            {
                key: codes.wontgo, role: 'option',
                content: _T("weekly.EX.Qcov19.rg.scg.option.3", "No, I have a prescription but will not undergo a test")
            },
            {
                key: codes.no, role: 'option',
                content: _T("weekly.EX.Qcov19.rg.scg.option.4", "No")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Qcov19.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Qcov19.helpGroup.text.1", "We want to know which complaints lead people to get tested for the flu."),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ]
    }
}

interface ResultFluTestProps extends ItemProps {
    keyFluTest: string

}

/**
 * RESULT FLU PCR TEST: result flu test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyFluTest key to the answer of Qcov16
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class ResultFluTest extends ItemQuestion {

    keyFluTest: string

    constructor(props: ResultFluTestProps) {
        super(props, 'Qcov19b');
        this.keyFluTest = props.keyFluTest;
    }

    getCondition() {
        const codes = ResponseEncoding.flu_test;
        return  client.responseHasKeysAny(this.keyFluTest,  codes.yes, codes.yes_antigenic );
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Qcov19b.title.0", "Have you received the results of your Flu test?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '1', role: 'option',
                content: _T("weekly.EX.Qcov19b.rg.scg.option.0", "Yes, the test is positive for influenza")
            },
            {
                key: '2', role: 'option',
                content: _T("weekly.EX.Qcov19b.rg.scg.option.1", "Yes, the test is negative for influenza")
            },
            {
                key: '3', role: 'option',
                content: _T("weekly.EX.Qcov19b.rg.scg.option.2", "Yes, the results are inconclusive")
            },
            {
                key: '4', role: 'option',
                content: _T("weekly.EX.Qcov19b.rg.scg.option.3", "No, I have not yet received the test results")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Qcov19b.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Qcov19b.helpGroup.text.1", "We want to understand how the flu is spreading within the population."),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ];
    }
}

/**
 * VISITED MEDICAL SERVICE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class VisitedMedicalService extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q7');
    }

    buildItem() {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Q7.title.0", "Because of your symptoms, did you VISIT (see face to face or teleconsultation) any medical services?"),
            helpGroupContent: this.getHelpGroupContent(),
            bottomDisplayCompoments: [
                text_select_all_apply("weekly.EX.Q7.rg.DTpM.text.0")
            ],

            responseOptions: this.getResponses()
        });
    }

    getResponses() {

        const codes = ResponseEncoding.visit_medical;

        // All response except no
        const exclusiveNo = client.responseHasOnlyKeysOtherThan(this.key, MultipleChoicePrefix, codes.no);

        // All response except planned visit
        const exclusivePlan = client.responseHasOnlyKeysOtherThan(this.key, MultipleChoicePrefix, codes.plan);

        const exclusiveOther = client.multipleChoice.any(this.key, codes.no, codes.plan);

        return [
            {
                key: codes.no, role: 'option',
                disabled: exclusiveNo,
                content: _T("weekly.EX.Q7.rg.mcg.option.0", "No")
            },
            {
                key: codes.gp, role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q7.rg.mcg.option.1", "GP or GP's practice nurse")
            },
            {
                key: codes.hospital, role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q7.rg.mcg.option.2", "Hospital admission")
            },
            {
                key: codes.emergency, role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q7.rg.mcg.option.3", "Hospital accident & emergency department / out of hours service")
            },
            {
                key: codes.other, role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q7.rg.mcg.option.4", "Other medical services")
            },
            {
                key: codes.plan, role: 'option',
                disabled: exclusivePlan,
                content: _T("weekly.EX.Q7.rg.mcg.option.5", "No, but I have an appointment scheduled")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Q7.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Q7.helpGroup.text.1", "To find out whether people contact the health services because of their symptoms."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.EX.Q7.helpGroup.text.2"),
            {
                content: _T("weekly.EX.Q7.helpGroup.text.3", "Tick all of those that apply. If you are due to see attend, then tick the final option."),
            },
        ];
    }
}

interface VisitedMedicalServiceProps extends ItemProps {
    keyVisitedMedicalServ: string

}


/**
 * WHEN VISITED MEDICAL SERVICE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyVisitedMedicalServ: reference to quesiton if visited any medical service
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */

export class VisitedMedicalServiceWhen extends ItemQuestion {

    keyVisitedMedicalServ: string

    constructor(props: VisitedMedicalServiceProps) {
        super(props, 'Q7b');
        this.keyVisitedMedicalServ = props.keyVisitedMedicalServ;
    }

    getCondition() {
        const codes = ResponseEncoding.visit_medical;
        return client.responseHasOnlyKeysOtherThan(this.keyVisitedMedicalServ, codes.no, codes.plan);
        //expWithArgs('responseHasOnlyKeysOtherThan', keyVisitedMedicalServ, [responseGroupKey, multipleChoiceKey].join('.'), '0', '5')
    }

    buildItem() {

        const itemKey = this.key;
        const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
        editor.setVersion(1);

        editor.setTitleComponent(
            generateTitleComponent(_T("weekly.EX.Q7b.title.0", "How soon after your symptoms appeared did you first VISIT this medical service?"))
        );

        // CONDITION
        editor.setCondition(this.condition);

        // INFO POPUP
        editor.setHelpGroupComponent( generateHelpGroupComponent(this.getHelpGroupContent())  );

        // RESPONSE PART
        const rg = editor.addNewResponseComponent({ role: 'responseGroup' });

        editor.addExistingResponseComponent(
            ComponentGenerators.text({
             content:  _T("weekly.EX.Q7b.rg.sFcN.text.0", 'Select the correct number of days')
            })
        , rg?.key);

        const ddOptions: ResponseRowCell = {
            key: 'col1', role: 'dropDownGroup', items: [
                {
                    key: '0', role: 'option', content: _T("weekly.EX.Q7b.rg.mat.r1.col1.option.0", "Same day"),
                },
                {
                    key: '1', role: 'option', content: _T("weekly.EX.Q7b.rg.mat.r1.col1.option.1", "1 day"),
                },
                {
                    key: '2', role: 'option', content: _T("weekly.EX.Q7b.rg.mat.r1.col1.option.2", "2 days"),
                },
                {
                    key: '3', role: 'option', content: _T("weekly.EX.Q7b.rg.mat.r1.col1.option.3", "3 days"),
                },
                {
                    key: '4', role: 'option', content: _T("weekly.EX.Q7b.rg.mat.r1.col1.option.4", "4 days"),
                },
                {
                    key: '5', role: 'option', content: _T("weekly.EX.Q7b.rg.mat.r1.col1.option.5", "5 - 7 days"),
                },
                {
                    key: '6', role: 'option', content: _T("weekly.EX.Q7b.rg.mat.r1.col1.option.6", "More than 7 days"),
                },
                {
                    key: '7', role: 'option', content: _T("weekly.EX.Q7b.rg.mat.r1.col1.option.7", "I don't know/can't remember"),
                },
            ]
        };

        const visits = ResponseEncoding.visit_medical;

        const displayCondition = (code:string) => {
            return client.multipleChoice.any(this.keyVisitedMedicalServ, code);
        }

        const rg_inner = initMatrixQuestion(matrixKey, [
            {
                key: 'header', role: 'headerRow', cells: [
                    {
                        key: 'col0', role: 'text', content: _T("weekly.EX.Q7b.rg.mat.header.col0.text.0", "Medical Service"),
                    },
                    {
                        key: 'col1', role: 'text'
                    },
                ]
            },
            {
                key: 'r1', role: 'responseRow', cells: [
                    {
                        key: 'col0', role: 'label', content: _T("weekly.EX.Q7b.rg.mat.r1.col0.label.0", "GP or GP'r practice nurse"),
                    },
                    { ...ddOptions }
                ],
                displayCondition: displayCondition(visits.gp)
            },
            {
                key: 'r2', role: 'responseRow', cells: [
                    {
                        key: 'col0', role: 'label', content: _T("weekly.EX.Q7b.rg.mat.r2.col0.label.0", "Hospital accident & department/out of hours service"),
                    },
                    { ...ddOptions }
                ],
                displayCondition: displayCondition(visits.emergency)
            },
            {
                key: 'r3', role: 'responseRow', cells: [
                    {
                        key: 'col0', role: 'label', content: _T("weekly.EX.Q7b.rg.mat.r3.col0.label.0", "Hospital admission"),
                    },
                    { ...ddOptions }
                ],
                displayCondition: displayCondition(visits.hospital)
            },
            {
                key: 'r4', role: 'responseRow', cells: [
                    {
                        key: 'col0', role: 'label', content: _T("weekly.EX.Q7b.rg.mat.r4.col0.label.0", "Other medical services"),
                    },
                    { ...ddOptions }
                ],
                displayCondition: displayCondition(visits.other)
            },
        ]);
        editor.addExistingResponseComponent(rg_inner, rg?.key);

        // VALIDATIONs
        if (this.isRequired) {
            require_response(editor, this.key, responseGroupKey);
        }

        return editor.getItem();

    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Q7b.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Q7b.helpGroup.text.1", "To find out how quickly people with symptoms are seen by the health services."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.EX.Q7b.helpGroup.text.2"),
            {
                content: _T("weekly.EX.Q7b.helpGroup.text.3", "Only record the time until your FIRST contact with the health services."),
            },
        ]
    }
}

/**
 * WHY CONSULTED NO MEDICAL SERVICE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyVisitedMedicalServ key to check if medical services have been visited.
 * @param keyContactedMedicalServ key to check if medical services have been contacted.
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */

export class WhyVisitedNoMedicalService extends ItemQuestion {

    keyVisitedMedicalServ: string

    constructor(props: VisitedMedicalServiceProps) {
        super(props, 'Qcov18');
        this.keyVisitedMedicalServ = props.keyVisitedMedicalServ;
    }

    getCondition() {
        const codes = ResponseEncoding.visit_medical;
        return client.responseHasKeysAny(this.keyVisitedMedicalServ, codes.no);
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Qcov18.title.0", "What is the main reason for which you did not consult any health professional for the symptoms you declared today?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return  [
            {
                key: '1', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.0", "My symptoms appeared very recently")
            },
            {
                key: '2', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.1", "My symptoms are mild")
            },
            {
                key: '3', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.2", "I have these symptoms often")
            },
            {
                key: '4', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.3", "I think I know what I have and I self-medicate")
            },
            {
                key: '5', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.4", "I think there is no effective treatment for the disease I have")
            },
            {
                key: '6', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.5", "It is too hard to get an appointment quickly")
            },
            {
                key: '7', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.6", "I do not have time")
            },
            {
                key: '8', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.7", "For financial reasons")
            },
            {
                key: '9', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.8", "For fear of consequences if the doctor thinks I have COVID-19")
            },
            {
                key: '11', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.9", "Because I am vaccinated against COVID-19")
            },
            {
                key: '10', role: 'input',
                style: [{ key: 'className', value: 'w-100' }],
                content: _T("weekly.EX.Qcov18.rg.scg.input.10", "For another reason"),
                description: _T("weekly.EX.Qcov18.rg.scg.description.input.10", "Describe here (optional)")
            },
            {
                key: '99', role: 'option',
                content: _T("weekly.EX.Qcov18.rg.scg.option.11", "I don't know / I don't want to answer")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Qcov18.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Qcov18.helpGroup.text.1", "To understand why some people do not consult a doctor."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.EX.Qcov18.helpGroup.text.2"),
            {
                content: trans_select_all_apply("weekly.EX.Qcov18.helpGroup.text.3"),
            },
        ]
    }
}

interface TookMedicationProps extends ItemProps {
    useHayFever?: boolean;
}


/**
 * TOOK ANY MEDICATION
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class TookMedication extends ItemQuestion {

    useHayFever: boolean;

    constructor(props: TookMedicationProps) {
        super(props, 'Q9');
        this.useHayFever = props.useHayFever ?? false;
    }


    buildItem() {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Q9.title.0", "Did you take medication for these symptoms?"),
            helpGroupContent: this.getHelpGroupContent(),
            topDisplayCompoments: [
                text_select_all_apply("weekly.EX.Q9.rg.vMc3.text.0")
            ],
            responseOptions: this.getResponses()
        });
    }

    /**
     * Creates a condition based on this question response when antibiotic is checked
     * @returns
     */
    createTookAntibioticCondition() {
        return client.responseHasKeysAny(this.key, MultipleChoicePrefix, ResponseEncoding.took_medication.antibio);
    }

    getResponses() {
        const codes = ResponseEncoding.took_medication;
        const no_medication =  codes.no;
        const dont_know = codes.dontknow;

        // Exclusive with 'No' response
        const exclusiveNo = client.responseHasKeysAny(this.key, MultipleChoicePrefix, no_medication);

        // Exclusive Conditon for all other options : except No and Dont know
        const exclusiveOther = client.responseHasKeysAny(this.key, MultipleChoicePrefix, no_medication, dont_know)

        // Exclusive with Dont know response
        const exclusiveDontKnow = client.responseHasKeysAny(this.key, MultipleChoicePrefix, dont_know);

        const r : OptionDef[] = [
            {
                key: no_medication,
                role: 'option',
                disabled: exclusiveDontKnow,
                content: _T("weekly.EX.Q9.rg.mcg.option.0", "No medication")
            },
            {
                key: codes.pain,
                role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q9.rg.mcg.option.1", "Pain killers (e.g. paracetamol, lemsip, ibuprofen, aspirin, calpol, etc)")
            },
            {
                key: codes.cough,
                role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q9.rg.mcg.option.2", "Cough medication (e.g. expectorants)")
            },
        ];

        if(this.useHayFever) {
            r.push({
                key: '9',
                role: 'option',
                disabled: exclusiveOther,
                content: _T("hecfaecb", "Hayfever medication")
            });
        }

        const rest = [    {
                key: codes.antiviral,
                role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q9.rg.mcg.option.3", "Antivirals against influenza (eg: Tamiflu)")
            },
            {
                key: codes.antibio,
                role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q9.rg.mcg.option.4", "Antibiotics")
            },
            {
                key: codes.homeo,
                role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q9.rg.mcg.option.5", "Homeopathy")
            },
            {
                key: codes.alternative,
                role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q9.rg.mcg.option.6", "Alternative medicine (essential oil, phytotherapy, etc.)")
            },
            {
                key: codes.other,
                role: 'option',
                disabled: exclusiveOther,
                content: _T("weekly.EX.Q9.rg.mcg.option.7", "Other")
            },
            {
                key: dont_know,
                role: 'option',
                disabled: exclusiveNo,
                content: _T("weekly.EX.Q9.rg.mcg.option.8", "I don't know/can't remember")
            },
        ];

        r.push(...rest);
        return r;
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Q9.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Q9.helpGroup.text.1", "To find out who gets treated, and how effective treatment is."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.EX.Q9.helpGroup.text.2"),
            {
                content: _T("weekly.EX.Q9.helpGroup.text.3", "Only record those medications that you used because of this illness. If you are on other medications because of a pre-existing illness then do not record these."),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ];
    }
}



/**
 * HOSPITALIZED BECAUSE OF SYMPTOMS: single choice question to check if symptoms lead to hospitalization
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class Hospitalized extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q14');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Q14.title.0", "Because of your symptoms, were you hospitalized?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return  [
            {
                key: '1', role: 'option', content: _T("weekly.EX.Q14.rg.scg.option.0", "Yes")
            },
            {
                key: '0', role: 'option',
                content: _T("weekly.EX.Q14.rg.scg.option.1", "No")
            }
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Q14.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Q14.helpGroup.text.1", "We want to understand the rates of hospitalization due to symptoms"),
            },
            text_how_answer("weekly.Q14.helGroup.how_answer"),
            {
                content: _T("weekly.EX.Q14.helpGroup.text.2", "Answer yes only if the hospitalization is related to your current symptoms and not if it was planned before or related to an accident.")
            }
        ];
    }
}

/**
 * DAILY ROUTINE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class DailyRoutine extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q10');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Q10.title.0", "Did you change your daily routine because of your illness?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {

        const codes = ResponseEncoding.daily_routine;

        return [
            {
                key: codes.no,
                role: 'option',
                content: _T("weekly.EX.Q10.rg.scg.option.0", "No, I was able to go about my daily activities as usual")
            },
            {
                key: codes.yes,
                role: 'option',
                content: _T("weekly.EX.Q10.rg.scg.option.1", "Yes, but I did not take time off work/school")
            },
            {
                key: codes.off,
                role: 'option',
                content: _T("weekly.EX.Q10.rg.scg.option.2", "Yes, I took time off school or work")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Q10.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Q10.helpGroup.text.1", "To determine how the symptoms are impacting your daily life."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.EX.Q10.helpGroup.text.2"),
            {
                content: _T("weekly.EX.Q10.helpGroup.text.3", "We want to know if you have missed work or school due to your symptoms, or if you have modified your daily routine in any way (for example, if you were unable to engage in sport activities). If you are a student, and were unable to attend online classes due to your symptoms, you should also select option 2. We are interested in changes due to your symptoms/complaints and not due to any quarantine."),
            },
        ];
    }
}

interface DailyRoutineProps extends ItemProps {
    keyDailyRoutine: string;
}

export class DailyRoutineToday extends ItemQuestion {

    keyDailyRoutine: string;

    constructor(props: DailyRoutineProps) {
        super(props, 'Q10b');
        this.keyDailyRoutine = props.keyDailyRoutine;
    }

    getCondition() {
        return client.singleChoice.any(this.keyDailyRoutine, ResponseEncoding.daily_routine.off);
        //expWithArgs('responseHasKeysAny', keyDailyRoutine, [responseGroupKey, singleChoiceKey].join('.'), '2')
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Q10b.title.0", "Are you currently still unable to work or attend school due to your symptoms/complaints?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '0',
                role: 'option',
                content: _T("weekly.EX.Q10b.rg.scg.option.0", "Yes")
            },
            {
                key: '1',
                role: 'option',
                content: _T("weekly.EX.Q10b.rg.scg.option.1", "No")
            },
            {
                key: '3',
                role: 'option',
                content: _T("weekly.EX.Q10b.rg.scg.option.2", "Other (I did not have to work or go to school today in any case)")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Q10b.helpGroup.text.0"),

            {
                content: _T("weekly.EX.Q10b.helpGroup.text.1", "To determine how the symptoms are impacting your daily life."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.EX.Q10b.helpGroup.text.2"),
            {
                content: _T("weekly.EX.Q10b.helpGroup.text.3", "Answer 'yes' if you missed work or school today due to certain symptoms."),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ];
    }
}

/**
 * DAILY ROUTINE DAYS MISSED WORK/SCHOOL
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyDailyRoutine: reference to question if participant missed work/school
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class DailyRoutineDaysMissed extends ItemQuestion {

    keyDailyRoutine: string;

    constructor(props: DailyRoutineProps) {
        super(props, 'Q10c');
        this.keyDailyRoutine = props.keyDailyRoutine;
    }

    getCondition() {
        return client.singleChoice.any(this.keyDailyRoutine, ResponseEncoding.daily_routine.off);
        //expWithArgs('responseHasKeysAny', keyDailyRoutine, [responseGroupKey, singleChoiceKey].join('.'), '2')
    }

    buildItem() {
        return SurveyItems.dropDown({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Q10c.title.0", "For how many days have you been unable to work normally/go to school (when you otherwise would have)?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
            {
                key: '0', role: 'option', content: _T("weekly.EX.Q10c.rg.ddg.option.0", "1 day"),
            },
            {
                key: '1', role: 'option', content: _T("weekly.EX.Q10c.rg.ddg.option.1", "2 days"),
            },
            {
                key: '2', role: 'option', content: _T("weekly.EX.Q10c.rg.ddg.option.2", "3 days"),
            },
            {
                key: '3', role: 'option', content: _T("weekly.EX.Q10c.rg.ddg.option.3", "4 days"),
            },
            {
                key: '4', role: 'option', content: _T("weekly.EX.Q10c.rg.ddg.option.4", "5 days"),
            },
            {
                key: '5', role: 'option', content: _T("weekly.EX.Q10c.rg.ddg.option.5", "6 to 10 days"),
            },
            {
                key: '6', role: 'option', content: _T("weekly.EX.Q10c.rg.ddg.option.6", "11 to 15 days"),
            },
            {
                key: '7', role: 'option', content: _T("weekly.EX.Q10c.rg.ddg.option.7", "More than 15 days"),
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Q10c.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Q10c.helpGroup.text.1", "To calculate the number of days a person misses work or school due to certain symptoms."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.EX.Q10c.helpGroup.text.2"),
            {
                content: _T("weekly.EX.Q10c.helpGroup.text.3", "Only count the days that you would otherwise have gone to work or school. Provide as precise an estimate as possible."),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ];
    }
}

/**
 * COVID-19 Personal Habits Changes: likert scale question about changes in personal habits after experiencing covid symptoms
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
 export class CovidHabitsChange extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Qcov7');
    }

    buildItem() {

        const editor = new ItemEditor(undefined, { itemKey: this.key, isGroup: false });

        // QUESTION TEXT
        editor.setTitleComponent(
            generateTitleComponent(_T("weekly.EX.Qcov7.title.0", "Did you begin to follow or increase any of the measures below, due to your symptoms (compared to the period before your symptoms began)?"))
        );

        // INFO POPUP
        editor.setHelpGroupComponent(generateHelpGroupComponent(this.getHelpGroupContent()));

        if(this.condition) {
            editor.setCondition(this.condition);
        }

        // RESPONSE PART

        const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
        editor.addExistingResponseComponent({
            role: 'text',
            style: [{ key: 'className', value: 'mb-2' }],
            content: generateLocStrings(_T("weekly.EX.Qcov7.rg.gU4U.text.0", "To be completed optionally")),
        }, rg?.key);

        const likertOptions = this.getScaleOptions();

        const row_style = 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold';
        const first_row_style = 'mb-1 fw-bold';
        const items = this.getOptionItems();

        var first = true;
        items.forEach((lang, rowKey) =>{

            const className = first ? first_row_style  : row_style;

            editor.addExistingResponseComponent({
                role: 'text',
                style: [{ key: 'className', value:  className}, { key: 'variant', value: 'h5' }],
                content: generateLocStrings(lang),
            }, rg?.key);
            editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_' + rowKey, likertOptions), rg?.key);

            if(first) {
                first = false;
            }

        });

        return editor.getItem();

    }

    getOptionItems(): Map<string, LanguageMap> {

       return new Map([
            ['1',  _T("weekly.EX.Qcov7.rg.v1C0.text.1", 'Regularly wash or disinfect hands') ],
            ['2', _T("weekly.EX.Qcov7.rg.nEMR.text.3", 'Cough or sneeze into your elbow') ],
            ['3', _T("weekly.EX.Qcov7.rg.oTIp.text.5", 'Use a disposable tissue')],

            ['4a', _T("weekly.EX.Qcov7.rg.7w6F.text.7", "Wear a face mask indoors")],

            ['4b', _T("weekly.EX.Qcov7.rg.vHvi.text.9", "Wear a face mask outdoors")],

            ['5', _T("weekly.EX.Qcov7.rg.ocTu.text.11", "Avoid shaking hands")],

            ['11', _T("weekly.EX.Qcov7.rg.ioJs.text.13", "Stop greeting by hugging and/or kissing on both cheeks")],

            ['6', _T("weekly.EX.Qcov7.rg.ujsK.text.15", "Limit your use of public transport")],

            ['7',_T("weekly.EX.Qcov7.rg.Ijdr.text.17", "Avoid busy places and gatherings (supermarket, cinema, stadium)")],

            ['8',_T("weekly.EX.Qcov7.rg.t8MS.text.19", "Stay at home")],

            ['9',_T("weekly.EX.Qcov7.rg.z4bE.text.21", "Telework or increase your number of telework days")],

            ['10',_T("weekly.EX.Qcov7.rg.Koue.text.23", "Avoid travel outside your own country or region")],

            ['13',_T("weekly.EX.Qcov7.rg.zuDa.text.25", "Have your food/shopping delivered by a store or a friend/family member")],

            //['18',_T("weekly.EX.Qcov7.rg.isolate_at_home", "Isolate from people living in your home")],

            ['14',_T("weekly.EX.Qcov7.rg.QSBP.text.27", "Avoid seeing friends and family")],

            ['15',_T("weekly.EX.Qcov7.rg.fRla.text.29", "Avoid being in contact with people over 65 years old or with a chronic disease")],

            ['16',_T("weekly.EX.Qcov7.rg.h3fK.text.31", "Avoid being in contact with children")],
        ]
       );

    }


    getScaleOptions() {
        return [
            {
                key: "1", content: _T("weekly.EX.Qcov7.rg.likert_1.option.0", " Yes, I am following this measure now for the first time, or in a stricter way")
            },
            {
                key: "2", content: _T("weekly.EX.Qcov7.rg.likert_1.option.1", "No, I was already following this measure")
            },
            {
                key: "0", content: _T("weekly.EX.Qcov7.rg.likert_1.option.2", "No, I am not following this measure")
            },
            {
                key: "3", content: _T("weekly.EX.Qcov7.rg.likert_1.option.3", "Not applicable")
            }
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.EX.Qcov7.helpGroup.text.0"),
            {
                content: _T("weekly.EX.Qcov7.helpGroup.text.1", "To examine how different measures are being followed."),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.EX.Qcov7.helpGroup.text.2"),
            {
                content: _T("weekly.EX.Qcov7.helpGroup.text.3", "For example, 'Avoid shaking hands': Answer 'yes' if you shake hands less or not at all due to your symptoms; Answer 'No, I am not following this measure' if you continue to shake hands despite your symptoms; Answer 'No, I was already following this measure' if you had already stopped shaking hands before the onset of your symptoms and you did not change this behaviour."),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ];
    }
}

/**
 * PERCIEVED CAUSE OF SYMPTOMS
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
export class CauseOfSymptoms extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q11');
    }

    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Q11.title.0", "What do you think is causing your symptoms?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses():Array<OptionDef> {
        return  [
            {
                key: '0', role: 'option',
                content: _T("weekly.EX.Q11.rg.scg.option.0", "Flu or flu-like illness")
            },
            {
                key: '9', role: 'option',
                content: _T("weekly.EX.Q11.rg.scg.option.1", "New coronavirus (COVID-19)")
            },
            {
                key: '1', role: 'option',
                content: _T("weekly.EX.Q11.rg.scg.option.2", "Common cold")
            },
            {
                key: '2', role: 'option',
                content: _T("weekly.EX.Q11.rg.scg.option.3", "Allergy/hay fever")
            },
            {
                key: '6', role: 'option',
                content: _T("weekly.EX.Q11.rg.scg.option.4", "Ashtma")
            },
            {
                key: '3', role: 'option',
                content: _T("weekly.EX.Q11.rg.scg.option.5", "Gastroenteritis complaints or gastric flu")
            },
            {
                key: '4', role: 'option',
                content: _T("weekly.EX.Q11.rg.scg.option.6", "Other")
            },
            {
                key: '5', role: 'option',
                content: _T("weekly.EX.Q11.rg.scg.option.7", "I don't know")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            {
                content: _T("weekly.EX.Q11.helpGroup.text.0", "Why are we asking this question?"),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: _T("weekly.EX.Q11.helpGroup.text.1", "To see if our assessment of your illness, based on your symptoms, matches what you believe to be the cause. You may have a better idea of the cause of your illness than our computer algorithms."),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: _T("weekly.EX.Q11.helpGroup.text.2", "How should I answer this question?"),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: _T("weekly.EX.Q11.helpGroup.text.3", "If you are reasonably sure of the cause of your symptoms, select the appropriate box. Otherwise, select 'No, I Don’t know'."),
            },
        ];
    }
}

export class SurveyEnd extends ItemQuestion {
    constructor(props: ItemProps) {
        super(props, 'surveyEnd');
    }

    buildItem() {
        return SurveyItems.surveyEnd(
            this.parentKey,
            _T(
                "weekly.surveyEnd.title.0",
                "Thank you! This was all for now, please submit (push « send ») your responses. We will ask you again next week."
            ),
            this.condition,
        )
    }
}
