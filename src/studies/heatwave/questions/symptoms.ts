import { _T, LanguageMap } from "../../common/languages"
import { OptionDef } from "case-editor-tools/surveys/types";
import { SurveyItems } from 'case-editor-tools/surveys';
import { ItemQuestion, ClientExpression, ItemProps } from "../../../tools";
import { Expression, SurveyItem } from "survey-engine/data_types";
import { option_def } from "../../../tools/options";

/*
Q9 Have you experienced any symptoms due to high/extreme heat during the summer of 2025 and first part of 2026?
○  	0 No
□  	1 Extreme thirst
□  	2 Dizziness / light headedness
□  	3 Fainting / collapsing
□  	4 Too hot to sleep
□  	5 Feeling confused / couldn’t think properly
□  	6 Muscle twitches / cramping
□  	7 Lack of coordination / difficulty with movement
□  	8 Racing heartbeat
*/

const HeatSymptomsCoding = {
    'no':'0', // No
    'thirst':'1', // Extreme thirst
    'dizziness':'2', // Dizziness / light headedness
    'faiting':'3', // Fainting / collapsing
    'insomnia':'4', // Too hot to sleep
    'confused':'5', // Feeling confused / couldn’t think properly
    'cramping':'6', // Muscle twitches / cramping
    'ataxia':'7', // Lack of coordination / difficulty with movement
    'palpitations':'8', // Racing heartbeat
    'dnk':'99', // Don't know
} as const;


export class HeatSymptoms extends ItemQuestion {

    coding = HeatSymptomsCoding

    title: Map<string, string>

    constructor(props:ItemProps,  defaultKey: string, title: Map<string, string>,  ) {
        super(props, defaultKey);
        this.title = title;
    }

    buildItem():SurveyItem {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: this.title,
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {

        const c = this.coding;
        const symptoms = [c.thirst, c.dizziness, c.faiting, c.insomnia, c.confused, c.cramping, c.ataxia, c.palpitations];

        const exclusiveOptionRule =  ClientExpression.multipleChoice.any(this.key, c.no, c.dnk);
        const sympt = (key: string, content: LanguageMap)=> option_def(key, content, { disabled: exclusiveOptionRule} );

        return [
           option_def(c.no, _T('heatwave.common.symptom.no', "No"),
                { disabled: ClientExpression.multipleChoice.any(this.key, ...symptoms, c.dnk) }),
           sympt(c.thirst, _T('heatwave.common.symptom.thirst', "Extreme thirst")),
           sympt(c.dizziness, _T('heatwave.common.symptom.dizziness', "Dizziness / light headedness")),
           sympt(c.faiting, _T('heatwave.common.symptom.faiting', "Fainting / collapsing")),
           sympt(c.insomnia, _T('heatwave.common.symptom.insomnia', "Too hot to sleep")),
           sympt(c.confused, _T('heatwave.common.symptom.confused', "Feeling confused / couldn’t think properly")),
           sympt(c.cramping, _T('heatwave.common.symptom.cramping', "Muscle twitches / cramping")),
           sympt(c.ataxia, _T('heatwave.common.symptom.ataxia', "Lack of coordination / difficulty with movement")),
           sympt(c.palpitations, _T('heatwave.common.symptom.palpitations', "Racing heartbeat")),
           option_def(c.dnk, _T('heatwave.common.symptom.dnk', "Don't know"),
                { disabled: ClientExpression.multipleChoice.any(this.key, ...symptoms, c.no) }),
        ]
    }

    /**
     * Condition true when the participant reported at least one actual heat symptom
     * (i.e. any response other than "No" or "Don't know")
     */
    createSymptomCondition(): Expression {
        const c = this.coding;
        return ClientExpression.multipleChoice.any(
            this.key,
            c.thirst, c.dizziness, c.faiting, c.insomnia, c.confused, c.cramping, c.ataxia, c.palpitations
        );
    }
}