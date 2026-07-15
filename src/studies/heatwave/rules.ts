import { Expression } from "survey-engine/data_types";
import { ServerExpression as se } from "../../tools/expressions";
import { AbstractStudyRulesBuilder } from "../../tools";
import { HeatwaveParticipantFlags as flags } from "./participantFlags";

export interface HeatwaveSurveyKeys {
    /** consent survey key */
    consent: string;
    consentItemKey: string;
    consentYesCode: string;
    /** heatback survey key */
    background: string;
    /** heatsymptoms survey key */
    symptoms: string;
}

/**
 *  - Everyone is assigned the consent survey on study entry.
 *  - On consent submit the answer is stored in a flag and the consent survey is
 *    readded as optional in case the participant wants to withdraw. Answering "yes" starts (or
 *    resumes) the workflow. Answering "no" withdraws from it.
 *  - Completing heatback once flags it done and immediately assigns heatsymptoms.
 *  - Completing heatsymptoms reassigns it a week later
 */
export class HeatwaveStudyRulesBuilder extends AbstractStudyRulesBuilder {

    keys: HeatwaveSurveyKeys;

    constructor(keys: HeatwaveSurveyKeys) {
        super();
        this.keys = keys;
    }

    protected create() {

        const assigned = se.participantActions.assignedSurveys;

        const consentKey = this.keys.consent;
        const backgroundKey = this.keys.background;
        const symptomsKey = this.keys.symptoms;

        const consentFlag = flags.heatConsent;
        const backCompleted = flags.heatbackCompleted;

        const SYMPTOMS_INTERVAL_SEC = 60480;

        /**
         * ENTRY: assign the consent survey to everyone
         */
        const entryRules: Expression[] = [
            assigned.add(consentKey, 'normal'),
        ];

        const answeredYes = se.singleChoice.any(this.keys.consentItemKey, this.keys.consentYesCode);
        const priorConsentYes = se.participantState.hasParticipantFlagKeyAndValue(consentFlag.key, consentFlag.values.yes);
        const heatbackDone = se.participantState.hasParticipantFlagKeyAndValue(backCompleted.key, backCompleted.values.yes);

        /**
         * On consent submit
         */
        const handleConsent = se.ifThen(
            se.checkSurveyResponseKey(consentKey),
            se.if(
                answeredYes,
                se.ifThen(
                    se.not(priorConsentYes),
                    se.if(
                        heatbackDone,
                        // heatback already completed -> resume symptoms, but only jump
                        // straight in if it's been >= 1 interval since the last symptoms
                        // submission. This is checked against real submission history
                        // in order to avoid no/yes toggles that
                        // can produce more than one symptoms submission per interval.
                        se.if(
                            se.participantState.lastSubmissionDateOlderThan(
                                se.timestampWithOffset({ seconds: -SYMPTOMS_INTERVAL_SEC }),
                                symptomsKey,
                            ),
                            // enough time passed (or never submitted) -> resume now
                            assigned.add(symptomsKey, 'immediate'),
                            // submitted recently -> schedule after the interval (validFrom
                            // in the future, so it isn't submittable early)
                            assigned.add(symptomsKey, 'prio', se.timestampWithOffset({ seconds: SYMPTOMS_INTERVAL_SEC })),
                        ),
                        // heatback not completed yet -> present it immediately
                        assigned.add(backgroundKey, 'immediate'),
                    ),
                ),
                se.do(
                    assigned.remove(backgroundKey, 'all'),
                    assigned.remove(symptomsKey, 'all'),
                ),
            ),
            // keep the consent survey available as optional
            assigned.remove(consentKey, 'all'),
            assigned.add(consentKey, 'optional'),
            se.if(
                answeredYes,
                se.participantActions.updateFlag(consentFlag.key, consentFlag.values.yes),
                se.participantActions.updateFlag(consentFlag.key, consentFlag.values.no),
            ),
        );

        const handleBackground = se.ifThen(
            se.checkSurveyResponseKey(backgroundKey),
            assigned.remove(backgroundKey, 'all'),
            se.participantActions.updateFlag(backCompleted.key, backCompleted.values.yes),
            assigned.add(symptomsKey, 'immediate'),
        );

        const handleSymptoms = se.ifThen(
            se.checkSurveyResponseKey(symptomsKey),
            assigned.remove(symptomsKey, 'all'),
            assigned.add(symptomsKey, 'prio', se.timestampWithOffset({ seconds: SYMPTOMS_INTERVAL_SEC })),
        );

        this.rules.entry = entryRules;
        this.rules.submit = [
            handleConsent,
            handleBackground,
            handleSymptoms,
        ];
    }
}
