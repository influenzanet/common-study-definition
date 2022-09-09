import { Expression } from "survey-engine/data_types";
import { Group, Item } from "case-editor-tools/surveys/types";

export type QuestionType = 'single' | 'multiple'; 

// Object returning a condition
export interface ItemDependency {
    getCondition(): Expression | undefined;
}

export interface ItemConditionable {
    setCondition(condition: Expression):void;
}

export const isConditionable = (item:  any): item is ItemConditionable => {
    return typeof((item as ItemConditionable).setCondition) != "undefined";
}
