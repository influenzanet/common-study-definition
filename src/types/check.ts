export enum ProblemTypes {
    empty_element = "empty_element",
}

export interface Problem {
    type: ProblemTypes;
    item: string; // Key of item
    path?: string; // Subpath in item
}
