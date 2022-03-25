import { LanguageMap } from "../languages"
import { SurveyItem } from "survey-engine/lib/data_types";
import { Group } from "case-editor-tools/surveys/types";
import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { initDropdownGroup, initLikertScaleItem, initMatrixQuestion, initMultipleChoiceGroup, initSingleChoiceGroup, ResponseRowCell } from "case-editor-tools/surveys/survey-items";
import { expWithArgs, generateHelpGroupComponent, generateLocStrings, generateTitleComponent } from "case-editor-tools/surveys/utils/simple-generators";
import { likertScaleKey, matrixKey, multipleChoiceKey, responseGroupKey, singleChoiceKey } from "case-editor-tools/constants/key-definitions";


/**
 * SYMPTOMS: multiple choice question about allergies
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const symptomps = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q1'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.Q1.title.0"],
            ["en", "Have you had any of the following symptoms since your last questionnaire (or in the past week, if this the first tie you are taking this questionnaire)?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.Q1.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.Q1.helpGroup.text.1"],
                    ["en", "The most important part of this study is about following up on the symptoms you have reported."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.Q1.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.Q1.helpGroup.text.3"],
                    ["en", "If you suffer from chronic illness, only indicate symptoms that have changed. For example, if you experience chronic shortness of breath, only mark this symptom if it has recently gotten worse. Multiple answers possible."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-2' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.Q1.rg.cGJZ.text.0"],
                ["en", "Multiple answers possible. If you suffer from chronic illness, only indicate symptoms that have changed. For example, if you experience chronic shortness of breath, only mark this symptom if it has recently gotten worse."],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option', content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.0"],
                ["en", "No symptoms"],
            ])
        },
        {
            key: '1', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.1"],
                ["en", "Fever"],
            ])
        },
        {
            key: '2', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.2"],
                ["en", "Chills"],
            ])
        },
        {
            key: '3', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.3"],
                ["en", "Runny or blocked nose"],
            ])
        },
        {
            key: '4', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.4"],
                ["en", "Sneezing"],
            ])
        },
        {
            key: '5', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.5"],
                ["en", "Sore throat"],
            ])
        },
        {
            key: '6', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.6"],
                ["en", "Cough"],
            ])
        },
        {
            key: '7', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.7"],
                ["en", "Shortness of breath"],
            ])
        },
        {
            key: '8', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.8"],
                ["en", "Headache"],
            ])
        },
        {
            key: '9', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.9"],
                ["en", "Muscle/joint pain"],
            ])
        },
        {
            key: '10', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.10"],
                ["en", "Chest pain"],
            ])
        },
        {
            key: '11', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.11"],
                ["en", "Feeling tired or exhausted (malaise)"],
            ])
        },
        {
            key: '12', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.12"],
                ["en", "Loss of appetite"],
            ])
        },
        {
            key: '13', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.13"],
                ["en", "Coloured sputum/phlegm"],
            ])
        },
        {
            key: '14', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.14"],
                ["en", "Watery, bloodshot eyes"],
            ])
        },
        {
            key: '15', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.15"],
                ["en", "Nausea"],
            ])
        },
        {
            key: '16', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.16"],
                ["en", "Vomiting"],
            ])
        },
        {
            key: '17', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.17"],
                ["en", "Diarrhoea (at least three times a day)"],
            ])
        },
        {
            key: '18', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.18"],
                ["en", "Stomachache"],
            ])
        },


        {
            key: '23', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.19"],
                ["en", "Loss of smell"],
            ])
        },
        {
            key: '21', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.20"],
                ["en", "Loss of taste"],
            ])
        },
        {
            key: '22', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.21"],
                ["en", "Nose bleed"],
            ])
        },
        {
            key: '20', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.22"],
                ["en", "Rash"],
            ])
        },
        {
            key: '19', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.Q1.rg.mcg.option.23"],
                ["en", "Other"],
            ]),
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * GROUP DEPENDING ON IF ANY SYMPTOMS PRESENT
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySymptomsQuestion reference to the symptom survey
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const hasSymptomsGroup = (parentKey: string, keySymptomsQuestion: string, keyOverride?: string): Group => {

    class HasSymptomsGroup extends Group {
        constructor(parentKey: string, defaultKey: string) {
            super(parentKey, defaultKey);
            this.groupEditor.setCondition(
                expWithArgs('responseHasOnlyKeysOtherThan', keySymptomsQuestion, [responseGroupKey, multipleChoiceKey].join('.'), '0')
            );
        }

        buildGroup() {}
    }

    return new HasSymptomsGroup(parentKey, 'HS');
}

/**
 * SAME ILLNES
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const sameIllnes = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q2'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Q2.title.0"],
            ["en", "When you filled in the previous questionnaire, you indicated that you were still sick. Are the symptoms you are  reporting now from the same timeframe as the symptoms you reported the last time?"],
        ]))
    );

    // CONDITION
    const hadOngoingSymptomsLastWeek = expWithArgs('eq', expWithArgs('getAttribute', expWithArgs('getAttribute', expWithArgs('getContext'), 'participantFlags'), 'prev'), "1");
    editor.setCondition(hadOngoingSymptomsLastWeek);

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q2.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q2.helpGroup.text.1"],
                    ["en", "To speed up the completion of the rest of the questionnaire."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q2.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q2.helpGroup.text.3"],
                    ["en", "If you think that the complaints you are indicating today are caused by the same infection or the same problem (the same period during which you experienced the complaints), answer 'yes'."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q2.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q2.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q2.rg.scg.option.2"],
                ["en", "I don’t know/can’t remember"],
            ])
        },
        {
            key: '9', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q2.rg.scg.option.3"],
                ["en", "This does not apply to me"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * PCR TESTED CONTACTS COVID-19: single choice question about contact with PCR tested Covid19 patients
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySymptomsQuestion reference to the symptom survey
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const pcrTestedContact = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov3'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Qcov3.title.0"],
            ["en", "In the 14 days before your symptoms started, have you been in close contact with someone for whom an antigenic or PCR test has confirmed that they have COVID-19?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Qcov3.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Qcov3.helpGroup.text.1"],
                    ["en", "In  order to study how the coronavirus spreads within the general population."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option', content: new LanguageMap([
                ["id", "weekly.HS.Qcov3.rg.scg.option.0"],
                ["en", "Yes"],

            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Qcov3.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Qcov3.rg.scg.option.2"],
                ["en", "I don’t know/can’t remember"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * HOUSEHOLD PCR TESTED CONTACT COVID-19: single choice question about household contacts who are PCR tested Covid19 patients
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const pcrHouseholdContact = (parentKey: string, covid19ContactKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov3b'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Qcov3b.title.0"],
            ["en", "Was this person or one of these persons a member of your household?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', covid19ContactKey, [responseGroupKey, singleChoiceKey].join('.'), '1'),
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Qcov3b.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Qcov3b.helpGroup.text.1"],
                    ["en", "The coronavirus and influenza spread quickly indoors."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Qcov3b.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Qcov3b.helpGroup.text.3"],
                    ["en", "A member of the household is defined as a person (not necessary a family member) who lives at the same address as you, and who shares the kitchen, living room, family room or dining room."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option', content: new LanguageMap([
                ["id", "weekly.HS.Qcov3b.rg.scg.option.0"],
                ["en", "Yes"],

            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Qcov3b.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Qcov3b.rg.scg.option.2"],
                ["en", "I don’t know"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * SYMPTOMS START
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySameIllnes reference to same illnes question
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const symptomsStart = (parentKey: string, keySameIllnes: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q3'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Q3.title.0"],
            ["en", "On what day did you begin feeling the first symptoms? If you do not recall the exact date, please give an approximate date."],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('not', expWithArgs('responseHasKeysAny', keySameIllnes, [responseGroupKey, singleChoiceKey].join('.'), '0', '9'))
    );


    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q3.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q3.helpGroup.text.1"],
                    ["en", "This question will help us to determine how many people are experiencing symptoms per day/week."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q3.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q3.helpGroup.text.3"],
                    ["en", "Answer as precisely as possible."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });

    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'dateInput',
            optionProps: {
                min: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', -5184000) },
                max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 10) },
            },
            content: new LanguageMap([
                ["id", "weekly.HS.Q3.rg.scg.dateInput.0"],
                ["en", "Choose date"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q3.rg.scg.option.1"],
                ["en", "I don't know/can't remember"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    /* editor.addExistingResponseComponent({
        key: '0', role: 'dateInput',
        properties: {
            min: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', -5184000) },
            max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 10) },
        },
        description: generateLocStrings(new LanguageMap([
            ["id", "geehdhfc"],
            ["en", "Choose date"],
        ]))
    }, rg?.key); */

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * SYMPTOMS END
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySymptomsStart reference to symptoms start question
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const symptomsEnd = (parentKey: string, keySymptomsStart: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q4'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Q4.title.0"],
            ["en", "When did your symptoms end?"],
        ]))
    );

    // CONDITION
    // None

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q4.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q4.helpGroup.text.1"],
                    ["en", "We can use the first and last dates of the complaints to calculate how long your complaints lasted. "],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q4.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q4.helpGroup.text.3"],
                    ["en", "Answer as precisely as possible."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'dateInput',
            optionProps: {
                min: {
                    dtype: 'exp', exp: {
                        name: 'getAttribute',
                        data: [
                            { dtype: 'exp', exp: expWithArgs('getResponseItem', keySymptomsStart, [responseGroupKey, singleChoiceKey, '0'].join('.')) },
                            { str: 'value', dtype: 'str' }
                        ],
                        returnType: 'int',
                    }
                },
                max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 10) },
            },
            content: new LanguageMap([
                ["id", "weekly.HS.Q4.rg.scg.dateInput.0"],
                ["en", "Choose date"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q4.rg.scg.option.1"],
                ["en", "I don't know/can't remember"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q4.rg.scg.option.2"],
                ["en", "I am still ill"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * SYMPTOMS DEVELOPED SUDDENLY
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const symptomsSuddenlyDeveloped = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q5';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Q5.title.0"],
            ["en", "Did your symptoms develop suddenly over a few hours?"],
        ]))
    );

    // CONDITION
    // None

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q5.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q5.helpGroup.text.1"],
                    ["en", "The sudden onset of symptoms (within a few hours) is linked to the coronavirus and influenza."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q5.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q5.helpGroup.text.3"],
                    ["en", "Answer “yes” if your symptoms appeared within a few hours, and not gradually over a period of several days."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q5.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q5.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q5.rg.scg.option.2"],
                ["en", "I don’t know/can’t remember"],

            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * FEVER START
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const feverStart = (parentKey: string, keySymptomsQuestion: string, keySymptomStart: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'a';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Q6.title.0"],
            ["en", "On what day did your fever start? If you do not recall the exact date, please give an approximate date."],

        ]))
    )

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keySymptomsQuestion, [responseGroupKey, multipleChoiceKey].join('.'), '1')
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6.helpGroup.text.1"],
                    ["en", "Fever is an important diagnostic symptom, so we would like to know when the fever appeared."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6.helpGroup.text.3"],
                    ["en", "Answer as precisely as possible."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'dateInput',
            optionProps: {
                min: {
                    dtype: 'exp', exp: {
                        name: 'getAttribute',
                        data: [
                            { dtype: 'exp', exp: expWithArgs('getResponseItem', keySymptomStart, [responseGroupKey,  singleChoiceKey, '0'].join('.')) },
                            { str: 'value', dtype: 'str' }
                        ],
                        returnType: 'int',
                    }
                },
                max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 10) },
            },
            content: new LanguageMap([
                ["id", "weekly.HS.Q6.rg.scg.dateInput.0"],
                ["en", "Choose date"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6.rg.scg.option.1"],
                ["en", "I don’t know/can’t remember"],

            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * FEVER DEVELOPED SUDDENLY
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const feverDevelopedSuddenly = (parentKey: string, keySymptomsQuestion: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'b';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Q6b.title.0"],
            ["en", "Did your fever develop suddenly over a few hours?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keySymptomsQuestion, [responseGroupKey, multipleChoiceKey].join('.'), '1')
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6b.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6b.helpGroup.text.1"],
                    ["en", "The sudden onset of symptoms (within a few hours) is linked to the coronavirus and influenza."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6b.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6b.helpGroup.text.3"],
                    ["en", "Answer “yes” if your symptoms appeared within a few hours, and not gradually over a period of several days."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6b.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6b.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6b.rg.scg.option.2"],
                ["en", "I don’t know/can’t remember"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * DID YOU MEASURE TEMPERATURE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const didUMeasureTemperature = (parentKey: string, keySymptomsQuestion: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'c';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Q6c.title.0"],
            ["en", "Did you take your temperature?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keySymptomsQuestion, [responseGroupKey, multipleChoiceKey].join('.'), '1')
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6c.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6c.helpGroup.text.1"],
                    ["en", "If you have taken your temperature, we would like to know the highest body temperature you have measured."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6c.helpGroup.text.2"],
                    ["en", "How should I answer it?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6c.helpGroup.text.3"],
                    ["en", "Answer yes, if you took your temperature using a thermometer."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6c.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6c.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6c.rg.scg.option.2"],
                ["en", "I don’t know/can’t remember"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * HIGHEST TEMPERATURE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyDidYouMeasureTemperature reference to the question if temperature was taken
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const highestTemprerature = (parentKey: string, keySymptomsQuestion: string, keyDidYouMeasureTemperature: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'd';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Q6d.title.0"],
            ["en", "What was your highest temperature measured?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('and',
            expWithArgs('responseHasKeysAny', keyDidYouMeasureTemperature, [responseGroupKey, singleChoiceKey].join('.'), '0'),
            expWithArgs('responseHasKeysAny', keySymptomsQuestion, [responseGroupKey, multipleChoiceKey].join('.'), '1')
        )
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6d.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6d.helpGroup.text.1"],
                    ["en", "Certain infectious diseases cause a raised temperature."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6d.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q6d.helpGroup.text.3"],
                    ["en", "Please indicate the highest temperature you measured during the period in which you experienced your symptoms."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6d.rg.scg.option.0"],
                ["en", "Below 37.0°C"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6d.rg.scg.option.1"],
                ["en", "37.0°C - 37.4°C"],

            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6d.rg.scg.option.2"],
                ["en", "37.5°C - 37.9°C"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6d.rg.scg.option.3"],
                ["en", "38.0°C - 38.9°C"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6d.rg.scg.option.4"],
                ["en", "39.0°C - 39.9°C"],
            ])
        }, {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6d.rg.scg.option.5"],
                ["en", "40.0°C or more"],
            ])
        },
        {
            key: '6', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q6d.rg.scg.option.6"],
                ["en", "I don't know/can't remember"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

const getFullFeverGroup = (parentKey: string, keySymptomsQuestion: string, keySymptomStart: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q6';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: true });
    editor.setVersion(1);

    editor.setSelectionMethod({ name: 'sequential' });
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keySymptomsQuestion, [responseGroupKey, multipleChoiceKey].join('.'), '1')
    );

    // Fever Start
    editor.addSurveyItem(feverStart(itemKey, keySymptomsQuestion, keySymptomStart, isRequired));

    // Developed Suddenly
    editor.addSurveyItem(feverDevelopedSuddenly(itemKey, keySymptomsQuestion, isRequired));

    // Did you take temperature
    const Q_tempTaken = didUMeasureTemperature(itemKey, keySymptomsQuestion, isRequired);
    editor.addSurveyItem(Q_tempTaken);

    // What was the highest
    editor.addSurveyItem(highestTemprerature(itemKey, keySymptomsQuestion, Q_tempTaken.key, isRequired));

    return editor.getItem();
}

/**
 * CONSENT FOR MORE QUESTIONS: single choice question to get consent for further questions
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySymptomsQuestion reference to the symptom survey
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const consentForMore = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q36'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.HS.Q36.title.0"],
            ["en", "Thank you for all these information. They will help us to estimate the frequency of symptoms among general population. You can stop here. If you have a little more time, we propose you to answer further questions about your symptoms and care. Do you accept to answer to these additional questions?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q36.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Q36.helpGroup.text.1"],
                    ["en", "We want to know if you are willing to answer the follow-up questions. Your answers to the follow-up questions may assist our research."],
                ]),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option', content: new LanguageMap([
                ["id", "weekly.HS.Q36.rg.scg.option.0"],
                ["en", "Yes"],

            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.HS.Q36.rg.scg.option.1"],
                ["en", "No"],
            ])
        }
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * GROUP DEPENDING ON IF ANY SYMPTOMS PRESENT AND USER WANTS TO ANSWER MORE QUESTIONS
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param userConsentForSymptoms reference to the symptom survey
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const hasMoreGroup = (parentKey: string, consentForMoreKey: string, keyOverride?: string): Group => {

    class HasMoreGroup extends Group {
        constructor(parentKey: string, defaultKey: string) {
            super(parentKey, defaultKey);
            this.groupEditor.setCondition(
                expWithArgs('responseHasKeysAny', consentForMoreKey, [responseGroupKey, singleChoiceKey].join('.'), '1'),
            );
        }

        buildGroup() { }
    }

    return new HasMoreGroup(parentKey, 'EX');
}

/**
 * SYMPTOM IMPLIED COVID-19 TEST PERFORMED
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const symptomImpliedCovidTest = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov16h'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Qcov16h.title.0"],
            ["en", "Because of your symptoms, did you undergo a test/analyses to know if you have COVID-19?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov16h.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov16h.helpGroup.text.1"],
                    ["en", "We want to know which complaints lead people to get tested for the coronavirus."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });

    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16h.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16h.rg.scg.option.1"],
                ["en", "Not yet, I plan to shortly undergo a test"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16h.rg.scg.option.2"],
                ["en", "No, I have a prescription but will not undergo a test"],
            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16h.rg.scg.option.3"],
                ["en", "No"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * TEST TYPE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keysymptomImpliedCovidTest key to the answer of Qcov16
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const covidTestType = (parentKey: string, keysymptomImpliedCovidTest?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov16i'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Qcov16i.title.0"],
            ["en", "Which analyse(s) was it?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        // FIXME: in case keysymptomImpliedCovidTest chnges type eg: single -> multiple, this will break unless
        // singleChoiceKey is changed to multipleChoiceKey
        expWithArgs('responseHasKeysAny', keysymptomImpliedCovidTest, responseGroupKey + '.' + singleChoiceKey, '1'),
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov16i.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov16i.helpGroup.text.1"],
                    ["en", "We are interested in knowing how many people with symptoms have udergone a test"],
                ]),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov16i.rg.tyZC.text.0"],
                ["en", "Multiple answers possible"],
            ])),
        style: [{ key: 'className', value: 'mb-1' }]
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16i.rg.mcg.option.0"],
                ["en", "A PCR test (virus search, on a swab in nose or mouth, or a sputum or saliva sample)"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16i.rg.mcg.option.1"],
                ["en", "A serological analysis (screening for antibodies against this virus, from a drop of blood at fingertip or a blood sample)"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16i.rg.mcg.option.2"],
                ["en", "A rapid antigen detection test on a sample realized in the back of the nose (nasopharyngeal sampling, done by a health professional or a trained person, with a swab inserted to 15 cm into the nose, result obtained in less than one hour)"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16i.rg.mcg.option.3"],
                ["en", "A rapid antigen detection test or autotest done on a nasal sample (a swab inserted to 1 - 4 cm into the nostril, sampling that can be done by oneself, result obtained in a few minutes)"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * RESULT COVID-19 PCR TEST: result COVID-19 test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keysymptomImpliedCovidTest key to the answer of Qcov16
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const resultPCRTest = (parentKey: string, testType?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov16b'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Qcov16b.title.0"],
            ["en", "Do you know the result of your PCR test? (if several were performed and at least one was positive, chose the “Positive” answer)"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', testType, responseGroupKey + '.' + multipleChoiceKey, '1'),
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov16b.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov16b.helpGroup.text.1"],
                    ["en", "We want to understand how the coronavirus is spreading within the population."],
                ]),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16b.rg.scg.option.0"],
                ["en", "Yes, positive for COVID-19"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16b.rg.scg.option.1"],
                ["en", "Yes, negative for COVID-19"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16b.rg.scg.option.2"],
                ["en", "Yes, the results are inconclusive"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16b.rg.scg.option.3"],
                ["en", "No, I have not yet received the test results"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * RESULT COVID-19 RAPID TEST: result COVID-19 rapid test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keysymptomImpliedCovidTest key to the answer of Qcov16
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const resultAntigenicTest = (parentKey: string, testType?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov16f'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Qcov16f.title.0"],
            ["en", "Do you know the result of this rapid antigen detection test on nasopharyngeal sample? (if several were performed and at least one was positive, chose the “Positive” answer)"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', testType, responseGroupKey + '.' + multipleChoiceKey, '3'),
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov16f.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov16f.helpGroup.text.1"],
                    ["en", "We want to understand how the coronavirus is spreading within the population."],
                ]),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16f.rg.scg.option.0"],
                ["en", "Yes, positive for COVID-19"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16f.rg.scg.option.1"],
                ["en", "Yes, negative for COVID-19"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16f.rg.scg.option.2"],
                ["en", "Yes, the results are inconclusive"],
            ])
        },
        {
            key: '99', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16f.rg.scg.option.3"],
                ["en", "I don't know / I don't want to answer"],
            ]),
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * RESULT COVID-19 RAPID TEST: result COVID-19 rapid test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keysymptomImpliedCovidTest key to the answer of Qcov16
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const resultRapidAntigenicTest = (parentKey: string, testType?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov16k'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Qcov16k.title.0"],
            ["en", "Do you know the result of this antigenic test or self-test on nasal sample? (if several were performed and at least one was positive, chose the “Positive” answer)"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', testType, responseGroupKey + '.' + multipleChoiceKey, '4'),
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov16k.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov16k.helpGroup.text.1"],
                    ["en", "We want to understand how the coronavirus is spreading within the population."],
                ]),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16k.rg.scg.option.0"],
                ["en", "Yes, positive for COVID-19"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16k.rg.scg.option.1"],
                ["en", "Yes, negative for COVID-19"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16k.rg.scg.option.2"],
                ["en", "Yes, the results are inconclusive"],
            ])
        },
        {
            key: '99', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov16k.rg.scg.option.3"],
                ["en", "I don't know / I don't want to answer"],
            ]),
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * SYMPTOM IMPLIED FLU TEST PERFORMED
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const fluTest = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov19'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Qcov19.title.0"],
            ["en", "Because of your symptoms, did you undergo a test/analyses to know if you have the Flu?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov19.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov19.helpGroup.text.1"],
                    ["en", "We want to know which complaints lead people to get tested for the flu."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov19.rg.scg.option.0"],
                ["en", "Yes, a PCR test based on a swab in nose or mouth, or a sputum or saliva sample"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov19.rg.scg.option.1"],
                ["en", "Yes, a rapid detection test (result available in less than an hour)"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov19.rg.scg.option.2"],
                ["en", "Not yet, I have a prescription and plan to shortly undergo a test"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov19.rg.scg.option.3"],
                ["en", "No, I have a prescription but will not undergo a test"],
            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov19.rg.scg.option.4"],
                ["en", "No"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * RESULT FLU PCR TEST: result flu test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyFluTest key to the answer of Qcov16
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const resultFluTest = (parentKey: string, keyFluTest?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov19b'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Qcov19b.title.0"],
            ["en", "Have you received the results of your Flu test?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keyFluTest, responseGroupKey + '.' + singleChoiceKey, '1', '5'),
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov19b.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov19b.helpGroup.text.1"],
                    ["en", "We want to understand how the flu is spreading within the population."],
                ]),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov19b.rg.scg.option.0"],
                ["en", "Yes, the test is positive for influenza"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov19b.rg.scg.option.1"],
                ["en", "Yes, the test is negative for influenza"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov19b.rg.scg.option.2"],
                ["en", "Yes, the results are inconclusive"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov19b.rg.scg.option.3"],
                ["en", "No, I have not yet received the test results"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * VISITED MEDICAL SERVICE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const visitedMedicalService = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q7';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Q7.title.0"],
            ["en", "Because of your symptoms, did you VISIT (see face to face or teleconsultation) any medical services?"],
        ]))
    );

    // CONDITION
    // None

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q7.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q7.helpGroup.text.1"],
                    ["en", "To find out whether people contact the health services because of their symptoms."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q7.helpGroup.text.2"],
                    ["en", "How should I answer it?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q7.helpGroup.text.3"],
                    ["en", "Tick all of those that apply. If you are due to see attend, then tick the final option."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-2' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Q7.rg.DTpM.text.0"],
                ["en", "Multiple answers possible"],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option',
            disabled: expWithArgs('responseHasOnlyKeysOtherThan', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q7.rg.mcg.option.0"],
                ["en", "No"],
            ])
        },
        {
            key: '1', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '5'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q7.rg.mcg.option.1"],
                ["en", "GP or GP's practice nurse"],
            ])
        },
        {
            key: '2', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '5'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q7.rg.mcg.option.2"],
                ["en", "Hospital admission"],
            ])
        },
        {
            key: '3', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '5'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q7.rg.mcg.option.3"],
                ["en", "Hospital accident & emergency department / out of hours service"],
            ])
        },
        {
            key: '4', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '5'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q7.rg.mcg.option.4"],
                ["en", "Other medical services"],
            ])
        },
        {
            key: '5', role: 'option',
            disabled: expWithArgs('responseHasOnlyKeysOtherThan', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '5'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q7.rg.mcg.option.5"],
                ["en", "No, but I have an appointment scheduled"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * WHEN VISITED MEDICAL SERVICE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyVisitedMedicalServ: reference to quesiton if visited any medical service
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const visitedMedicalServiceWhen = (parentKey: string, keyVisitedMedicalServ: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q7b';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Q7b.title.0"],
            ["en", "How soon after your symptoms appeared did you first VISIT this medical service?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasOnlyKeysOtherThan', keyVisitedMedicalServ, [responseGroupKey, multipleChoiceKey].join('.'), '0', '5')
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.helpGroup.text.1"],
                    ["en", "To find out how quickly people with symptoms are seen by the health services."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.helpGroup.text.2"],
                    ["en", "How should I answer it?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.helpGroup.text.3"],
                    ["en", "Only record the time until your FIRST contact with the health services."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Q7b.rg.sFcN.text.0"],
                ["en", 'Select the correct number of days'],
            ])),
    }, rg?.key);
    const ddOptions: ResponseRowCell = {
        key: 'col1', role: 'dropDownGroup', items: [
            {
                key: '0', role: 'option', content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.rg.mat.r1.col1.option.0"],
                    ["en", "Same day"],
                ]),
            },
            {
                key: '1', role: 'option', content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.rg.mat.r1.col1.option.1"],
                    ["en", "1 day"],
                ]),
            },
            {
                key: '2', role: 'option', content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.rg.mat.r1.col1.option.2"],
                    ["en", "2 days"],

                ]),
            },
            {
                key: '3', role: 'option', content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.rg.mat.r1.col1.option.3"],
                    ["en", "3 days"],
                ]),
            },
            {
                key: '4', role: 'option', content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.rg.mat.r1.col1.option.4"],
                    ["en", "4 days"],
                ]),
            },
            {
                key: '5', role: 'option', content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.rg.mat.r1.col1.option.5"],
                    ["en", "5 - 7 days"],
                ]),
            },
            {
                key: '6', role: 'option', content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.rg.mat.r1.col1.option.6"],
                    ["en", "More than 7 days"],
                ]),
            },
            {
                key: '7', role: 'option', content: new LanguageMap([
                    ["id", "weekly.EX.Q7b.rg.mat.r1.col1.option.7"],
                    ["en", "I don't know/can't remember"],
                ]),
            },
        ]
    };

    const rg_inner = initMatrixQuestion(matrixKey, [
        {
            key: 'header', role: 'headerRow', cells: [
                {
                    key: 'col0', role: 'text', content: new LanguageMap([
                        ["id", "weekly.EX.Q7b.rg.mat.header.col0.text.0"],
                        ["en", "Medical Service"],
                    ]),
                },
                {
                    key: 'col1', role: 'text'
                },
            ]
        },
        {
            key: 'r1', role: 'responseRow', cells: [
                {
                    key: 'col0', role: 'label', content: new LanguageMap([
                        ["id", "weekly.EX.Q7b.rg.mat.r1.col0.label.0"],
                        ["en", "GP or GP'r practice nurse"],
                    ]),
                },
                { ...ddOptions }
            ],
            displayCondition: expWithArgs('responseHasKeysAny', keyVisitedMedicalServ, [responseGroupKey, multipleChoiceKey].join('.'), '1')
        },
        {
            key: 'r2', role: 'responseRow', cells: [
                {
                    key: 'col0', role: 'label', content: new LanguageMap([
                        ["id", "weekly.EX.Q7b.rg.mat.r2.col0.label.0"],
                        ["en", "Hospital accident & department/out of hours service"],
                    ]),
                },
                { ...ddOptions }
            ],
            displayCondition: expWithArgs('responseHasKeysAny', keyVisitedMedicalServ, [responseGroupKey, multipleChoiceKey].join('.'), '3')
        },
        {
            key: 'r3', role: 'responseRow', cells: [
                {
                    key: 'col0', role: 'label', content: new LanguageMap([
                        ["id", "weekly.EX.Q7b.rg.mat.r3.col0.label.0"],
                        ["en", "Hospital admission"],
                    ]),
                },
                { ...ddOptions }
            ],
            displayCondition: expWithArgs('responseHasKeysAny', keyVisitedMedicalServ, [responseGroupKey, multipleChoiceKey].join('.'), '2')
        },
        {
            key: 'r4', role: 'responseRow', cells: [
                {
                    key: 'col0', role: 'label', content: new LanguageMap([
                        ["id", "weekly.EX.Q7b.rg.mat.r4.col0.label.0"],
                        ["en", "Other medical services"],
                    ]),
                },
                { ...ddOptions }
            ],
            displayCondition: expWithArgs('responseHasKeysAny', keyVisitedMedicalServ, [responseGroupKey, multipleChoiceKey].join('.'), '4')
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
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
const visitedNoMedicalService = (parentKey: string, keyVisitedMedicalServ?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov18';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Qcov18.title.0"],
            ["en", "What is the main reason for which you did not consult any health professional for the symptoms you declared today?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('and',
            expWithArgs('responseHasKeysAny', keyVisitedMedicalServ, [responseGroupKey, multipleChoiceKey].join('.'), '0'),
        )
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov18.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov18.helpGroup.text.1"],
                    ["en", "To understand why some people do not consult a doctor."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov18.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov18.helpGroup.text.3"],
                    ["en", "Multiple answers are possible."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-2' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.4opV.text.0"],
                ["en", "Multiple answers possible"],
            ])),
    }, rg?.key);

    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.0"],
                ["en", "My symptoms appeared very recently"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.1"],
                ["en", "My symptoms are mild"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.2"],
                ["en", "I have these symptoms often"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.3"],
                ["en", "I think I know what I have and I self-medicate"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.4"],
                ["en", "I think there is no effective treatment for the disease I have"],
            ])
        },
        {
            key: '6', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.5"],
                ["en", "It is too hard to get an appointment quickly"],
            ])
        },
        {
            key: '7', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.6"],
                ["en", "I do not have time"],
            ])
        },
        {
            key: '8', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.7"],
                ["en", "For financial reasons"],
            ])
        },
        {
            key: '9', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.8"],
                ["en", "For fear of consequences if the doctor thinks I have COVID-19"],
            ])
        },
        {
            key: '11', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.9"],
                ["en", "Because I am vaccinated against COVID-19"],
            ])
        },
        {
            key: '10', role: 'input',
            style: [{ key: 'className', value: 'w-100' }],
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.input.10"],
                ["en", "For another reason"],
            ]),
            description: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.description.input.10"],
                ["en", "Describe here (optional)"],
            ])
        },
        {
            key: '99', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Qcov18.rg.scg.option.11"],
                ["en", "I don't know / I don't want to answer"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);


    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * TOOK ANY MEDICATION
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const tookMedication = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q9';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Q9.title.0"],
            ["en", "Did you take medication for these symptoms?"],
        ]))
    );

    // CONDITION
    // None

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q9.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q9.helpGroup.text.1"],
                    ["en", "To find out who gets treated, and how effective treatment is."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q9.helpGroup.text.2"],
                    ["en", "How should I answer it?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q9.helpGroup.text.3"],
                    ["en", "Only record those medications that you used because of this illness. If you are on other medications because of a pre-existing illness then do not record these."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Q9.rg.vMc3.text.0"],
                ["en", 'Select all options that apply'],
            ])),
        style: [{ key: 'className', value: 'mb-1' }]
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0',
            role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '6'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q9.rg.mcg.option.0"],
                ["en", "No medication"],
            ])
        },
        {
            key: '1',
            role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '6'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q9.rg.mcg.option.1"],
                ["en", "Pain killers (e.g. paracetamol, lemsip, ibuprofen, aspirin, calpol, etc)"],
            ])
        },
        {
            key: '2',
            role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '6'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q9.rg.mcg.option.2"],
                ["en", "Cough medication (e.g. expectorants)"],
            ])
        },/*
        {
            key: '9',
            role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '6'),
            content: new LanguageMap([
                ["id", "hecfaecb"],
                ["en", "Hayfever medication"],

            ])
        }, */
        {
            key: '3',
            role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '6'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q9.rg.mcg.option.3"],
                ["en", "Antivirals against influenza (eg: Tamiflu)"],
            ])
        },
        {
            key: '4',
            role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '6'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q9.rg.mcg.option.4"],
                ["en", "Antibiotics"],
            ])
        },
        {
            key: '7',
            role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '6'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q9.rg.mcg.option.5"],
                ["en", "Homeopathy"],
            ])
        },
        {
            key: '8',
            role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '6'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q9.rg.mcg.option.6"],
                ["en", "Alternative medicine (essential oil, phytotherapy, etc.)"],
            ])
        },
        {
            key: '5',
            role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '6'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q9.rg.mcg.option.7"],
                ["en", "Other"],
            ])
        },
        {
            key: '6',
            role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "weekly.EX.Q9.rg.mcg.option.8"],
                ["en", "I don't know/can't remember"],
            ])
        },

    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * HOSPITALIZED BECAUSE OF SYMPTOMS: single choice question to check if symptoms lead to hospitalization
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const hospitalized = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q14'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Q14.title.0"],
            ["en", "Because of your symptoms, were you hospitalized?"],
        ]))
    );

    // CONDITION
    // None

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q14.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q14.helpGroup.text.1"],
                    ["en", "We want to understand the rates of hospitalization due to symptoms"],
                ]),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option', content: new LanguageMap([
                ["id", "weekly.EX.Q14.rg.scg.option.0"],
                ["en", "Yes"],

            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q14.rg.scg.option.1"],
                ["en", "No"],
            ])
        }
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * DAILY ROUTINE
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const dailyRoutine = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q10';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Q10.title.0"],
            ["en", "Did you change your daily routine because of your illness?"],
        ]))
    );

    // CONDITION
    // None

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10.helpGroup.text.1"],
                    ["en", "To determine how the symptoms are impacting your daily life."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10.helpGroup.text.3"],
                    ["en", "We want to know if you have missed work or school due to your symptoms, or if you have modified your daily routine in any way (for example, if you were unable to engage in sport activities). If you are a student, and were unable to attend online classes due to your symptoms, you should also select option 2. We are interested in changes due to your symptoms/complaints and not due to any quarantine."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0',
            role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q10.rg.scg.option.0"],
                ["en", "No, I was able to go about my daily activities as usual"],
            ])
        },
        {
            key: '1',
            role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q10.rg.scg.option.1"],
                ["en", "Yes, but I did not take time off work/school"],
            ])
        },
        {
            key: '2',
            role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q10.rg.scg.option.2"],
                ["en", "Yes, I took time off school or work"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * DAILY ROUTINE TODAY
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyDailyRoutine: reference to question if participant missed work/school
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const dailyRoutineToday = (parentKey: string, keyDailyRoutine: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q10b';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Q10b.title.0"],
            ["en", "Are you currently still unable to work or attend school due to your symptoms/complaints?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keyDailyRoutine, [responseGroupKey, singleChoiceKey].join('.'), '2')
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10b.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10b.helpGroup.text.1"],
                    ["en", "To determine how the symptoms are impacting your daily life."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10b.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10b.helpGroup.text.3"],
                    ["en", "Answer 'yes' if you missed work or school today due to certain symptoms."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0',
            role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q10b.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '1',
            role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q10b.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '3',
            role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q10b.rg.scg.option.2"],
                ["en", "Other (I did not have to work or go to school today in any case)"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);
    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * DAILY ROUTINE DAYS MISSED WORK/SCHOOL
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyDailyRoutine: reference to question if participant missed work/school
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const dailyRoutineDaysMissed = (parentKey: string, keyDailyRoutine: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q10c'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Q10c.title.0"],
            ["en", "For how many days have you been unable to work normally/go to school (when you otherwise would have)?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keyDailyRoutine, [responseGroupKey, singleChoiceKey].join('.'), '2')
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10c.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10c.helpGroup.text.1"],
                    ["en", "To calculate the number of days a person misses work or school due to certain symptoms."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10c.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q10c.helpGroup.text.3"],
                    ["en", "Only count the days that you would otherwise have gone to work or school. Provide as precise an estimate as possible."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    const ddOptions = initDropdownGroup('ddg', [
        {
            key: '0', role: 'option', content: new LanguageMap([
                ["id", "weekly.EX.Q10c.rg.ddg.option.0"],
                ["en", "1 day"],
            ]),
        },
        {
            key: '1', role: 'option', content: new LanguageMap([
                ["id", "weekly.EX.Q10c.rg.ddg.option.1"],
                ["en", "2 days"],
            ]),
        },
        {
            key: '2', role: 'option', content: new LanguageMap([
                ["id", "weekly.EX.Q10c.rg.ddg.option.2"],
                ["en", "3 days"],
            ]),
        },
        {
            key: '3', role: 'option', content: new LanguageMap([
                ["id", "weekly.EX.Q10c.rg.ddg.option.3"],
                ["en", "4 days"],
            ]),
        },
        {
            key: '4', role: 'option', content: new LanguageMap([
                ["id", "weekly.EX.Q10c.rg.ddg.option.4"],
                ["en", "5 days"],
            ]),
        },
        {
            key: '5', role: 'option', content: new LanguageMap([
                ["id", "weekly.EX.Q10c.rg.ddg.option.5"],
                ["en", "6 to 10 days"],
            ]),
        },
        {
            key: '6', role: 'option', content: new LanguageMap([
                ["id", "weekly.EX.Q10c.rg.ddg.option.6"],
                ["en", "11 to 15 days"],
            ]),
        },
        {
            key: '7', role: 'option', content: new LanguageMap([
                ["id", "weekly.EX.Q10c.rg.ddg.option.7"],
                ["en", "More than 15 days"],
            ]),
        },
    ]);

    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent(ddOptions, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * COVID-19 Personal Habits Changes: likert scale question about changes in personal habits after experiencing covid symptoms
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySymptomsQuestion reference to the symptom survey
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const covidHabitsChange = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov7'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Qcov7.title.0"],
            ["en", "Did you begin to follow or increase any of the measures below, due to your symptoms (compared to the period before your symptoms began)?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov7.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov7.helpGroup.text.1"],
                    ["en", "To examine how different measures are being followed."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov7.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Qcov7.helpGroup.text.3"],
                    ["en", "For example, 'Avoid shaking hands': Answer 'yes' if you shake hands less or not at all due to your symptoms; Answer 'No, I am not following this measure' if you continue to shake hands despite your symptoms; Answer 'No, I was already following this measure' if you had already stopped shaking hands before the onset of your symptoms and you did not change this behaviour."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );


    // RESPONSE PART
    const likertOptions = [
        {
            key: "1", content: new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.likert_1.option.0"],
                ["en", " Yes, I am following this measure now for the first time, or in a stricter way"],
            ])
        },
        {
            key: "2", content: new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.likert_1.option.1"],
                ["en", "No, I was already following this measure"],
            ])
        },
        {
            key: "0", content: new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.likert_1.option.2"],
                ["en", "No, I am not following this measure"],
            ])
        },
        {
            key: "3", content: new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.likert_1.option.3"],
                ["en", "Not applicable"],
            ])
        }
    ];

    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-2' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.gU4U.text.0"],
                ["en", "To be completed optionally"],
            ])),
    }, rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.v1C0.text.1"],
                ["en", 'Regularly wash or disinfect hands'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_1', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.nEMR.text.3"],
                ["en", 'Cough or sneeze into your elbow'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_2', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.oTIp.text.5"],
                ["en", 'Use a disposable tissue'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_3', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.7w6F.text.7"],
                ["en", "Wear a face mask indoors"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_4a', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.vHvi.text.9"],
                ["en", "Wear a face mask outdoors"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_4b', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.ocTu.text.11"],
                ["en", "Avoid shaking hands"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_5', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.ioJs.text.13"],
                ["en", "Stop greeting by hugging and/or kissing on both cheeks"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_11', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.ujsK.text.15"],
                ["en", "Limit your use of public transport"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_6', likertOptions), rg?.key);


    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.Ijdr.text.17"],
                ["en", "Avoid busy places and gatherings (supermarket, cinema, stadium)"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_7', likertOptions), rg?.key);


    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.t8MS.text.19"],
                ["en", "Stay at home"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_8', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.z4bE.text.21"],
                ["en", "Telework or increase your number of telework days"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_9', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.Koue.text.23"],
                ["en", "Avoid travel outside your own country or region"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_10', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.zuDa.text.25"],
                ["en", "Have your food/shopping delivered by a store or a friend/family member"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_13', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.QSBP.text.27"],
                ["en", "Avoid seeing friends and family"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_14', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.fRla.text.29"],
                ["en", "Avoid being in contact with people over 65 years old or with a chronic disease"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_15', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "weekly.EX.Qcov7.rg.h3fK.text.31"],
                ["en", "Avoid being in contact with children"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_16', likertOptions), rg?.key);

    // VALIDATIONs
    // None

    return editor.getItem();
}

/**
 * PERCIEVED CAUSE OF SYMPTOMS
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const causeOfSymptoms = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q11';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "weekly.EX.Q11.title.0"],
            ["en", "What do you think is causing your symptoms?"],
        ]))
    );

    // CONDITION
    // None

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q11.helpGroup.text.0"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q11.helpGroup.text.1"],
                    ["en", "To see if our assessment of your illness, based on your symptoms, matches what you believe to be the cause. You may have a better idea of the cause of your illness than our computer algorithms."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q11.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "weekly.EX.Q11.helpGroup.text.3"],
                    ["en", "If you are reasonably sure of the cause of your symptoms, select the appropriate box. Otherwise, select 'No, I Don’t know'."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q11.rg.scg.option.0"],
                ["en", "Flu or flu-like illness"],
            ])
        },
        {
            key: '9', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q11.rg.scg.option.1"],
                ["en", "New coronavirus (COVID-19)"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q11.rg.scg.option.2"],
                ["en", "Common cold"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q11.rg.scg.option.3"],
                ["en", "Allergy/hay fever"],
            ])
        },
        {
            key: '6', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q11.rg.scg.option.4"],
                ["en", "Ashtma"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q11.rg.scg.option.5"],
                ["en", "Gastroenteritis complaints or gastric flu"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q11.rg.scg.option.6"],
                ["en", "Other"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "weekly.EX.Q11.rg.scg.option.7"],
                ["en", "I don't know"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

export const WeeklyQuestions = {
    causeOfSymptoms,
    covidHabitsChange,
    dailyRoutine,
    dailyRoutineToday,
    dailyRoutineDaysMissed,
    feverGroup: {
        all: getFullFeverGroup,
        feverStart,
        feverDevelopedSuddenly,
        didUMeasureTemperature,
        highestTemprerature,
    },
    consentForMore,
    hasMoreGroup,
    fluTest,
    hasSymptomsGroup,
    hospitalized,
    pcrHouseholdContact,
    pcrTestedContact,
    resultFluTest,
    resultPCRTest,
    resultAntigenicTest,
    resultRapidAntigenicTest,
    sameIllnes,
    symptomImpliedCovidTest,
    covidTestType,
    symptomps,
    symptomsStart,
    symptomsEnd,
    symptomsSuddenlyDeveloped,
    tookMedication,
    visitedMedicalService,
    visitedMedicalServiceWhen,
    visitedNoMedicalService
}
