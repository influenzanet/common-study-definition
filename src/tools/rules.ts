import { StudyRules } from "case-editor-tools/types/studyRules";
import { StudyRulesSet } from "../types";

/**
 * Study Rules builder
 * 
 * Create a basic class to generate Study Rules
 */
export abstract class AbstractStudyRulesBuilder {
    
    rules: StudyRulesSet
    created: boolean;

    constructor() {
        this.rules = {
            entry: [],
            submit: []
        };
        this.created = false;
    }

    protected abstract create():void;

    build(): StudyRules {

        if(!this.created) {
            this.create();
            this.created = true;
        }

        /**
         * STUDY RULES
         */
        return new StudyRules(
            this.rules.entry,
            this.rules.submit,
            this.rules.timer,
            this.rules.merger
        );
    }
}
