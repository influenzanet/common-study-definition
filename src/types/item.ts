import { Expression } from "survey-engine/data_types";
import { Group, Item } from "case-editor-tools/surveys/types";

export type QuestionType = 'single' | 'multiple';

// Object accepting condition
export interface ItemConditionable {
    setCondition(condition: Expression):void;
}

export const isConditionable = (item:  any): item is ItemConditionable => {
    return typeof((item as ItemConditionable).setCondition) != "undefined";
}
