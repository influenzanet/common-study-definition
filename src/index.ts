

export { StudyBuilder } from "./tools/study";

export { ItemBuilder } from "./tools/items";

export { SurveyKeys } from "./studies/common/keys";


export * from "./studies/common/languages/types";
export { GroupProps, ItemProps } from "./studies/common/questionPools/types"
export { LanguageHelpers } from "./studies/common/languages/languageHelpers";

export * from "./types";

// Export objects under the Common ns

import * as questionPools from "./studies/common/questionPools";
import  * as responses from "./studies/common/responses";
import *  as flags from "./studies/common/participantFlags";
import { StudyRulesBuilder } from "./studies/common/rules";
import * as languages from "./studies/common/languages";

export const CommonStudy = {
    StudyRulesBuilder: StudyRulesBuilder,
    languages: languages,
    questionPools: questionPools,
    responses: responses,
    flags: flags,
}



