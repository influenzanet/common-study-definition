import { LanguageMap } from "../languages"
import { SurveyItem } from "survey-engine/lib/data_types";
import { Group } from "case-editor-tools/surveys/types";
import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { initDropdownGroup, initLikertScaleItem, initMatrixQuestion, initMultipleChoiceGroup, initSingleChoiceGroup, ResponseRowCell } from "case-editor-tools/surveys/survey-items";
import { expWithArgs, generateHelpGroupComponent, generateLocStrings, generateTitleComponent } from "case-editor-tools/surveys/utils/simple-generators";
import { likertScaleKey, matrixKey, multipleChoiceKey, responseGroupKey, singleChoiceKey } from "case-editor-tools/constants/key-definitions";
import { MultipleChoicePrefix, text_how_answer, text_why_asking } from "./helpers";
import { Item, NumericInputProps } from "case-editor-tools/surveys/types";
import { SurveyItems } from 'case-editor-tools/surveys';
import { ComponentGenerators } from "case-editor-tools/surveys/utils/componentGenerators";

/**
 * PCR TESTED CONTACTS COVID-19: single choice question about contact with PCR tested Covid19 patients
 *
 * @param parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
 export class PcrTestedContact extends Item {

    constructor(parentKey: string, isRequired?: boolean, keyOverride?:string) {
        super(parentKey, keyOverride ? keyOverride: 'Qcov3');
        this.isRequired = isRequired;
    }
    
    buildItem() {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            //condition: this.getCondition(),
            questionText: new LanguageMap([
                ["id", "weekly.HS.Qcov3.title.0"],
                ["en", "In the 14 days before your symptoms started, have you been in close contact with someone for whom an antigenic or PCR test has confirmed that they have COVID-19?"],
            ]),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses() {
        return [
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
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.HS.Qcov3.helpGroup.text.0"),
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Qcov3.helpGroup.text.1"],
                    ["en", "In  order to study how the coronavirus spreads within the general population."],
                ]),
            },
        ];
    }
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
            text_why_asking("weekly.HS.Qcov3b.helpGroup.text.0"),
            {
                content: new LanguageMap([
                    ["id", "weekly.HS.Qcov3b.helpGroup.text.1"],
                    ["en", "The coronavirus and influenza spread quickly indoors."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            text_how_answer("weekly.HS.Qcov3b.helpGroup.text.2"),
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
