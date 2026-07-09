import { FlagDefinition } from "../../types";

/**
 * Participant flags used by the heatwave study workflow.
 *
 * - heatConsent: stores the participant's answer to the consent survey
 * - heatbackCompleted: set once the participant has completed the heatback survey
 */
export const HeatwaveParticipantFlags = {

    heatConsent: {
        key: 'heatConsent',
        values: {
            no: '0',
            yes: '1',
        } as const,
    } as const,

    heatbackCompleted: {
        key: 'heatbackCompleted',
        values: {
            no: '0',
            yes: '1',
        } as const,
    } as const,

} as const;
