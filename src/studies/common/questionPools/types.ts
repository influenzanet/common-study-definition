import { Group, Item } from "case-editor-tools/surveys/types";
import { Expression, SurveyItem, SurveySingleItem } from "survey-engine/data_types";

/**
 * Common parameters for Item class
 */

export interface GroupProps {
    parentKey: string,
    keyOverride?: string;
}

export interface ItemProps {
    /**
     * @var parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
     */
    parentKey: string,

    /**
     * @var isRequired if true adds a default "hard" validation to the question to check if it has a response.
     */
    isRequired?: boolean,

    /**
    * @var keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
    */
    keyOverride?: string;
}


export abstract class ItemQuestion extends Item {

    constructor(props: ItemProps, defaultKey: string) {
        super(props.parentKey, props.keyOverride ? props.keyOverride: defaultKey);
        this.isRequired = props.isRequired;
    }

    // Create the condition
    getCondition() : Expression | undefined {
        return undefined;
    }

    get(): SurveySingleItem {
        this.condition = this.getCondition();
        return super.get();
    }

}

export interface GroupProps {
    parentKey: string
    keyOverride?: string,
    isRequired?: boolean
    selectionMethod?: Expression
}

export abstract class GroupQuestion extends Group {

    constructor(props: GroupProps, defaultKey: string) {
        const groupKey = props.keyOverride ? props.keyOverride : defaultKey;
        super(props.parentKey, groupKey, props.selectionMethod)
    }

    getCondition() : Expression | undefined {
        return undefined;
    }

    get(): SurveyItem {
        const condition = this.getCondition();
        if(condition) {
            this.groupEditor.setCondition(condition);
        }
        return super.get();
    }

}
