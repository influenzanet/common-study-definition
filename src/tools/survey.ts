import { Item, SurveyDefinition, SurveyProps } from "case-editor-tools/surveys/types";
import { Duration, durationObjectToSeconds } from "case-editor-tools/types/duration";
import { Expression, ExpressionArg, ExpressionName, isExpression, isSurveyGroupItem, Survey, SurveyItem, SurveyPrefillRuleNames } from "survey-engine/data_types";
import { isConditionable } from "../types/item";
import { isGroupBuilder, isSimpleGroupQuestion, ItemBuilder } from "./items";


export interface SurveyBuilderProps extends SurveyProps {
    metadata?: Map<string,string>;
}

interface SurveyMetadata {
    [key:string]: string;
}

/**
 * SurveyBuilder is a base class to create a Survey.
 * It enhances SurveyDefinition (provided by case-editor-tools)
 */
export class SurveyBuilder extends SurveyDefinition {

    items: ItemBuilder[];

    prefillRules: Expression[]

    constructor(props: SurveyBuilderProps) {
        super(props);
        if(props.metadata) {
            const meta : SurveyMetadata = {};
            props.metadata.forEach((value, key)=> {
                meta[key] = value;
            });
            this.editor.setMetadata(meta);
        }
        this.prefillRules = [];
        this.items = [];
    }

    prefillWithLastResponse(item: Item, maxDelay?:number|Duration ) {
        const params: ExpressionArg[] =  [
            { str: this.key },
            { str: item.key }
        ];

        if(maxDelay) {
            const delay = (typeof(maxDelay) == "number") ? maxDelay : durationObjectToSeconds(maxDelay);
            params.push({'dtype': 'num', num: delay});
        }

        this.prefillRules.push(
            {
                name: <SurveyPrefillRuleNames>"GET_LAST_SURVEY_ITEM",
                data: params
            }
        );
    }

    push(item:ItemBuilder, condition?: Expression|(()=>Expression)) {
        if(condition && !isExpression(condition)) {
            if(typeof(condition) == "function") {
                condition = condition();
            }
        }

        if(condition) {
            if(!isConditionable(item)) {
                throw new Error("Cannot add a condition to this item " + item.key + " must implements setCondition()");
            }
            item.setCondition(condition);
        }
        this.items.push(item);
    }

    // Default implementation build survey from the stacked items
    buildSurvey() {
        for (const item of this.items) {
            this.addItem(item.get());
        }
        this.editor.setPrefillRules(this.prefillRules);
    }

    getQuestionClasses():Record<string,string> {
        const names: Record<string,string> = {};
        
        const collectNames = (item:ItemBuilder) => {
            const className = item.constructor.name;
            names[className] = item.key;
            if(isSimpleGroupQuestion(item)) {
                for(const sub of item.innerItems) {
                    collectNames(sub);
                }
            }
        }
        
        for (const item of this.items) {
            collectNames(item); 
        }
        return names;
    }
}

export const isSurveyBuilder = (d: SurveyDefinition): d is SurveyBuilder => {
    return 'items' in d && 'prefillRules' in d;
}

