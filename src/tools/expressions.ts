import { SurveyEngine } from "case-editor-tools/surveys";
import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";


// Aliases for Expression generator to make the names more different
// To reduce the risk of using the expression generator for the wrong execution context
export {
    SurveyEngine as ClientExpression,
    StudyEngine as ServerExpression
};
