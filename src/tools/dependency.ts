
import { Item } from "case-editor-tools/surveys/types";
import { Expression } from "survey-engine/data_types";
import { ItemDependency, QuestionType } from "../types/item";
import { ClientExpression as client } from "./expressions";
interface SingleItemDependencyProps {
    item: Item;
    type: QuestionType;
    responses: string[]
}

/**
 * Describes condition dependent of one SingleItem (question)
 *
 */
export class SingleItemDependency implements ItemDependency {

    item: Item;
    type: QuestionType;
    responses: string[]

    constructor(props: SingleItemDependencyProps) {
        this.item = props.item;
        this.type = props.type;
        this.responses = props.responses;
    }

    getCondition() {
        const key = this.item.key;
        if(this.type == 'single') {
            return client.singleChoice.any(key, ...this.responses);
        }
        if(this.type == 'multiple') {
            return client.multipleChoice.any(key, ...this.responses);
        }
    }
}

/**
 * Describes several items dependencies
 * This class can be used to compose dependencies
 */
 export class SeveralItemDependency implements ItemDependency {
    dependencies: ItemDependency[]

    constructor(dependencies: ItemDependency[]) {
        this.dependencies = dependencies;
    }

    getCondition(): Expression | undefined {
        const conditions : Expression[] = [];
        this.dependencies.forEach( d => {
            const e = d.getCondition();
            if(typeof(e) != "undefined") {
                conditions.push(e);
            }
        });

        if(conditions.length > 0) {
            return client.logic.and(...conditions);
        }
        return undefined;
    }
}
