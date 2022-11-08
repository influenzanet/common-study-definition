import { Study } from "case-editor-tools/types/study";
import { Expression, isExpression, isItemGroupComponent, isSurveyGroupItem, ItemComponent, Survey, SurveyGroupItem, SurveyItem } from "survey-engine/data_types";
import { Problem, ProblemTypes } from "../types";
import { ItemQuestion } from "./items";
import { SurveyDefinition } from "case-editor-tools/surveys/types";

interface CheckResult {
    checks: string[]
    problems: Problem[]
}

export class SurveyChecker {

    survey: Survey;

    problems: Problem[]

    // Check rule applied
    checks: string[]

    constructor(survey: Survey) {
        this.survey = survey;
        this.problems = [];
        this.checks = [];
    }

    check():CheckResult {
        this.checkEmptyItems(this.survey.surveyDefinition);
        this.checks.push('empty_element');
        return {
            'problems': this.problems,
            'checks': this.checks,
        };
    }

    raise(type:ProblemTypes, itemKey: string, path?: string) {
        console.log(" - " + itemKey + ' '+ path + " = " + type);
        this.problems.push({
            type: type,
            item: itemKey,
            path: path
        });
    }

    checkEmptyItems(item: SurveyItem) {
        //console.log('check ' + item.key);
        if('items' in item) { // Cannot use isSurveyGroupItem because it check length
            if(item.items) {
                if(item.items.length == 0) {
                    console.log("empty item " + item.key);
                    this.raise(ProblemTypes.empty_element, item.key, 'items');
                } else {
                    item.items.forEach(i => this.checkEmptyItems(i));
                }
            }
        } else {
            if(item.components) {
                this.checkEmptyComponents(item.key, 'components:', item.components );
            }
        }
    }

    checkEmptyComponents(itemKey: string, path: string, comp: ItemComponent) {
        if('items' in comp && comp.items) {
            if(comp.items.length == 0) {
                console.log("empty componenent " + itemKey + ' ' + path);
                this.raise(ProblemTypes.empty_element, itemKey, );
            } else {
                comp.items.forEach( (item, index) =>  {
                    const p = path + '/' + (item.key ? item.key : '[' + index + ']@' + item.role);
                    this.checkEmptyComponents(itemKey, p, item);
                });
            }
        }
        if(comp.content && comp.content.length == 0) {
            this.raise(ProblemTypes.empty_element, itemKey, path +':content');
        }
        if(comp.description && comp.description.length == 0) {
            this.raise(ProblemTypes.empty_element, itemKey, path +':description');
        }
    }

}

export class StudyChecker {

    study: Study;

    constructor(study:Study) {
        this.study = study;
    }

    check(): Map<string, CheckResult> {
        const results = new Map<string, CheckResult>();
        this.study.surveys.forEach(def => {
             const r = this.checkSurvey(def);
             if(r.problems.length > 0) {
                 results.set(def.key, r);
             }
        });
        return results;
     }

     checkSurvey(surveyDef: SurveyDefinition):CheckResult {
        // Need to get the built survey, caution cannot use surveyDef.getSurvey() because it rebuilds the survey and generate duplicate keys 
        const survey = surveyDef.editor.getSurvey();
        const checker = new SurveyChecker(survey);
        return checker.check();
     }
}
