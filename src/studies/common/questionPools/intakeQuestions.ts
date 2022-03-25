import { LanguageMap } from "../languages"
import { SurveyItem } from "survey-engine/lib/data_types";
import { ComponentEditor } from "case-editor-tools/surveys/survey-editor/component-editor";
import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { initMatrixQuestion, initMultipleChoiceGroup, initSingleChoiceGroup, ResponseRowCell } from "case-editor-tools/surveys/survey-items";
import { expWithArgs, generateHelpGroupComponent, generateLocStrings, generateTitleComponent } from "case-editor-tools/surveys/utils/simple-generators";
import { matrixKey, multipleChoiceKey, responseGroupKey, singleChoiceKey } from "case-editor-tools/constants/key-definitions";


/**
 * GENDER: Single choice question about gender
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const gender = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q1';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q1.title.0"],
            ["en", "What is your gender?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q1.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q1.helpGroup.text.1"],
                    ["en", "In order to examine the differences between men and women."],

                ]),
                style: [{ key: 'variant', value: 'p' }, { key: 'className', value: 'm-0' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q1.rg.scg.option.0"],
                ["en", "Male"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q1.rg.scg.option.1"],
                ["en", "Female"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q1.rg.scg.option.2"],
                ["en", "Other"],
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
 * AGE: Date of birth (year and month)
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const date_of_birth = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q2'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q2.title.0"],
            ["en", "What is your date of birth (month and year)?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q2.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q2.helpGroup.text.1"],
                    ["en", "In order to examine the differences between age groups."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const dateInputEditor = new ComponentEditor(undefined, {
        key: '1',
        role: 'dateInput'
    });
    dateInputEditor.setProperties({
        dateInputMode: { str: 'YM' },
        min: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', -3311280000) },
        max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 0) }
    })
    editor.addExistingResponseComponent(dateInputEditor.getComponent(), rg?.key);
    editor.addExistingResponseComponent({
        key: 'feedback',
        role: 'text',
        style: [{ key: 'className', value: 'fst-italic mt-1' }],
        displayCondition: expWithArgs('isDefined',
            expWithArgs('getResponseItem', editor.getItem().key, [responseGroupKey, '1'].join('.'))
        ),
        content: Array.from(new LanguageMap([
            ["id", "intake.Q2.rg.feedback.text.1"],
            ["en", ' years old'],
        ])).map(([code, str]) => {
            return {
                code: code, parts: [
                    { dtype: 'exp', exp: expWithArgs('dateResponseDiffFromNow', editor.getItem().key, [responseGroupKey, '1'].join('.'), 'years', 1) },
                    { str: str }
                ]
            };
        })
    }, rg?.key);

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
 * LOCATION (postal code): Simple input field to enter 4 numeric digits, embedded into a single choice for opt-out
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const postal_code = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q3'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q3.title.0"],
            ["en", "What is your home postal code?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q3.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q3.helpGroup.text.1"],
                    ["en", "In order to verify the representativeness of our cohort (the group of participants in this study), and to examine the geographical differences in the spread of the coronavirus and influenza."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q3.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q3.helpGroup.text.3"],
                    ["en", "Insert the postal code of your place of residence"],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'input',
            // style: [{ key: 'className', value: 'w-100' }],
            content: new LanguageMap([
                ["id", "intake.Q3.rg.scg.input.0"],
                ["en", "Postal code:"],
            ]),
            description: new LanguageMap([
                ["id", "intake.Q3.rg.scg.description.input.0"],
                ["en", "Postal code"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q3.rg.scg.option.1"],
                ["en", "I prefer not to answer this question"],
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
    editor.addValidation({
        key: 'r2',
        type: 'hard',
        rule: expWithArgs('or',
            expWithArgs('not', expWithArgs('hasResponse', itemKey, responseGroupKey)),
                          expWithArgs('checkResponseValueWithRegex', itemKey, [responseGroupKey, singleChoiceKey, '0'].join('.'), '^[0-9]+$'),
            expWithArgs('responseHasKeysAny', itemKey, [responseGroupKey, singleChoiceKey].join('.'), '1')
        )
    });

    editor.addValidation({
        key: 'r2max',
        type: 'hard',
        rule: expWithArgs('not', expWithArgs('checkResponseValueWithRegex', itemKey, [responseGroupKey, singleChoiceKey, '0'].join('.'), '^[0-9]{6,}$'))
    });

    editor.addDisplayComponent(
        {
            role: 'error',
            content: generateLocStrings(new LanguageMap([
                ["id", "intake.Q3.error.3"],
                ["en", "Please enter the digits of your postal code"],
            ])),
            displayCondition: expWithArgs('not', expWithArgs('getSurveyItemValidation', 'this', 'r2'))
        }
    );

    editor.addDisplayComponent(
        {
            role: 'error',
            content: generateLocStrings(new LanguageMap([
                ["id", "intake.Q3.error.4"],
                ["en", "Please enter at most 5 digits"],
            ])),
            displayCondition: expWithArgs('not', expWithArgs('getSurveyItemValidation', 'this', 'r2max'))
        }
    );

    return editor.getItem();
}

/**
 * MAIN ACTIVITY: single choice question about main activity
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const main_activity = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q4'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q4.title.0"],
            ["en", "What is your current professional status?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q4.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q4.helpGroup.text.1"],
                    ["en", "To check how representative our sample is compared to the population as a whole, and to find out whether the chance of getting flu is different for people in different types of occupation."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q4.helpGroup.text.2"],
                    ["en", "How should I answer it?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q4.helpGroup.text.3"],
                    ["en", 'Please, tick the box that most closely resembles your main occupation. For pre-school children who don\'t go to daycare tick the "other" box.'],
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
                ["id", "intake.Q4.rg.scg.option.0"],
                ["en", "Paid employment, full time"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4.rg.scg.option.1"],
                ["en", "Paid employment, part time"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4.rg.scg.option.2"],
                ["en", "Self-employed (businessman, farmer, tradesman, etc.)"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4.rg.scg.option.3"],
                ["en", "Attending daycare/school/college/university"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4.rg.scg.option.4"],
                ["en", "Home-maker (e.g. housewife)"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4.rg.scg.option.5"],
                ["en", "Unemployed"],
            ])
        },
        {
            key: '6', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4.rg.scg.option.6"],
                ["en", "Long-term sick-leave or parental leave"],
            ])
        },
        {
            key: '7', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4.rg.scg.option.7"],
                ["en", "Retired"],
            ])
        },
        {
            key: '8', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4.rg.scg.option.8"],
                ["en", "Other"],
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
 * LOCATION WORK (postal code): Simple input field to enter 4 numeric digits, embedded into a single choice for opt-out
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyMainActivity full key of the question about main activity, if set, dependency is applied
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const postal_code_work = (parentKey: string, keyMainActivity?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q4b'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q4b.title.0"],
            ["en", "What is the postal code of your school/college/workplace (where you spend the majority of your working/studying time)?"],
        ]))
    );

    // CONDITION
    if (keyMainActivity) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keyMainActivity, [responseGroupKey, singleChoiceKey].join('.'), '0', '1', '2', '3')
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q4b.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q4b.helpGroup.text.1"],
                    ["en", "To be able to determine the distance you regularly travel during your movements."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'input',
            // style: [{ key: 'className', value: 'w-100' }],
            content: new LanguageMap([
                ["id", "intake.Q4b.rg.scg.input.0"],
                ["en", "Postal code"],
            ]),
            description: new LanguageMap([
                ["id", "intake.Q4b.rg.scg.description.input.0"],
                ["en", "Postal code"],
            ]),
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4b.rg.scg.option.1"],
                ["en", "I don’t know"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4b.rg.scg.option.2"],
                ["en", "Not applicable (e.g. don’t have a fixed workplace)"],
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
    editor.addValidation({
        key: 'r2',
        type: 'hard',
        rule: expWithArgs('or',
            expWithArgs('not', expWithArgs('hasResponse', itemKey, responseGroupKey)),
            expWithArgs('checkResponseValueWithRegex', itemKey, [responseGroupKey, singleChoiceKey, '0'].join('.'), '^[0-9]+$'),
            expWithArgs('responseHasKeysAny', itemKey, [responseGroupKey, singleChoiceKey].join('.'), '1', '2')
        )
    });

    editor.addValidation({
        key: 'r2max',
        type: 'hard',
        rule: expWithArgs('not', expWithArgs('checkResponseValueWithRegex', itemKey, [responseGroupKey, singleChoiceKey, '0'].join('.'), '^[0-9]{6,}$'))
    });

    editor.addDisplayComponent(
        {
            role: 'error',
            content: generateLocStrings(new LanguageMap([
                ["id", "intake.Q4b.error.3"],
                ["en", "Please enter the digits of your postal code"],
            ])),
            displayCondition: expWithArgs('not', expWithArgs('getSurveyItemValidation', 'this', 'r2'))
        }
    );

    editor.addDisplayComponent(
        {
            role: 'error',
            content: generateLocStrings(new LanguageMap([
                ["id", "intake.Q4b.error.4"],
                ["en", "Please enter at most 5 digits"],
            ])),
            displayCondition: expWithArgs('not', expWithArgs('getSurveyItemValidation', 'this', 'r2max'))
        }
    );

    return editor.getItem();
}

/**
 * WORK TYPE: single choice question about main type of work
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const work_type_eurostat = (parentKey: string, keyMainActivity?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q4h'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q4h.title.0"],
            ["en", "Which of the following descriptions most closely matches with your main occupation? "],
        ]))
    );

    // CONDITION
    if (keyMainActivity) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keyMainActivity, [responseGroupKey, singleChoiceKey].join('.'), '0', '1', '2')
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q4h.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q4h.helpGroup.text.1"],
                    ["en", "To check how representative our sample is compared to the population as a whole and to find out whether the chance of getting COVID-19 or flu are different for people in different types of occupation."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q4h.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q4h.helpGroup.text.3"],
                    ["en", "Please tick the box that most closely resembles your main occupation."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.option.0"],
                ["en", "Services and sales workers (Personal Services Workers, Sales Workers, Personal Care Workers, Protective Services Workers)"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.option.1"],
                ["en", "Craft and related trades workers (Handicraft and printing workers, Food processing, wood working, garment and other craft and related trades workers,  Metal, machinery and related trades workers, Electrical and electronic trades workers, Building and related trades workers, excluding electricians)"],
            ])
        },
        {
            key: '6', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.option.2"],
                ["en", "Armed forces occupations (Commissioned armed forces officers, Armed forces occupations other ranks, Non-commissioned armed forces officers)"],
            ])
        },
        {
            key: '7', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.option.3"],
                ["en", "Managers (Chief Executives, Senior Officials and Legislators, Administrative and Commercial Managers, Production and Specialized Services Managers, Hospitality, Retail and Other Services Managers)"],
            ])
        },
        {
            key: '8', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.option.4"],
                ["en", "Professionals (Science and Engineering Professionals, Health Professionals,  Teaching Professionals, Business and Administration Professionals, Information and Communications Technology Professionals, Legal, Social and Cultural Professionals)"],
            ])
        },
        {
            key: '9', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.option.5"],
                ["en", "Technicians and associate professionals (Science and Engineering Associate Professionals, Health Associate Professionals, Business and Administration Associate Professionals, Legal, Social, Cultural and Related Associate Professionals, Information and Communications Technicians)"],
            ])
        },
        {
            key: '10', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.option.6"],
                ["en", "Clerical support workers (General and Keyboard Clerks, Customer Services Clerks,  Numerical and Material Recording Clerks, Other Clerical Support Workers)"],
            ])
        },
        {
            key: '11', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.option.7"],
                ["en", "Skilled agricultural, forestry and fishery workers"],
            ])
        },
        {
            key: '12', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.option.8"],
                ["en", "Plant and machine operators and assemblers (Stationary Plant and Machine Operators, Assemblers, Drivers and Mobile Plant Operators)"],
            ])
        },
        {
            key: '13', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.option.9"],
                ["en", "Elementary occupations (Cleaners and Helpers, Agricultural, Forestry and Fishery Labourers, Labourers in Mining, Construction, Manufacturing and Transport, Food Preparation Assistants, Street and Related Sales and Services Workers, Refuse Workers and Other Elementary Workers)"],
            ])
        },
        {
            key: '5', role: 'input',
            style: [{ key: 'className', value: 'w-100' }],
            content: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.input.10"],
                ["en", "Other"],
            ]),
            description: new LanguageMap([
                ["id", "intake.Q4h.rg.scg.description.input.10"],
                ["en", "Describe here (optional)"],
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
 * HIGHEST EDUCATION: single choice about what is the highest level of formal education
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const highest_education = (parentKey: string, keyQBirthday?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q4d'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q4d.title.0"],
            ["en", "What is the highest level of formal education/qualification that you have?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('gte',
            expWithArgs('dateResponseDiffFromNow', keyQBirthday, [responseGroupKey, '1'].join('.'), 'years', 1),
            16
        )
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q4d.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q4d.helpGroup.text.1"],
                    ["en", "To check how representative our sample is compared to the population of the UK (Italy, Belgium..) as a whole."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q4d.helpGroup.text.2"],
                    ["en", "How should I answer it?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q4d.helpGroup.text.3"],
                    ["en", "Please choose the box that represents your HIGHEST level of educational achievements. The different option rougly equate to: 1 - no qualifications, 2 - school-leaving exams at around 16 years of age, 3 - school-leaving exams at around 18 years of age, 4 - University degree or equivalent professional qualification, 5 - Higher degree or advanced professional qualification. If you are an adult who is currently undergoing part - time training(e.g.night school) then tick the box that represents your current highest level of education."],
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
                ["id", "intake.Q4d.rg.nUk7.text.0"],
                ["en", 'Select all options that apply'],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '1', '2', '3', '4', '5'),
            content: new LanguageMap([
                ["id", "intake.Q4d.rg.mcg.option.0"],
                ["en", "I have no formal qualification"],
            ])
        },
        {
            key: '1', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '2', '3', '4'),
            content: new LanguageMap([
                ["id", "intake.Q4d.rg.mcg.option.1"],
                ["en", "GCSEs, levels, CSEs or equivalent"],
            ])
        },
        {
            key: '2', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '1', '3', '4'),
            content: new LanguageMap([
                ["id", "intake.Q4d.rg.mcg.option.2"],
                ["en", "A-levels or equivalent (e.g. Higher, NVQ Level3, BTEC)"],
            ])
        },
        {
            key: '3', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '1', '2', '4'),
            content: new LanguageMap([
                ["id", "intake.Q4d.rg.mcg.option.3"],
                ["en", "Bachelor Degree (BA, BSc) or equivalent"],
            ])
        },
        {
            key: '4', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0', '1', '2', '3'),
            content: new LanguageMap([
                ["id", "intake.Q4d.rg.mcg.option.4"],
                ["en", "Higher Degree or equivalent (e.g. Masters Degree, PGCE, PhD, Medical Doctorate, Advanced Professional Award)"],
            ])
        },
        {
            key: '5', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q4d.rg.mcg.option.5"],
                ["en", "I am still in education"],
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
 * PEOPLE MET: multiple choice for person groups you met
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const people_met = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q5'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q5.title.0"],
            ["en", "Except people you meet on public transportation, do you have contact with any of the following during the course of a typical day (so without COVID-19 measures)?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q5.helpGroup.text.0"],
                    ["en", "Perché ti facciamo questa domanda?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q5.helpGroup.text.1"],
                    ["en", "To find out whether you are likely to be exposed to more infection risk than the average person (e.g. work with children, or patients)."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q5.helpGroup.text.2"],
                    ["en", "Hint:"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q5.helpGroup.text.3"],
                    ["en", "Groups of people could include any setting where you come into contact with large numbers of people at once, e.g. a teacher who may contact many children in a day."],
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
                ["id", "intake.Q5.rg.dwL8.text.0"],
                ["en", 'Select all options that apply'],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '4'),
            content: new LanguageMap([
                ["id", "intake.Q5.rg.mcg.option.0"],
                ["en", "More than 10 children or teenagers (without counting your own children)"],
            ])
        },
        {
            key: '1', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '4'),
            content: new LanguageMap([
                ["id", "intake.Q5.rg.mcg.option.1"],
                ["en", "More than 10 people aged over 65"],
            ])
        },
        {
            key: '2', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '4'),
            content: new LanguageMap([
                ["id", "intake.Q5.rg.mcg.option.2"],
                ["en", "Patients"],
            ])
        }, {
            key: '3', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '4'),
            content: new LanguageMap([
                ["id", "intake.Q5.rg.mcg.option.3"],
                ["en", "Groups of people (more than 10 individuals at any one time)"],
            ])
        }, {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q5.rg.mcg.option.4"],
                ["en", "None of the above"],
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
 * AGE GROUPS: dropdown table about number of people in different age groups
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const age_groups = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q6'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q6.title.0"],
            ["en", "INCLUDING YOU, how many people in each of the following age groups live in your household?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q6.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q6.helpGroup.text.1"],
                    ["en", "Members of larger households, or those with children, may more likely get infected than the others."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });

    // Dropdown options - used in each cell
    const ddg: ResponseRowCell = {
        key: 'col1', role: 'dropDownGroup',
        items: [
            {
                key: '0', role: 'option', content: new LanguageMap([
                    ["any", "0"],
                ])
            },
            {
                key: '1', role: 'option', content: new LanguageMap([
                    ["any", "1"],
                ]),
            }, {
                key: '2', role: 'option', content: new LanguageMap([
                    ["any", "2"],
                ]),
            }, {
                key: '3', role: 'option', content: new LanguageMap([
                    ["any", "3"],
                ]),
            }, {
                key: '4', role: 'option', content: new LanguageMap([
                    ["any", "4"],
                ]),
            }, {
                key: '5', role: 'option', content: new LanguageMap([
                    ["any", "5+"],
                ]),
            },
        ]
    };

    const rg_inner = initMatrixQuestion(matrixKey, [
        {
            key: 'row0', role: 'responseRow',
            cells: [
                {
                    key: 'l', role: 'label',
                    content: new LanguageMap([
                        ["id", "intake.Q6.rg.mat.row0.l.label.0"],
                        ["en", "0 - 4 years"],
                    ])
                },
                { ...ddg }
            ],
        },
        {
            key: 'row1', role: 'responseRow',
            cells: [
                {
                    key: 'l', role: 'label',
                    content: new LanguageMap([
                        ["id", "intake.Q6.rg.mat.row1.l.label.0"],
                        ["en", "5 - 18 years"],
                    ])
                },
                { ...ddg }
            ],
        },
        {
            key: 'row2', role: 'responseRow',
            cells: [
                {
                    key: 'l', role: 'label',
                    content: new LanguageMap([
                        ["id", "intake.Q6.rg.mat.row2.l.label.0"],
                        ["en", "19 - 44 years"],
                    ])
                },
                { ...ddg }
            ]
        },
        {
            key: 'row3', role: 'responseRow',
            cells: [
                {
                    key: 'l', role: 'label',
                    content: new LanguageMap([
                        ["id", "intake.Q6.rg.mat.row3.l.label.0"],
                        ["en", "45 - 64 years"],
                    ])
                },
                { ...ddg }
            ]
        },
        {
            key: 'row4', role: 'responseRow',
            cells: [
                {
                    key: 'l', role: 'label',
                    content: new LanguageMap([
                        ["id", "intake.Q6.rg.mat.row4.l.label.0"],
                        ["en", "65+"],
                    ])
                },
                { ...ddg }
            ]
        }
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('or',
                expWithArgs('hasResponse', itemKey, [responseGroupKey, matrixKey, "row0", "col1"].join('.')),
                expWithArgs('hasResponse', itemKey, [responseGroupKey, matrixKey, "row1", "col1"].join('.')),
                expWithArgs('hasResponse', itemKey, [responseGroupKey, matrixKey, "row2", "col1"].join('.')),
                expWithArgs('hasResponse', itemKey, [responseGroupKey, matrixKey, "row3", "col1"].join('.')),
                expWithArgs('hasResponse', itemKey, [responseGroupKey, matrixKey, "row4", "col1"].join('.'))),
            });
    }

    return editor.getItem();
}

/**
 * PEOPLE AT RISK: single choice about people at risk among contacts
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const people_at_risk = (parentKey: string, keyOfAgeGroups?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q6c'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q6c.title.0"],
            ["en", "One or several of these people are they at risk of complications in case of flu or COVID-19 (e.g, pregnant, over 65, underlying health condition, obese, etc.)?"],
        ]))
    );

    // CONDITION
    if (keyOfAgeGroups) {
        editor.setCondition(
            expWithArgs('or',
                expWithArgs('responseHasOnlyKeysOtherThan', [keyOfAgeGroups].join('.'), [responseGroupKey, matrixKey, 'row0', 'col1'].join('.'), '0'),
                expWithArgs('responseHasOnlyKeysOtherThan', [keyOfAgeGroups].join('.'), [responseGroupKey, matrixKey, 'row1', 'col1'].join('.'), '0'),
                expWithArgs('responseHasOnlyKeysOtherThan', [keyOfAgeGroups].join('.'), [responseGroupKey, matrixKey, 'row2', 'col1'].join('.'), '0'),
                expWithArgs('responseHasOnlyKeysOtherThan', [keyOfAgeGroups].join('.'), [responseGroupKey, matrixKey, 'row3', 'col1'].join('.'), '0'),
                expWithArgs('responseHasOnlyKeysOtherThan', [keyOfAgeGroups].join('.'), [responseGroupKey, matrixKey, 'row4', 'col1'].join('.'), '0'),
            )
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q6c.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },

            {
                content: new LanguageMap([
                    ["id", "intake.Q6c.helpGroup.text.1"],
                    ["en", "TODO"],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q6c.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q6c.helpGroup.text.3"],
                    ["en", "TODO"],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q6c.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q6c.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q6c.rg.scg.option.2"],
                ["en", "Don't know/would rather not answer"],
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
 * CHILDREN IN SCHOOL: single choice with how many children going to school or daycare
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyOfAgeGroups full key of the question about age groups, if set, dependency is applied
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const children_in_school = (parentKey: string, keyOfAgeGroups?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q6b'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q6b.title.0"],
            ["en", "How many of the children in your household go to school or day-care?"],
        ]))
    );

    // CONDITION
    if (keyOfAgeGroups) {
        editor.setCondition(
            expWithArgs('or',
                expWithArgs('responseHasOnlyKeysOtherThan', [keyOfAgeGroups].join('.'), [responseGroupKey, matrixKey, 'row0', 'col1'].join('.'), '0'),
                expWithArgs('responseHasOnlyKeysOtherThan', [keyOfAgeGroups].join('.'), [responseGroupKey, matrixKey, 'row1', 'col1'].join('.'), '0'),
            )
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q6b.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q6b.helpGroup.text.1"],
                    ["en", "Attending school, daycare or childcare can increase the risk of contracting the coronavirus or influenza, as well as other similar illnesses. We wish to study this issue."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q6b.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q6b.helpGroup.text.3"],
                    ["en", "If your child attends school, daycare or childcare (even if only one day a week), please count it. Participation in (sport) associations or other extracurricular activities does not count."],
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
                ["id", "intake.Q6b.rg.scg.option.0"],
                ["en", "None"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["any", "1"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["any", "2"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["any", "3"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["any", "4"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["any", "5"],
            ])
        },
        {
            key: '99', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q6b.rg.scg.option.6"],
                ["en", "More than 5"],
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
 * MEANS OF TRANSPORT: single choice about main means of transport
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const means_of_transport = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q7'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q7.title.0"],
            ["en", "What means of transportation do you typically use for your daily activities?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q7.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q7.helpGroup.text.1"],
                    ["en", "We want to know if people who regularly use public transportation have a higher risk of infection."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q7.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q7.helpGroup.text.3"],
                    ["en", "Mark the box that best matches the means of transportation you most frequently use."],
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
                ["id", "intake.Q7.rg.9JtQ.text.0"],
                ["en", 'Please select the transportation means you use the most.'],
            ])),
    }, rg?.key);
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q7.rg.scg.option.0"],
                ["en", "Walking"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q7.rg.scg.option.1"],
                ["en", "Bike"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q7.rg.scg.option.2"],
                ["en", "Motorbike/scooter"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q7.rg.scg.option.3"],
                ["en", "Car"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q7.rg.scg.option.4"],
                ["en", "Public transportation (bus, train, tube, etc)"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q7.rg.scg.option.5"],
                ["en", "Other"],
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
 * COMMON COLD: how often do you have common cold or flu (single choice)
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const common_cold_frequency = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q8'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q8.title.0"],
            ["en", "How often do you have common colds or flu-like diseases?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q8.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q8.helpGroup.text.1"],
                    ["en", "We want to know if some people have an increased risk of infection."],
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
                ["id", "intake.Q8.rg.scg.option.0"],
                ["en", "Never"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q8.rg.scg.option.1"],
                ["en", "Once or twice a year"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q8.rg.scg.option.2"],
                ["en", "Between 3 and 5 times a year"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q8.rg.scg.option.3"],
                ["en", "Between 6 and 10 times a year"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q8.rg.scg.option.4"],
                ["en", "More than 10 times a year"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q8.rg.scg.option.5"],
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

/**
 * REGULAR MEDICATION: multiple choice about medication
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const regular_medication = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q11'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q11.title.0"],
            ["en", "Do you take regular medication for any of the following medical conditions?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q11.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q11.helpGroup.text.1"],
                    ["en", "This question allows us to find out whether you have other medical conditions that may increase your risk of having more severe illness if you are infected."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q11.helpGroup.text.2"],
                    ["en", "How should I answer it?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q11.helpGroup.text.3"],
                    ["en", 'Only answer "yes" if you take regular medication for your medical problem. If, for instance, you only occasionally take an asthma inhaler, then do not answer "yes" for asthma.'],
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
                ["id", "intake.Q11.rg.hYo0.text.0"],
                ["en", 'Select all options that apply'],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q11.rg.mcg.option.0"],
                ["en", "No"],
            ])
        },
        {
            key: '1', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q11.rg.mcg.option.1"],
                ["en", "Asthma"],
            ])
        }, {
            key: '2', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q11.rg.mcg.option.2"],
                ["en", "Diabetes"],
            ])
        },
        {
            key: '3', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q11.rg.mcg.option.3"],
                ["en", "Chronic lung disorder besides asthma e.g. COPD, emphysema, or other disorders that affect your breathing"],
            ])
        },
        {
            key: '4', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q11.rg.mcg.option.4"],
                ["en", "Heart disorder"],
            ])
        },
        {
            key: '5', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q11.rg.mcg.option.5"],
                ["en", "Kidney disorder"],
            ])
        },
        {
            key: '6', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q11.rg.mcg.option.6"],
                ["en", "An immunocompromising condition (e.g. splenectomy, organ transplant, acquired immune deficiency, cancer treatment)"],
            ])
        },
        {
            key: '7', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q11.rg.mcg.option.7"],
                ["en", "I would rather not answer"],
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
 * PREGNANCY: single choice question about pregrancy
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyQGender reference to the survey item about gender
 * @param keyQBirthday reference to the survey item about birthday
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const pregnancy = (parentKey: string, keyQGender: string, keyQBirthday: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q12'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q12.title.0"],
            ["en", "Are you currently pregnant?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('and',
            expWithArgs('responseHasKeysAny', keyQGender, [responseGroupKey, singleChoiceKey].join('.'), '1'), // female
            expWithArgs('gte',
                expWithArgs('dateResponseDiffFromNow', keyQBirthday, [responseGroupKey, '1'].join('.'), 'years', 1),
                14
            ),
            expWithArgs('lte',
                expWithArgs('dateResponseDiffFromNow', keyQBirthday, [responseGroupKey, '1'].join('.'), 'years', 1),
                50
            ),
        )
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q12.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q12.helpGroup.text.1"],
                    ["en", "Pregnancy is a potential risk factor for severe symptoms in the event of infection."],
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
                ["id", "intake.Q12.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        }, {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q12.rg.scg.option.1"],
                ["en", "No"],
            ])
        }, {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q12.rg.scg.option.2"],
                ["en", "Don't know/would rather not answer"],
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
 * TRIMESTER: single choice question about pregrancy
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyQPregnancy reference to the survey item about pregnancy
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const pregnancy_trimester = (parentKey: string, keyQGender: string, keyQBirthday: string, keyQPregnancy: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q12b'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q12b.title.0"],
            ["en", "Which trimester of the pregnancy are you in?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('and',
            expWithArgs('responseHasKeysAny', keyQGender, [responseGroupKey, singleChoiceKey].join('.'), '1'), // female
            expWithArgs('gte',
                expWithArgs('dateResponseDiffFromNow', keyQBirthday, [responseGroupKey, '1'].join('.'), 'years', 1),
                14
            ),
            expWithArgs('lte',
                expWithArgs('dateResponseDiffFromNow', keyQBirthday, [responseGroupKey, '1'].join('.'), 'years', 1),
                50
            ),
            expWithArgs('responseHasKeysAny', keyQPregnancy, [responseGroupKey, singleChoiceKey].join('.'), '0')
        )
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q12b.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q12b.helpGroup.text.1"],
                    ["en", "The risk of severe symptoms can vary depending on the pregnancy trimester, but this link has not yet been clearly established."],
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
                ["id", "intake.Q12b.rg.scg.option.0"],
                ["en", "First trimester (week 1-12)"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q12b.rg.scg.option.1"],
                ["en", "Second trimester (week 13-28)"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q12b.rg.scg.option.2"],
                ["en", "Third trimester (week 29-delivery)"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q12b.rg.scg.option.3"],
                ["en", "Don't know/would rather not answer"],
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
 * SMOKING: single choice question about smoking
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const smoking = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q13'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q13.title.0"],
            ["en", "Do you smoke tobacco?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q13.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q13.helpGroup.text.1"],
                    ["en", "Smoking might make you more likely to get a more severe dose of virus disease. We would like to test this."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q13.helpGroup.text.2"],
                    ["en", "How should I answer it?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q13.helpGroup.text.3"],
                    ["en", "Please, answer as accurately as possible."],
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
                ["id", "intake.Q13.rg.scg.option.0"],
                ["en", "No"],
            ])
        }, {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q13.rg.scg.option.1"],
                ["en", "Yes, occasionally"],
            ])
        }, {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q13.rg.scg.option.2"],
                ["en", "Yes, daily, fewer than 10 times a day"],
            ])
        }, {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q13.rg.scg.option.3"],
                ["en", "Yes, daily, 10 or more times a day"],
            ])
        }, {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q13.rg.scg.option.5"],
                ["en", "Dont know/would rather not answer"],
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
 * Allergies: multiple choice question about allergies
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const allergies = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q14'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q14.title.0"],
            ["en", "Do you have one of the following allergies that can cause respiratory symptoms?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q14.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q14.helpGroup.text.1"],
                    ["en", "Certain allergies provoke the same symptoms as respiratory infections."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q14.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q14.helpGroup.text.3"],
                    ["en", "Multiple answers are possible, mark all that apply."],
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
                ["id", "intake.Q14.rg.7tXM.text.0"],
                ["en", 'Select all options that apply'],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '1', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '5'),
            content: new LanguageMap([
                ["id", "intake.Q14.rg.mcg.option.0"],
                ["en", "Hay fever"],
            ])
        },
        {
            key: '2', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '5'),
            content: new LanguageMap([
                ["id", "intake.Q14.rg.mcg.option.1"],
                ["en", "Allergy against house dust mite"],
            ])
        },
        {
            key: '3', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '5'),
            content: new LanguageMap([
                ["id", "intake.Q14.rg.mcg.option.2"],
                ["en", "Allergy against domestic animals or pets"],
            ])
        },
        {
            key: '4', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '5'),
            content: new LanguageMap([
                ["id", "intake.Q14.rg.mcg.option.3"],
                ["en", "Other allergies that cause respiratory symptoms (e.g. sneezing, runny eyes)"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q14.rg.mcg.option.4"],
                ["en", "I do not have an allergy that causes respiratory symptoms"],
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
 * SPACIAL DIET: multiple choice question about special diet
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const special_diet = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q15'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q15.title.0"],
            ["en", "Do you follow a special diet?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    // none

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-2' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "intake.Q15.rg.mVmB.text.0"],
                ["en", 'Select all options that apply'],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q15.rg.mcg.option.0"],
                ["en", "No special diet"],
            ])
        }, {
            key: '1', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q15.rg.mcg.option.1"],
                ["en", "Vegetarian"],
            ])
        }, {
            key: '2', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q15.rg.mcg.option.2"],
                ["en", "Veganism"],
            ])
        }, {
            key: '3', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q15.rg.mcg.option.3"],
                ["en", "Low-calorie"],
            ])
        }, {
            key: '4', role: 'option',
            disabled: expWithArgs('responseHasKeysAny', editor.getItem().key, responseGroupKey + '.' + multipleChoiceKey, '0'),
            content: new LanguageMap([
                ["id", "intake.Q15.rg.mcg.option.4"],
                ["en", "Other"],
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
 * HOEMOPATHIC MEDICINE: single choice question about homeopathy
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const homeophatic_medicine = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q26'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q26.title.0"],
            ["en", "Are you taking or do you plan to take this winter homeopathic medicine in order to prevent COVID-19?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q26.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q26.helpGroup.text.1"],
                    ["en", "We are interested in knowing more about your health-related habits"],
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
                ["id", "intake.Q26.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q26.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q26.rg.scg.option.2"],
                ["en", "I don't know"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q26.rg.scg.option.3"],
                ["en", "I don't want to answer"],
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
 * Find out about Platform: multiple choice question about where the participant found out about the platform
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const find_out_about_platform = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q17'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.Q17.title.0"],
            ["en", "Where did you first hear about the platform?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "intake.Q17.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "intake.Q17.helpGroup.text.1"],
                    ["en", "We would like to know how you found out about our website infectieradar.be."],
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
                ["id", "intake.Q17.rg.hIai.text.0"],
                ["en", 'Select all options that apply'],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q17.rg.mcg.option.0"],
                ["en", "Radio or television"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q17.rg.mcg.option.1"],
                ["en", "In the newspaper or in a magazine"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q17.rg.mcg.option.2"],
                ["en", "The internet (a website, link, a search engine)"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q17.rg.mcg.option.3"],
                ["en", "By poster"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q17.rg.mcg.option.4"],
                ["en", "Via family or friends"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q17.rg.mcg.option.5"],
                ["en", "Via school or work"],
            ])
        },
        {
            key: '99', role: 'option',
            content: new LanguageMap([
                ["id", "intake.Q17.rg.mcg.option.6"],
                ["en", "Other"],
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

const surveyEnd = (parentKey: string): SurveyItem => {
    const defaultKey = 'surveyEnd'
    const itemKey = [parentKey, defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, type: 'surveyEnd', isGroup: false });

    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "intake.surveyEnd.title.0"],
            ["en", "Thank you! This was all for now, please submit (push « send ») your responses. Please come back or continue reporting symptoms you experience during the last week."],
        ]))
    );

    // CONDITION
    // None

    return editor.getItem();
}

export const IntakeQuestions = {
    gender: gender,
    dateOfBirth: date_of_birth,
    postalCode: postal_code,
    mainActivity: main_activity,
    postalCodeWork: postal_code_work,
    workType: work_type_eurostat,
    highestEducation: highest_education,
    peopleMet: people_met,
    ageGroups: age_groups,
    peopleAtRisk: people_at_risk,
    childrenInSchool: children_in_school,
    meansOfTransport: means_of_transport,
    commonColdFrequency: common_cold_frequency,
    regularMedication: regular_medication,
    pregnancy: pregnancy,
    pregnancyTrimester: pregnancy_trimester,
    smoking: smoking,
    allergies: allergies,
    specialDiet: special_diet,
    homeopathicMeds: homeophatic_medicine,
    findPlatform: find_out_about_platform,
    surveyEnd,
};
