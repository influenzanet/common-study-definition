import { LanguageMap } from "../languages"
import { SurveyItem } from "survey-engine/lib/data_types";
import { Group } from "case-editor-tools/surveys/types";
import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { initMultipleChoiceGroup, initSingleChoiceGroup } from "case-editor-tools/surveys/survey-items";
import { expWithArgs, generateHelpGroupComponent, generateLocStrings, generateTitleComponent } from "case-editor-tools/surveys/utils/simple-generators";
import { multipleChoiceKey, responseGroupKey, singleChoiceKey } from "case-editor-tools/constants/key-definitions";

/**
 * VAC Start: Question about previous vaccination questionnaire.
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const vacStart = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q0'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.Q0.title.0"],
            ["en", "Four weeks ago you received a questionnaire about your vaccination status.  This new questionnaire is to monitor any further changes. Select the option that applies to you."],
        ]))
    );

    // CONDITION
    const hadCompletedVaccSurvey = expWithArgs('eq', expWithArgs('getAttribute', expWithArgs('getAttribute', expWithArgs('getContext'), 'participantFlags'), 'completedVaccSurvey'), "1");
    editor.setCondition(hadCompletedVaccSurvey);

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.Q0.rg.scg.option.1"],
                ["en", "In the meantime nothing has changed in terms of vaccination for me."],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.Q0.rg.scg.option.0"],
                ["en", "In the meantime I received a new vaccine dose, or a new invitation to be vaccinated. (**)"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.Q0.rg.scg.option.2"],
                ["en", "I'm not sure, and would like to take these questions to make sure my information on vaccination is up to date. (**)"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mt-2' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "vaccination.Q0.privacy.note"],
                ["en", "(**) By selecting one of these options you give your consent to use your historical data to prefill this survey's responses."],
            ])),
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
 * GROUP DEPENDING VACCINATION SURVEY ROUND
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyVacStart reference to the vac survey
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const hasVacGroup = (parentKey: string, keyVacStart: string, keyOverride?: string): Group => {

    class HasVacGroup extends Group {
        constructor(parentKey: string, defaultKey: string) {
            super(parentKey, defaultKey);
            this.groupEditor.setCondition(
                expWithArgs('or',
                    expWithArgs('responseHasOnlyKeysOtherThan', keyVacStart, [responseGroupKey, singleChoiceKey].join('.'), '2'),
                    expWithArgs('not', expWithArgs('eq', expWithArgs('getAttribute', expWithArgs('getAttribute', expWithArgs('getContext'), 'participantFlags'), 'completedVaccSurvey'), "1")),
                )
            );
        }

        buildGroup() { }
    }

    return new HasVacGroup(parentKey, 'HV');
}

/**
 * FLU VACCINE LAST SEASON: single choice about last season's vaccine
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const flu_vaccine_last_season = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q9'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q9.title.0"],
            ["en", "Did you receive a flu vaccine during the previous flu season (2020-2021)?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q9.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },

            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q9.helpGroup.text.1"],
                    ["en", "We would like to study what level of protection the vaccine provides. We would also like to know if there is any protection from vaccines received in previous years."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q9.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q9.helpGroup.text.3"],
                    ["en", "Answer 'yes' if you were vaccinated in autumn/winter 2020-2021."],
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
                ["id", "vaccination.HV.Q9.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q9.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q9.rg.scg.option.2"],
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
 * FLU VACCINE THIS SEASON: single choice about this season's vaccine
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const flu_vaccine_this_season = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q10'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q10.title.0"],
            ["en", "Have you received a flu vaccine this autumn/winter season? (2021-2022)"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10.helpGroup.text.1"],
                    ["en", "We would like to be able to work out how much protection the vaccine gives."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10.helpGroup.text.2"],
                    ["en", "How should I answer it?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10.helpGroup.text.3"],
                    ["en", "Report yes, if you received the vaccine this season, usually in the autumn. If you get vaccinated after filling in this questionnaire, please return to this and update your answer."],
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
                ["id", "vaccination.HV.Q10.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10.rg.scg.option.2"],
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
 * WHEN RECEIVED FLU VACCINE THIS SEASON: single choice about this season's vaccine
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyFluVaccineThisSeason full key of the question about if you received flu vaccine this year, if set, dependency is applied
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const flu_vaccine_this_season_when = (parentKey: string, keyFluVaccineThisSeason?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q10b'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q10b.title.0"],
            ["en", "When were you vaccinated against flu this season (2021-2022)?"],
        ]))
    );

    // CONDITION
    if (keyFluVaccineThisSeason) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keyFluVaccineThisSeason, [responseGroupKey, singleChoiceKey].join('.'), '0')
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10b.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10b.helpGroup.text.1"],
                    ["en", "Knowing when people get vaccinated tells us how the vaccination program is being followed, as well as the effectiveness of the vaccine."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10b.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10b.helpGroup.text.3"],
                    ["en", "Try to answer as precisely as possible. If you do not know the exact date, provide as close an estimate as possible. For example, if you remember the month, try to recall if it was in the beginning or end of the month. Did any important events take place (such as holidays or birthdays) that may help you to refresh your memory?"],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'dateInput',
            optionProps: {
                min: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', -21427200) },
                max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 0) }
            },
            description: new LanguageMap([
                ["id", "vaccination.HV.Q10b.rg.scg.description.dateInput.0"],
                ["en", "Choose date"],
            ]),
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10b.rg.scg.option.1"],
                ["en", "I don't know (anymore)"],
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
 *  REASONS FOR FLU VACCINE THIS SEASON: multiple choice
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyFluVaccineThisSeason full key of the question about if you received flu vaccine this year, if set, dependency is applied
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const flu_vaccine_this_season_reason_for = (parentKey: string, keyFluVaccineThisSeason?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q10c'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q10c.title.0"],
            ["en", "What were your reasons for getting a seasonal influenza vaccination this year?"],
        ]))
    );

    // CONDITION
    if (keyFluVaccineThisSeason) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keyFluVaccineThisSeason, [responseGroupKey, singleChoiceKey].join('.'), '0')
        );
    }

    // INFO POPUP
    // none

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-2' }],
        content: generateLocStrings(
            new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.LlBq.text.0"],
                ["en", "Select the options that are most applicable"],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.option.0"],
                ["en", "I belong to a risk group (e.g, pregnant, over 65, underlying health condition, etc)"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.option.1"],
                ["en", "Vaccination decreases my risk of getting influenza"],
            ])
        }, {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.option.2"],
                ["en", "Vaccination decreases the risk of spreading influenza to others"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.option.3"],
                ["en", "My doctor recommended it"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.option.4"],
                ["en", "It was recommended in my workplace/school"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.option.5"],
                ["en", "The vaccine was readily available and vaccine administration was convenient"],
            ])
        },
        {
            key: '6', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.option.6"],
                ["en", "The vaccine was free (no cost)"],
            ])
        },
        {
            key: '7', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.option.7"],
                ["en", "I don't want to miss work/school"],
            ])
        }, {
            key: '8', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.option.8"],
                ["en", "I always get the vaccine"],
            ])
        }, {
            key: '12', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.option.9"],
                ["en", "I try to protect myself against infections, because of the circulation of the pandemic coronavirus"],
            ])
        }, {
            key: '9', role: 'input',
            style: [{ key: 'className', value: 'w-100' }],
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.input.10"],
                ["en", "Other reason(s)"],
            ]),
            description: new LanguageMap([
                ["id", "vaccination.HV.Q10c.rg.mcg.description.input.10"],
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
 *  REASONS AGAINST FLU VACCINE THIS SEASON: multiple choice
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyFluVaccineThisSeason full key of the question about if you received flu vaccine this year, if set, dependency is applied
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const flu_vaccine_this_season_reason_against = (parentKey: string, keyFluVaccineThisSeason?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q10d'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q10d.title.0"],
            ["en", "What were your reasons for NOT getting a seasonal influenza vaccination in seaseon 2020/2021?"],
        ]))
    );

    // CONDITION
    if (keyFluVaccineThisSeason) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keyFluVaccineThisSeason, [responseGroupKey, singleChoiceKey].join('.'), '1')
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10d.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10d.helpGroup.text.1"],
                    ["en", "We would like to know why some people get vaccinated and others do not."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10d.helpGroup.text.2"],
                    ["en", "How should I answer it?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q10d.helpGroup.text.3"],
                    ["en", "Tick all those reasons that were important in your decision."],
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
                ["id", "vaccination.HV.Q10d.rg.t2y2.text.0"],
                ["en", "Select the options that are most applicable"],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.0"],
                ["en", "I am planning to be vaccinated, but haven't been yet"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.1"],
                ["en", "I haven't been offered the vaccine"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.2"],
                ["en", "I don't belong to a risk group"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.3"],
                ["en", "It is better to build your own natural immunity against influenza"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.4"],
                ["en", "I doubt that the influenza vaccine is effective"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.5"],
                ["en", "Influenza is a minor illness"],
            ])
        },
        {
            key: '6', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.6"],
                ["en", "I don't think I am likely to get influenza"],
            ])
        },
        {
            key: '7', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.7"],
                ["en", "I believe that influenza vaccine can cause influenza"],
            ])
        }, {
            key: '8', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.8"],
                ["en", "I am worried that the vaccine is not safe or will cause illness or other adverse events"],
            ])
        }, {
            key: '9', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.9"],
                ["en", "I don't like having vaccinations"],
            ])
        }, {
            key: '10', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.10"],
                ["en", "The vaccine is not readily available to me"],
            ])
        }, {
            key: '11', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.11"],
                ["en", "The vaccine is not free of charge"],
            ])
        }, {
            key: '12', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.12"],
                ["en", "No particular reason"],
            ])
        }, {
            key: '13', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.option.13"],
                ["en", "Although my doctor recommend a vaccine, I do not get one"],
            ])
        }, {
            key: '14', role: 'input',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.input.14"],
                ["en", "Other reason(s)"],
            ]),
            description: new LanguageMap([
                ["id", "vaccination.HV.Q10d.rg.mcg.description.input.14"],
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
 * VAC: single choice question about vaccination status
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const vac = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q35'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q35.title.0"],
            ["en", "Have you received a COVID-19 vaccine?"],
        ]))
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35.helpGroup.text.1"],
                    ["en", "We would like to be able to work out how much protection the vaccine gives."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35.helpGroup.text.3"],
                    ["en", "Report yes, if you received a COVID-19 vaccine (since December 2020)."],
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
                ["id", "vaccination.HV.Q35.rg.scg.option.0"],
                ["en", "Yes, I received at least one COVID-19 vaccine"],
            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35.rg.scg.option.1"],
                ["en", "No, I did not receive the COVID-19 vaccine"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35.rg.scg.option.2"],
                ["en", "I don't know/can't remember."],
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
 * VACCINE BRAND: Which vaccine was provided
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const vaccineBrand = (parentKey: string, keyvac?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q35i'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q35i.title.0"],
            ["en", "Which COVID-19 vaccine(s) did you receive?"],
        ]))
    );

    // CONDITION
    if (keyvac) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keyvac, [responseGroupKey, singleChoiceKey].join('.'), '1')
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35i.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35i.helpGroup.text.1"],
                    ["en", "We want to know how many people got vaccinated with what brand"],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35i.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35i.helpGroup.text.3"],
                    ["en", "Specify which brand (or brands if you hade more than one type) you got vaccinated with"],
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
                ["id", "vaccination.HV.Q35i.rg.LMsj.text.0"],
                ["en", "Select more than one option if you received different brands"],
            ])),
    }, rg?.key);


    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35i.rg.mcg.option.0"],
                ["en", "Pfizer/BioNTech"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35i.rg.mcg.option.1"],
                ["en", "Moderna"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35i.rg.mcg.option.2"],
                ["en", "AstraZeneca"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35i.rg.mcg.option.3"],
                ["en", "Janssen Pharmaceutica (Johnson & Johnson)"],
            ])
        },
        {
            key: '99', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35i.rg.mcg.option.5"],
                ["en", "I Don't know/Can't remember"],
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
 * VACCINE SHOTS: How many times has the participant been vaccinated
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const vaccineShots = (parentKey: string, keyvac?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q35c'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q35c.title.0"],
            ["en", "How many doses of the vaccine did you receive?"],
        ]))
    );

    // CONDITION
    if (keyvac) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keyvac, [responseGroupKey, singleChoiceKey].join('.'), '1')
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35c.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35c.helpGroup.text.1"],
                    ["en", "We would like to be able to work out how much protection a complete vaccination scheme gives."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35c.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35c.helpGroup.text.3"],
                    ["en", "Report the number of doses you received (which corresponds to the number of time you were vaccinated against COVID-19 )."],
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
                ["id", "vaccination.HV.Q35c.rg.scg.option.0"],
                ["en", "One"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35c.rg.scg.option.1"],
                ["en", "Two"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35c.rg.scg.option.2"],
                ["en", "Three"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35c.rg.scg.option.3"],
                ["en", "More than three"],
            ])
        },
        {
            key: '99', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35c.rg.scg.option.4"],
                ["en", "I Don't know/Can't remember"],
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
 * DATE LAST VACCINE: What is the date of the last vaccination
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const dateLastVaccine = (parentKey: string, keyVac?: string, keyVaccineShots?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q35j'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q35j.title.0"],
            ["en", "When did you receive your last injection of a vaccine against COVID-19? If you do not know the exact date, provide an estimate."],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keyVac, [responseGroupKey, singleChoiceKey].join('.'), '1')
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35j.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35j.helpGroup.text.1"],
                    ["en", "Knowing when people are vaccinated tells us how well the vaccination program is being carried out."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35j.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35j.helpGroup.text.3"],
                    ["en", "Please try and answer as accurately as possible. If you do not know the precise date, please give your best estimate of the month and year of vaccination."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '1', role: 'dateInput',
            optionProps: {
                max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 10) },
            },
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35j.rg.scg.dateInput.0"],
                ["en", "Choose date"],
            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35j.rg.scg.option.1"],
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
 * SECOND SHOT: single choice question about second shot planned
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const secondShotPlan = (parentKey: string, keyVac?: string, keyVaccineShots?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q35k'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q35k.title.0"],
            ["en", "Do you plan to receive a second injection in the upcoming weeks?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('and',
            expWithArgs('responseHasKeysAny', keyVac, [responseGroupKey, singleChoiceKey].join('.'), '1'),
            expWithArgs('responseHasKeysAny', keyVaccineShots, [responseGroupKey, singleChoiceKey].join('.'), '1')
        )
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35k.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35k.helpGroup.text.1"],
                    ["en", "We want to study how long it takes for people to get the second dose after having received the first"],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35k.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35k.helpGroup.text.3"],
                    ["en", "Select the option that is most appropriate for your situation"],
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
                ["id", "vaccination.HV.Q35k.rg.scg.option.0"],
                ["en", "Yes"],
            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35k.rg.scg.option.1"],
                ["en", "No"],
            ])
        },
        {
            key: '99', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35k.rg.scg.option.2"],
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
 * SECOND SHOT CONTRA: reasons why no second dose
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const secondShotContra = (parentKey: string, keyVac?: string, keySecondShotPlan?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q35l'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q35l.title.0"],
            ["en", "Why receiving a single injection?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('and',
            expWithArgs('responseHasKeysAny', keyVac, [responseGroupKey, singleChoiceKey].join('.'), '1'),
            expWithArgs('responseHasKeysAny', keySecondShotPlan, [responseGroupKey, singleChoiceKey].join('.'), '0', '99')
        )
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35l.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35l.helpGroup.text.1"],
                    ["en", "We would like to know the reasons behind the selected option of receiving just one dose"],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35l.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35l.helpGroup.text.3"],
                    ["en", "Select the option that is most appropriate for your situation"],
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
                ["id", "vaccination.HV.Q35l.rg.scg.option.0"],
                ["en", "I had COVID-19 before my first injection."],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35l.rg.scg.option.1"],
                ["en", "I had COVID-19 shortly after my first injection, and have to wait several months to receive the second injection."],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35l.rg.scg.option.2"],
                ["en", " I received Janssen vaccine, which requires only one injection."],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35l.rg.scg.option.3"],
                ["en", "A second injection was contraindicated for me by a doctor (I had a severe allergic reaction, or a severe adverse effect after the first injection, or I have a temporary contraindication due to a treatment or a disease)."],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35l.rg.scg.option.4"],
                ["en", "I changed my mind and don’t want to be vaccinated anymore."],
            ])
        },
        {
            key: '6', role: 'input',
            style: [{ key: 'className', value: 'w-100' }],
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35l.rg.scg.input.5"],
                ["en", "Other"],
            ]),
            description: new LanguageMap([
                ["id", "vaccination.HV.Q35l.rg.scg.description.input.5"],
                ["en", "Describe here (optional)"],
            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35l.rg.scg.option.6"],
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
 * VACCINE PRO: reasons why pro vaccination
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const vaccinePro = (parentKey: string, keyvac?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q35f'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q35f.title.0"],
            ["en", "What are your reason(s) for getting a COVID-19 vaccination?"],
        ]))
    );

    // CONDITION
    if (keyvac) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keyvac, [responseGroupKey, singleChoiceKey].join('.'), '1', '01', '03')
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35f.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35f.helpGroup.text.1"],
                    ["en", "We would like to know the main reasons why people get the vaccine."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35f.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35f.helpGroup.text.3"],
                    ["en", "Please select the options that mattered to take your decision."],
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
                ["id", "vaccination.HV.Q35f.rg.T5UL.text.0"],
                ["en", "Select the options that are most applicable"],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '21', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.0"],
                ["en", "The vaccination is recommended by public health authorities."],
            ])
        },
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.1"],
                ["en", "I belong to a group who is at risk of complications in case of COVID-19 (over 65 of age, underlying health condition, obesity, etc.)."],
            ])
        },
        {
            key: '20', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.2"],
                ["en", "I work in close contact with people at risk of complications in case of COVID-19 (working in a nursing home, health staff…)."],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.3"],
                ["en", "Vaccination decreases my risk of getting COVID-19."],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.4"],
                ["en", "Vaccination decreases the risk of spreading COVID-19 to others."],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.5"],
                ["en", "My doctor recommended it."],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.6"],
                ["en", "It was recommended in my workplace/school."],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.7"],
                ["en", "The vaccine was readily available and vaccine administration was convenient."],
            ])
        },
        {
            key: '6', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.8"],
                ["en", "The vaccine was free (no cost)."],
            ])
        },
        {
            key: '7', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.9"],
                ["en", "I don’t want to miss work/school."],
            ])
        },
        {
            key: '8', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.10"],
                ["en", "I always accept vaccination when it is offered to me."],
            ])
        },
        {
            key: '22', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.11"],
                ["en", "I have to be vaccinated to work."],
            ])
        },
        {
            key: '23', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.option.12"],
                ["en", "To obtain a valid vaccination passport."],
            ])
        },
        {
            key: '9', role: 'input',
            style: [{ key: 'className', value: 'w-100' }],
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.input.13"],
                ["en", "Other"],
            ]),
            description: new LanguageMap([
                ["id", "vaccination.HV.Q35f.rg.mcg.description.input.13"],
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

    const hasLessThanFourSelections = expWithArgs(
        'lt', expWithArgs('countResponseItems', itemKey, [responseGroupKey, multipleChoiceKey].join('.')), 4
    );
    const hasMoreThanThree = expWithArgs(
        'gt', expWithArgs('countResponseItems', itemKey, [responseGroupKey, multipleChoiceKey].join('.')), 3
    );

    return editor.getItem();
}

/**
 * VACCINE CONTRA: reasons why no vaccination
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const vaccineContra = (parentKey: string, keyvac?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q35m'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new LanguageMap([
            ["id", "vaccination.HV.Q35m.title.0"],
            ["en", "What were your reasons for NOT getting a COVID-19 vaccination? Select the options that are most applicable."],
        ]))
    );

    // CONDITION
    if (keyvac) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keyvac, [responseGroupKey, singleChoiceKey].join('.'), '0')
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35m.helpGroup.text.0"],
                    ["en", "Why are we asking this?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35m.helpGroup.text.1"],
                    ["en", "We would like to know the main reasons why people are declining COVID-19 vaccination."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35m.helpGroup.text.2"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new LanguageMap([
                    ["id", "vaccination.HV.Q35m.helpGroup.text.3"],
                    ["en", "Please select the options that mattered to take your decision."],
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
                ["id", "vaccination.HV.Q35m.rg.nm76.text.0"],
                ["en", "Select the options that are most applicable"],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.0"],
                ["en", "I am planning to be vaccinated but haven’t been yet"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.1"],
                ["en", "I haven't been offered the vaccine"],
            ])
        },
        {
            key: '15', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.2"],
                ["en", "I have been discouraged from being vaccinated because I am pregnant"],
            ])
        },
        {
            key: '16', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.3"],
                ["en", "I am pregnant and I fear the vaccine could be dangerous for my baby"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.4"],
                ["en", "I don’t belong to a risk group"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.5"],
                ["en", "It is better to build your own natural immunity against COVID-19"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.6"],
                ["en", "I doubt that the COVID-19 vaccine is effective"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.7"],
                ["en", "COVID-19 is a minor illness"],
            ])
        },
        {
            key: '17', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.8"],
                ["en", "Because of COVID-19 pandemic, I avoid seeing doctors or going to the pharmacy"],
            ])
        },
        {
            key: '6', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.9"],
                ["en", "I don't think I am likely to get the COVID-19"],
            ])
        },
        {
            key: '7', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.10"],
                ["en", "I believe that the COVID-19 vaccine can cause COVID-19"],
            ])
        },
        {
            key: '8', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.11"],
                ["en", "I am worried that the vaccine is not safe or will cause illness or other adverse events"],
            ])
        },
        {
            key: '9', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.12"],
                ["en", "I don't like having vaccinations"],
            ])
        },
        {
            key: '10', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.13"],
                ["en", "The vaccine is not readily available to me"],
            ])
        },
        {
            key: '20', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.14"],
                ["en", "I disagree with the current vaccine policy"],
            ])
        },
        {
            key: '11', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.15"],
                ["en", "The vaccine is not free of charge"],
            ])
        },
        {
            key: '12', role: 'option',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.option.16"],
                ["en", "I don't know"],
            ])
        },
        {
            key: '14', role: 'input',
            content: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.input.17"],
                ["en", "Other reason(s)"],
            ]),
            description: new LanguageMap([
                ["id", "vaccination.HV.Q35m.rg.mcg.description.input.17"],
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

    const hasLessThanFourSelections = expWithArgs(
        'lt', expWithArgs('countResponseItems', itemKey, [responseGroupKey, multipleChoiceKey].join('.')), 4
    );
    const hasMoreThanThree = expWithArgs(
        'gt', expWithArgs('countResponseItems', itemKey, [responseGroupKey, multipleChoiceKey].join('.')), 3
    );

    return editor.getItem();
}

export const VaccinationQuestions = {
    vacStart,
    hasVacGroup,
    fluVaccineLastSeason: flu_vaccine_last_season,
    fluVaccineThisSeason: flu_vaccine_this_season,
    fluVaccineThisSeasonWhen: flu_vaccine_this_season_when,
    fluVaccineThisSeasonReasonFor: flu_vaccine_this_season_reason_for,
    fluVaccineThisSeasonReasonAgainst: flu_vaccine_this_season_reason_against,
    vac,
    vaccineBrand,
    secondShotPlan,
    secondShotContra,
    vaccineShots,
    dateLastVaccine,
    vaccinePro,
    vaccineContra
};
