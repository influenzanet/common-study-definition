import { stringify } from "querystring";

export interface FlagDefinition {
    key: string;
    values: Record<string, string>
}

interface AgeFlagDefinition extends FlagDefinition {
    age: number;
}

const ageFlag : AgeFlagDefinition = {
    age: 5,
    key: 'group',
    values: {
        no: 'NC',
        yes: 'C'
    }
}

export function flag(name: string, values: Record<string, string>) {
    return {
        key: name,
        values: values
    }
};


export const ParticipantFlags = {
    isChild:  ageFlag,
    hasOnGoingSymptoms: {
        key: 'prev',
        values: {
            no: '0',
            yes: '1'
        }
    },
    vaccinationCompleted: {
        key: 'completedVaccSurvey',
        values: {
            no: '0',
            yes: '1'
        }
    },

}

