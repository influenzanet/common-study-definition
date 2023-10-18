export enum ProblemTypes {
    empty_element = "empty_element",
    wrong_type = 'wrong_type'
}

export interface Problem {
    type: ProblemTypes;
    item: string; // Key of item
    path?: string; // Subpath in item
    message?: string;
}
