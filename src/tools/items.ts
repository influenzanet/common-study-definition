import { GenericQuestionProps, Group, Item, OptionDef } from "case-editor-tools/surveys/types";
import { SurveyItems } from 'case-editor-tools/surveys';
import { Expression, ItemComponent, SurveyItem, SurveySingleItem } from "survey-engine/data_types";
import { isConditionable, ItemConditionable, QuestionType } from "../types/item";
import { ClientExpression } from "./expressions";
import { trans_item } from "./text";

export type ItemBuilder = Item | Group;

export const isGroupBuilder = (item: ItemBuilder): item is Group=> {
    return 'groupEditor' in item;
}

/**
 * Create an item key from parent + itemKey
 *
 * This helper just embeds the full key of an item (dot separated) to avoid hardcoding it everywhere
 * And does extra checks, like checking itemKey is not empty and doest contains dot
 *
 * @param parentKey
 * @param itemKey
 * @returns
 */
export const surveyItemKey = (parentKey: string, itemKey: string) => {
    if(!itemKey) {
        throw new Error("Itemkey cannot be empty");
    }
    if(itemKey.includes('.')) {
        throw new Error("itemKey cannot contains dot,'" + itemKey+"' given");
    }
    return parentKey + '.' + itemKey;
}


// Can add notes to the question
interface QuestioNotes {
    top?: ItemComponent | ItemComponent[]
    bottom?: ItemComponent | ItemComponent[]
}

const createNotes = (notes: QuestioNotes, side: keyof QuestioNotes): ItemComponent[]|undefined => {
        const nn = side == 'top' ? notes?.top : notes?.bottom;
        if(!nn) {
            return undefined;
        }
        if(Array.isArray(nn)) {
            return nn;
        }
        return [nn];
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

    /**
     * Key to use for translations
     */
    transKey?: string

    notes?: QuestioNotes
}


/**
 * ItemQuestion enhances Item handling Condition
 */
export abstract class ItemQuestion extends Item implements ItemConditionable {

    /**
     *  Base question options
     *  To be useable the question implementation should handle the option
     */
    protected options?: Partial<BaseQuestionOptions>;

    /**
     * Key used for translation
     * Usually surveyKey.itemKey independently of the question location (itemKey must be unique in the survey regardless grouping)
     */
    readonly transKey?: string;

    /**
     *
     * @param props Properties
     * @param defaultKey default item key to use in common implementation, could be overridden by keyOverride props
     */
    constructor(props: ItemProps, defaultKey: string) {
        super(props.parentKey, props.keyOverride ? props.keyOverride: defaultKey);
        if(props.transKey) {
            this.transKey = props.transKey;
        }
        this.isRequired = props.isRequired;
    }

    /**
     * Create the condition to show the question.
     * This method will be called before buildItem and set the condition field (no need to call it directly)
     * @returns
     */
    getCondition() : Expression | undefined {
        // If condition is already defined the returns it
        if(this.condition) {
            return this.condition;
        }
        return undefined;
    }

    setCondition(condition: Expression): void {
        this.condition = condition;
    }

    get(): SurveySingleItem {
        this.condition = this.getCondition();
        return super.get();
    }

    setOptions(o: Partial<BaseQuestionOptions>) {
        this.options = { ...this.options, ...o};
    }

    getHelpGroupContent(): HelpGroupContentType|undefined {
        return undefined;
    }

    getTransKey(): string {
        return this.transKey ?? this.key;
    }

    /**
     * Create a translate entry for this item. Translation id is generated using transKey (or key if not defined), and name as suffix
     * @param name name of transaltion entry for this item
     * @param ref Reference text
     * @returns 
     */
    trans(name:string, ref:string) {
        return trans_item(this, name, ref);
    }

    /**
     * Get notes for a side of the question
     * Notes used given components (first) and then add the componets eventualy passed in options 
     * @param side top or bottom components
     * @param components List of built-in componenet (added systematically)
     * @returns 
     */
    getNotes(side: 'top'|'bottom', ...components:ItemComponent[]): undefined|ItemComponent[] {
        const comp = components ?? [];
        if(this.options?.bottomDisplayCompoments && side == 'bottom') {
            comp.push(...this.options?.bottomDisplayCompoments );
        }
        if(this.options?.topDisplayCompoments && side == 'top') {
            comp.push(...this.options?.topDisplayCompoments);
        }
        if(comp.length == 0) {
            return undefined;
        }
        return comp;
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

export abstract class GroupQuestion extends Group implements ItemConditionable {

    condition: Expression | undefined;

    /**
     *
     * @param props
     * @param defaultKey Default key to be used for base implementation of this group
     */
    constructor(props: GroupProps, defaultKey: string) {
        const groupKey = props.keyOverride ? props.keyOverride : defaultKey;
        super(props.parentKey, groupKey, props.selectionMethod)
    }

    setCondition(condition: Expression): void {
        this.condition = condition;
    }

    /**
     * Condition to show this group.
     * If returns non undefined value the condition will be set to the group
     * @returns
     */
    getCondition() : Expression | undefined {
        // If condition is already defined the returns it
        if(this.condition) {
            return this.condition;
        }
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

export const isSimpleGroupQuestion = (item: ItemBuilder): item is SimpleGroupQuestion => {
    return 'innerItems' in item;
}

/**
 * Base implementation of a simple groups, as a collection of items
 */
export class SimpleGroupQuestion extends GroupQuestion {

    innerItems: ItemBuilder[]

    constructor(props: GroupProps, defaultKey: string) {
        super(props, defaultKey);
        this.innerItems = [];
    }

    buildGroup(): void {
        this.innerItems.forEach(i => {
            this.addItem(i.get());
        });
    }

    add(items: ItemBuilder|ItemBuilder[], condition?: Expression) {
        if(!Array.isArray(items)) {
          items = [items];
        }
        if(condition) {
            items.forEach(i => {
                if(isConditionable(i)) {
                    i.setCondition(condition);
                }
            });
        }
        this.innerItems.push(...items);
    }
}

export type HelpGroupContentType =  Array<{
    content: Map<string, string>;
    style?: Array<{
        key: string;
        value: string;
    }>;
}>;

// Useable fields for options excluding the fields already provided as independent fields
export type BaseQuestionOptions = Omit<GenericQuestionProps, 'parentKey' | 'itemKey' | 'isRequired' | 'condition'  >;

/**
 * Simple implementation for basic choice based question. Provides simple interface to defined core elements
 * - options to define static options (text, top/bottomDisplayComponents )
 * - methods for helpgroup and response list (to be overrideable at runtime)
 */
export abstract class BaseChoiceQuestion extends ItemQuestion {

    /**
     * Overrides options, who must be complete here (with questionText)
     */
    declare protected  options?: BaseQuestionOptions;

    protected questionType : QuestionType;

    abstract getResponses(): OptionDef[]

    constructor(props: ItemProps, defaultKey: string, questionType: QuestionType) {
        super(props, defaultKey);
        this.questionType = questionType;
    }

    setOptions(options: BaseQuestionOptions) {
        this.options = options;
    }

    buildItem():SurveyItem {

        if(!this.options) {
            throw new Error("options are not defined of " + this.key);
        }

        const o = {
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            responseOptions: this.getResponses(),
            ...this.options,
        };

        const h = this.getHelpGroupContent();

        if(h && !o.helpGroupContent) {
            o.helpGroupContent = h;
        }

        return this.questionType == 'single' ? SurveyItems.singleChoice(o) : SurveyItems.multipleChoice(o);
    }

    /**
     * Create a condition based on the response of this question
     * @param responses list of response
     * @returns Expression
     */
    createConditionFrom(responses: string[]) {
        if(this.questionType == 'single') {
            return ClientExpression.singleChoice.any(this.key, ...responses);
        }
        if(this.questionType == 'multiple') {
            return ClientExpression.multipleChoice.any(this.key, ...responses);
        }
    }

    getHelpGroupContent(): HelpGroupContentType | undefined {
        return undefined;
    }
}

