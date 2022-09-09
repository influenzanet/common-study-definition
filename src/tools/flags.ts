import { FlagDefinition } from "../types"

export function flag(name: string, values: Record<string, string>): FlagDefinition {
    return {
        key: name,
        values: values
    }
};
