import { SurveyEngine } from "case-editor-tools/surveys";
import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";

import { ExpressionArg,  Expression} from "survey-engine/data_types";


// Aliases for Expression generator to make the names more different
// To reduce the risk of using the expression generator for the wrong execution context
export {
    SurveyEngine as ClientExpression,
    StudyEngine as ServerExpression
};

export const isExpressionArg = (value: ExpressionArg | any): value is ExpressionArg => {
    if(typeof(value) !== 'object') {
        return false;
    }
    if('dtype' in value) {
        return true;
    }
    if('str' in value && typeof(value.str) === "string") {
        return true;
    }
    return false;
}

/**
 * 
 * @param value 
 * @returns true if ok, string if error
 */
export const isValidExpressionArg = (value: ExpressionArg): true | string =>{
    const dtype = value.dtype ?? 'str';  
    const isStr = typeof(value.str) === "string";
    const isNum = typeof(value.num) === "number";
    const isExp = typeof(value.exp) === "object" && value.exp !== null;
    
    const valide = (expected:boolean, expectedNot: boolean, label: string ) => {
        if(expected && !expectedNot) {
            return true;
        }
        return "Inconsistent state must have entry "+label+ " when dtype is '"+dtype+"'";
    }

    switch(dtype) {
        case 'str':
            return valide(isStr, isNum || isExp, "str");
        case 'num':
            return valide(isNum, isStr || isExp, "num");
        case 'exp':
            return valide(isExp, isStr || isNum, "exp");
    }
}
  

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