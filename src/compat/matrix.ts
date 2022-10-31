
import { ComponentProperties, Expression } from "survey-engine/data_types";

export interface HeaderRow {
    role: 'headerRow';
    key: string;
    displayCondition?: Expression;
    disabled?: Expression;
    cells: Array<{
        role: 'text';
        key: string;
        content?: Map<string, string>;
        description?: Map<string, string>;
    }>;
}

export interface RadioRow {
    role: 'radioRow';
    key: string;
    displayCondition?: Expression;
    disabled?: Expression;
    cells: Array<{
        role: 'label' | 'option';
        key: string;
        content?: Map<string, string>;
        description?: Map<string, string>;
    }>;
}
export interface ResponseRowCell {
    role: 'label' | 'check' | 'input' | 'numberInput' | 'dropDownGroup';
    key: string;
    content?: Map<string, string>;
    description?: Map<string, string>;
    properties?: ComponentProperties;
    items?: Array<{
        role: 'option';
        key: string;
        content?: Map<string, string>;
        disabled?: Expression;
        displayCondition?: Expression;
    }>;
}
export interface ResponseRow {
    role: 'responseRow';
    key: string;
    displayCondition?: Expression;
    disabled?: Expression;
    cells: Array<ResponseRowCell>;
}

export type MatrixRow = HeaderRow | RadioRow | ResponseRow;





