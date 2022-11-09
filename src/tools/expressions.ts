import { SurveyEngine } from "case-editor-tools/surveys";
import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";

import { ExpressionArg,  Expression} from "survey-engine/data_types";


// Aliases for Expression generator to make the names more different
// To reduce the risk of using the expression generator for the wrong execution context
export {
    SurveyEngine as ClientExpression,
    StudyEngine as ServerExpression
};


/**
 * Create an ExpressionArg from an Expression
 * 
 * ExpressionArg embeds expression, but can embed other kind of data (like string and num constants)
 * 
 * @param exp Expression
 * @returns 
 */
export const exp_as_arg = (exp: Expression): ExpressionArg => {
    return {'dtype': 'exp', exp: exp};
}

export const num_as_arg = (n: number) : ExpressionArg => {
    return {'dtype': 'num', num: n};
}