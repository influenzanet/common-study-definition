import { LanguageMap, _T } from "../languages"
import { OptionDef } from "case-editor-tools/surveys/types";
import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { initMatrixQuestion,  ResponseRowCell } from "case-editor-tools/surveys/responseTypeGenerators/matrixGroupComponent";
import { initLikertScaleItem } from "case-editor-tools/surveys/responseTypeGenerators/likertGroupComponents";
import { expWithArgs, generateHelpGroupComponent, generateLocStrings, generateTitleComponent } from "case-editor-tools/surveys/utils/simple-generators";
import { likertScaleKey, matrixKey, responseGroupKey } from "case-editor-tools/constants/key-definitions";
import { MultipleChoicePrefix, singleChoicePrefix, text_how_answer, text_select_all_apply, text_why_asking, require_response } from "./helpers";
import { SurveyItems } from 'case-editor-tools/surveys';
import { SymptomKeysType, VisitMedicalServiceTypes, WeeklyResponses as ResponseEncoding } from "../responses/weekly";
import { GroupProps, GroupQuestion, ItemProps, ItemQuestion } from "./types";
import { ClientExpression as client } from "../../../tools/expressions";
import { Expression, SurveyItem } from "survey-engine/data_types";
import { MatrixRow, markdownComponent, textComponent } from "../../../compat";
import { option_def, trans_text } from "../../../tools";


/**
 * Virological Test Performed in case of symptoms
 */
export class HasVirologicalTest extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Qvir16h');
    }

    buildItem():SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.EX.Qvir16h.title", "Because of your symptoms, did you undergo one or several test/analyses to know if you have COVID-19, influenza or RSV?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {
        return [
            {
                key: ResponseEncoding.symptom_test.yes, role: 'option',
                content: _T("weekly.Qvir16h.option.0", "Yes")
            },
            {
                key: ResponseEncoding.symptom_test.not_yet, role: 'option',
                content: _T("weekly.Qvir16h.option.1", "Not yet, I plan to shortly undergo a test")
            },
            {
                key: ResponseEncoding.symptom_test.no_wont, role: 'option',
                content: _T("weekly.Qvir16h.option.2", "No, I have a prescription but will not undergo a test")
            },
            {
                key: ResponseEncoding.symptom_test.no, role: 'option',
                content: _T("weekly.Qvir16h.option.3", "No")
            },
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.Qvir16h.helpGroup.why"),
            {
                content: _T("weekly.Qvir16h.helpGroup.text.1", "We want to know which complaints lead people to get tested for the respiratory viruses."),
            },
        ];
    }

    // Create a condition to test if this question has yes Response
    getYesResponseCondition() : Expression {
        return client.singleChoice.any(this.key, ResponseEncoding.symptom_test.yes);
    }
}

/**
 * Virological Test targets
 */
export class VirologicalTestTarget extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Qvir16v');
    }

    buildItem():SurveyItem {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.Qvir16v.title", "Which viruses were tested for ?"),
            helpGroupContent: this.getHelpGroupContent(),
            topDisplayCompoments: this.getNotes("top", text_select_all_apply("weekly.Qvir16v.select_all")),
            bottomDisplayCompoments: this.getNotes('bottom'),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {

        const responses = ResponseEncoding.viruses_tested;

        const exclusiveDontKnow = client.multipleChoice.any(this.key, responses.dont_know);

        return [
            option_def(responses.covid19,  _T("weekly.Qvir16v.option.covid19", "Covid19 virus"), {disabled: exclusiveDontKnow}),
            option_def(responses.influenza,  _T("weekly.Qvir16v.option.influenza", "Influenza virus"), {disabled: exclusiveDontKnow}),
            option_def(responses.rsv,  _T("weekly.Qvir16v.option.rsv", "RSV virus"), {disabled: exclusiveDontKnow}),
            option_def(responses.other,  _T("weekly.Qvir16v.option.other", "Other"), {disabled: exclusiveDontKnow}),
            option_def(responses.dont_know,  _T("weekly.Qvir16v.option.dont_know", "Dont know")),
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.Qvir16v.helpGroup.text.why"),
            {
                content: _T("weekly.Qvir16v.helpGroup.text", "We are interested in knowing how many people with symptoms have udergone a test"),
            },
        ];
    }
}

const TestTypeResponses = ResponseEncoding.test_type;

/**
 * Virological Test type
 */
export class VirologicalTestType extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Qvir16i');
    }

    buildItem():SurveyItem {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("weekly.Qvir16i.title", "Which analyse(s) was it?"),
            helpGroupContent: this.getHelpGroupContent(),
            topDisplayCompoments: this.getNotes("top", text_select_all_apply("weekly.Qvir16i.select_all_apply")),
            bottomDisplayCompoments: this.getNotes('bottom'),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {

        const responses = ResponseEncoding.test_type;

        return [
            option_def(responses.pcr, _T("weekly.Qvir16i.option.pcr", "A PCR test (virus search, on a swab in nose or mouth, or a sputum or saliva sample)")),
            option_def(responses.antigenic, _T("weekly.Qvir16i.option.antigenic_pro", "A rapid antigen detection test on a sample realized in the back of the nose (nasopharyngeal sampling, done by a health professional or a trained person, with a swab inserted to 15 cm into the nose, result obtained in less than one hour)")),
            option_def(responses.antigenic_nasal, _T("weekly.Qvir16i.option.antigenic_nasal", "A rapid antigen detection test or autotest done on a nasal sample (a swab inserted to 1 - 4 cm into the nostril, sampling that can be done by oneself, result obtained in a few minutes)"))
        ];
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly.Qvir16i.helpGroup.why"),
            {
                content: _T("weekly.Qvir16i.helpGroup.text", "We are interested in knowing how many people with symptoms have udergone a test"),
            },
        ];
    }

    /**
     * @param which name of the response (as provided in ResponseEncoding)
     */
    getResponseCondition(which: keyof typeof TestTypeResponses): Expression {
        const value = TestTypeResponses[which];
        return client.multipleChoice.any(this.key, value);
    }
}

type VirologicalTestResultVariant = 'not_received' | 'dont_know';

/**
 * Test Result for Virological Test - Generic Question
 */
export class VirologicalTestResult extends ItemQuestion {

    questionTitle: string

    variant: VirologicalTestResultVariant
    

    constructor(props: ItemProps, defaultKey: string, questionTitle: string, variant:VirologicalTestResultVariant ) {
        super(props, defaultKey);
        this.variant = variant;
        this.questionTitle = questionTitle;
    }

    buildItem():SurveyItem {

        const titleKey = 'weekly.' + this.itemKey + '.title';

        const severalTestRealized = textComponent({key:"several", "content": _T("common.qvir16.several_test_realized", "If you have realized several test"), className:'mb-2'});
        
        // title =  "Do you know the result of your PCR test? (if several were performed and at least one was positive, chose the “Positive” answer)"
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T(titleKey, this.questionTitle),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses(),
            topDisplayCompoments: this.getNotes('top',  
                    //text_select_all_apply("weekly." + this.itemKey+".select_all_apply"),
                    severalTestRealized
            ),
            bottomDisplayCompoments: this.getNotes('bottom'),
        });
    }

    getResponses():OptionDef[] {
        
        const responses = ResponseEncoding.viruses_result;

        const exclusiveResult = client.multipleChoice.any(this.key, responses.unconclusive, responses.not_received, responses.negative, responses.dont_know);

        const exclusiveNegative = client.multipleChoice.any(this.key,
            responses.covid19, responses.influenza, responses.rsv, 
            responses.dont_know
        );

        const exclusiveLast = client.multipleChoice.any(this.key,
            responses.covid19, responses.influenza, responses.rsv, 
            responses.negative,
        );

        let last_option : OptionDef;

        switch(this.variant) {

            case 'not_received':
                last_option = option_def(
                    responses.not_received, _T("weekly." + this.itemKey + ".option.not_available", "I have not yet received the test results"),
                    {disabled: exclusiveLast}
                );
                break;
            case 'dont_know':
                last_option = option_def(
                    responses.dont_know, _T("weekly." + this.itemKey + ".option.dont_know", "I don't know"),
                    {disabled: exclusiveLast}
                );
                break;
            default:
                throw new Error("Variant not handled " + this.variant);
        }

        return [
            option_def(responses.negative, _T("weekly." + this.itemKey + ".option.negative", "The result is negative"), {'disabled': exclusiveNegative}),
            option_def(responses.covid19, _T("weekly." + this.itemKey + ".option.covid19", "Yes, positive for COVID-19"), {disabled: exclusiveResult}),
            option_def(responses.influenza, _T("weekly." + this.itemKey + ".option.influenza", "Yes, positive for Influenza"), {disabled: exclusiveResult}),
            option_def(responses.rsv, _T("weekly." + this.itemKey + ".option.rsv", "Yes, positive for RSV"), {disabled: exclusiveResult}),
            option_def(responses.unconclusive, _T("weekly." + this.itemKey + ".option.not_interpretable", "The results are inconclusive")),
            last_option
        ];
        
    }

    getHelpGroupContent() {
        return [
            text_why_asking("weekly." + this.itemKey + ".helpGroup.why"),
            {
                content: _T("weekly." + this.itemKey + ".helpGroup.text", "We want to understand how the respiratory viruses are spreading within the population."),
            },
        ];
    }
}

export class VirologicalPCRTestResult extends VirologicalTestResult {

    constructor(props: ItemProps) {
        super(props, 'Qvir16b',  "Do you know the result of your PCR test? (if several were performed and at least one was positive, chose the “Positive” answer)", 'not_received')
    }
    
}

export class VirologicalAntigenicTestResult extends VirologicalTestResult {

    constructor(props: ItemProps) {
        super(props, 
            'Qvir16f',  
            "Do you know the result of this rapid antigen detection test on nasopharyngeal sample? (if several were performed and at least one was positive, chose the “Positive” answer)",
            'dont_know'
        )
    }
    
}

export class VirologicalAntigenicNasalTestResult extends VirologicalTestResult {

    constructor(props: ItemProps) {
        super(props, 
            'Qvir16k',  
            "Do you know the result of this antigenic test or self-test on nasal sample? (if several were performed and at least one was positive, chose the “Positive” answer)",
            'dont_know'
        )
    }

}

/**
 * Build Virological Question set (with condition logic)
 * (Not using a 'group' to keep the key at the same level as other questions)
 */
export class VirologicalQuestionBuilder {

    hasTest: HasVirologicalTest

    parentKey: string

    /**
     * @param parentKey Key of the parent group where question are added
     * @param addQuestion Callback to add question in the group
     */
    constructor(parentKey: string) {
        this.parentKey = parentKey;
        
        // Qvir16h
        this.hasTest = new HasVirologicalTest({parentKey: parentKey, isRequired: true});
    }

    build(addQuestion: (item: SurveyItem)=>void) {

        addQuestion(this.hasTest.get());

        // Qvir16v
        const whichViruses = new VirologicalTestTarget({parentKey: this.parentKey, isRequired: true});
        whichViruses.setCondition(this.hasTest.getYesResponseCondition());
        addQuestion(whichViruses.get());

        // Qvir16i
        const whichTest = new VirologicalTestType({parentKey: this.parentKey, isRequired: true});
        whichTest.setCondition(this.hasTest.getYesResponseCondition());
        addQuestion(whichTest.get());

        // Qvir16b
        const pcrResult = new VirologicalPCRTestResult({parentKey: this.parentKey, isRequired: true});
        pcrResult.setCondition(whichTest.getResponseCondition('pcr'));
        addQuestion(pcrResult.get());

        const antigenicResult = new VirologicalAntigenicTestResult({parentKey: this.parentKey, isRequired: true});
        antigenicResult.setCondition(whichTest.getResponseCondition('antigenic'));
        addQuestion(antigenicResult.get());

        const antigenicNasalResult = new VirologicalAntigenicNasalTestResult({parentKey: this.parentKey, isRequired: true});
        antigenicNasalResult.setCondition(whichTest.getResponseCondition('antigenic_nasal'));
        addQuestion(antigenicNasalResult.get());

    }

    hasTestQuestion(): HasVirologicalTest {
        return this.hasTest;
    }
}