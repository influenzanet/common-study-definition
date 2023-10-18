import { Study } from "case-editor-tools/types/study";
import { ComponentProperties, ExpressionArg, Expression, isExpression, isItemGroupComponent, isSurveyGroupItem, ItemComponent, Survey, SurveyGroupItem, SurveyItem } from "survey-engine/data_types";
import { Problem, ProblemTypes } from "../types";
import { SurveyDefinition } from "case-editor-tools/surveys/types";
import { isExpressionArg, isValidExpressionArg } from "./expressions";

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
        this.checkSurveyItem(this.survey.surveyDefinition);
        this.checks.push('empty_element');
        return {
            'problems': this.problems,
            'checks': this.checks,
        };
    }

    raise(type:ProblemTypes, itemKey: string, path?: string, message?:string) {
        console.log(" - " + itemKey + ' '+ path + " = " + type + (message ? " : "+message :''));
        const p: Problem = {type: type, item: itemKey};
        if(path) {
            p.path = path;
        }
        if(message) {
            p.message = message;
        }
        this.problems.push(p);
    }

    checkSurveyItem(item: SurveyItem) {
        if('items' in item) { // Cannot use isSurveyGroupItem because it check length
            if(Array.isArray(item.items)) {
                if(item.items.length == 0) {
                    console.log("empty item " + item.key);
                    this.raise(ProblemTypes.empty_element, item.key, 'items');
                } else {
                    item.items.forEach(i => this.checkSurveyItem(i));
                }
            }
        } else {
            if(item.components) {
                this.checkComponents(item.key, 'components:', item.components );
            }
        }
    }

    /**
     * Check the component tree
     * @param itemKey
     * @param path
     * @param comp
     */
    checkComponents(itemKey: string, path: string, comp: ItemComponent) {
        if('items' in comp && comp.items) {
            if(comp.items.length == 0) {
                console.log("empty component " + itemKey + ' ' + path);
                this.raise(ProblemTypes.empty_element, itemKey, );
            } else {
                comp.items.forEach( (item, index) =>  {
                    const p = path + '/' + (item.key ? item.key : '[' + index + ']@' + item.role);
                    this.checkComponents(itemKey, p, item);
                });
            }
        }
        this.checkComponent(itemKey, path, comp);
    }

    /**
     * Check the component itself
     * @param itemKey
     * @param path
     * @param comp
     */
    checkComponent(itemKey: string, path: string, comp: ItemComponent) {
        if(comp.content && comp.content.length == 0) {
            this.raise(ProblemTypes.empty_element, itemKey, path +':content');
        }
        if(comp.description && comp.description.length == 0) {
            this.raise(ProblemTypes.empty_element, itemKey, path +':description');
        }
        if(comp.properties) {
            this.checkComponentProperties(itemKey, path+':properties', comp.properties);
        }

    }

    checkComponentProperties(itemKey:string, path:string, props: ComponentProperties) {
        const check = (name: keyof ComponentProperties) => {
            if (!(name in props)){
                return;
            }
            const v = props[name];
            if(typeof(v) === "undefined") {
                return;
            }
            if(isExpressionArg(v)) {
                if(!isValidExpressionArg(v)) {
                    this.raise(ProblemTypes.wrong_type, itemKey, path+':'+name, 'Property must be ExpressionArg');
                }
            } else {
                this.raise(ProblemTypes.wrong_type, itemKey, path+':'+name, 'Property must be ExpressionArg');
            }
        }
        check('dateInputMode');
        check('max');
        check('min');
        check('stepSize');
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
