export interface FlagDefinition {
    key: string;
    values: Record<string, string>
    [extra:string]: any
}

export interface FlagCollection {
    [key:string]: FlagDefinition;
}