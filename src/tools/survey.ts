import { Item, SurveyDefinition, SurveyProps } from "case-editor-tools/surveys/types";
import { Expression, isExpression, Survey } from "survey-engine/data_types";
import { isConditionable } from "../types/item";
import { ItemBuilder } from "./items";


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

    constructor(props: SurveyBuilderProps) {
        super(props);
        if(props.metadata) {
            const meta : SurveyMetadata = {};
            props.metadata.forEach((value, key)=> {
                meta[key] = value;
            });
            this.editor.setMetadata(meta);
        }

        this.items = [];
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
    }


}

