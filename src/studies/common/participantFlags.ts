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
    }
}

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

