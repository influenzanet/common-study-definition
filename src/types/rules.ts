import { Expression } from "survey-engine/data_types";

export interface StudyRulesSet {
    entry: Expression[]
    submit: Expression[]
    timer?: Expression[]
    merger?: Expression[]
}
