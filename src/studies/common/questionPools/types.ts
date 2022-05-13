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
