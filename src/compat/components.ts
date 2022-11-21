import { generateLocStrings } from "case-editor-tools/surveys/utils/simple-generators";
import { generateRandomKey } from "case-editor-tools/surveys/utils//randomKeyGenerator"
import { StyledTextComponentProp } from "case-editor-tools/surveys/types";
import { Expression, ItemComponent } from "survey-engine/data_types";

export interface CommonProps {
    key?: string,
    content?: Map<string, string> | StyledTextComponentProp[];
    displayCondition?: Expression;
  }

  export interface TextProps extends CommonProps {
    content: Map<string, string>;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'li';
    className?: string;
  }


export const textComponent = (props: TextProps): ItemComponent => {
    const styles = [];
    if (props.className !== undefined) {
      styles.push({
        key: 'className', value: props.className
      })
    }
    if (props.variant !== undefined) {
      styles.push({
        key: 'variant', value: props.variant
      })
    }
    return {
      key: props.key ?? generateRandomKey(3),
      role: 'text',
      style: styles.length > 0 ? styles : undefined,
      content: generateLocStrings(props.content),
      displayCondition: props.displayCondition,
    }
}

interface MarkdownProps extends CommonProps {
    content: Map<string, string>;
    className?: string;
  }

export const markdownComponent = (props: MarkdownProps): ItemComponent => {
    const styles = [];
    if (props.className !== undefined) {
      styles.push({
        key: 'className', value: props.className
      })
    }
    return {
      key: props.key ?? generateRandomKey(3),
      role: 'markdown',
      style: styles.length > 0 ? styles : undefined,
      content: generateLocStrings(props.content),
      displayCondition: props.displayCondition,
    }
  }
