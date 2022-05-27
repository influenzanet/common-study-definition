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

    /**
     *
     * @param props Properties
     * @param defaultKey default item key to use in common implementation, could be overridden by keyOverride props
     */
    constructor(props: ItemProps, defaultKey: string) {
        super(props.parentKey, props.keyOverride ? props.keyOverride: defaultKey);
        this.isRequired = props.isRequired;
    }

    /**
     * Create the condition to show the question.
     * This method will be called before buildItem and set the condition field (no need to call it directly)
     * @returns
     */
    getCondition() : Expression | undefined {
        return undefined;
    }

    get(): SurveySingleItem {
        this.condition = this.getCondition();
        return super.get();
    }

}

export interface GroupProps {
     /**
     * @var parentKey full key path of the parent item, required to generate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
     */
    parentKey: string

    /**
     * @var keyOverride key to override the default item key for this group
     */
    keyOverride?: string,

    /**
     * @var isRequired should questions of this group need to have a response
     * This can be used in buildGroup() to provide a common value for the questions of this group.
     * It's not use by default
     */
    isRequired?: boolean

    /**
     * Selection expression for this group
     */
    selectionMethod?: Expression
}

export abstract class GroupQuestion extends Group {

    /**
     *
     * @param props
     * @param defaultKey Default key to be used for base implementation of this group
     */
    constructor(props: GroupProps, defaultKey: string) {
        const groupKey = props.keyOverride ? props.keyOverride : defaultKey;
        super(props.parentKey, groupKey, props.selectionMethod)
    }

    /**
     * Condition to show this group.
     * If returns non undefined value the condition will be set to the group
     * @returns
     */
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
