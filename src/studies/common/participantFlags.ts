import { stringify } from "querystring";
import { FlagDefinition } from "../../types";

interface AgeFlagDefinition extends FlagDefinition {
    age: number;
}

const ageFlag : AgeFlagDefinition = {
    age: 5,
    key: 'group',
    values: {
        no: 'NC',
        yes: 'C'
    } as const
} as const;

export const ParticipantFlags = {
    isChild:  ageFlag,
    hasOnGoingSymptoms: {
        key: 'prev',
        values: {
            no: '0',
            yes: '1'
        } as const
    } as const,
    vaccinationCompleted: {
        key: 'completedVaccSurvey',
        values: {
            no: '0',
            yes: '1'
        } as const
    } as const,

} as const;

