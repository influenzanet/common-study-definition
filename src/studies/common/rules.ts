import { Expression } from "survey-engine/data_types";
import { ParticipantFlags as flags  } from "./participantFlags";
import { WeeklyResponses } from "./responses/weekly";
import { IntakeResponses } from "./responses/intake";
import { responseGroupKey } from "case-editor-tools/constants/key-definitions";
import { SurveyKeys } from "./keys";
import { ServerExpression as se } from "../../tools/expressions";
import { AbstractStudyRulesBuilder } from "../../tools";

export class StudyRulesBuilder extends AbstractStudyRulesBuilder {

    keys: SurveyKeys;

    constructor(keys: SurveyKeys) {
        super();
        this.keys = keys;
    }

    protected create() {

        const assignedSurveys = se.participantActions.assignedSurveys;


        const intakeKey = this.keys.intake.key;
        const weeklyKey = this.keys.weekly.key;
        /**
         * Define what should happen, when persons enter the study first time:
         */
        const entryRules: Expression[] = [
            assignedSurveys.add(intakeKey, 'normal')
        ];

        /**
         * Define what should happen, when persons submit an intake survey:
         */
        const handleIntake = se.ifThen(
            se.checkSurveyResponseKey(intakeKey),
            // remove assigned intake
            assignedSurveys.remove(intakeKey, 'all'),
            // add weekly survey if not already there
            se.ifThen(
                se.not(
                    se.participantState.hasSurveyKeyAssigned(weeklyKey)
                ),
                assignedSurveys.add(weeklyKey, 'prio')
            ),
            // add optional intake
            assignedSurveys.add(intakeKey, 'optional')
        );

        const weeklySymptomsEndKey = this.keys.weekly.getSymptomEnd().key;


        const handleWeekly = se.ifThen(
            se.checkSurveyResponseKey(weeklyKey),
            // remove weekly and re-add it with new a new timeout
            assignedSurveys.remove(weeklyKey, 'all'),
            assignedSurveys.add(weeklyKey, 'prio', se.timestampWithOffset({hours: 1,})),
            // Manage flags:
            se.if(
                // if has ongoing symptoms:
                se.singleChoice.any(weeklySymptomsEndKey, WeeklyResponses.symptoms_end.still_ill),
                // then:
                se.participantActions.updateFlag(
                    flags.hasOnGoingSymptoms.key,
                    flags.hasOnGoingSymptoms.values.yes
                ),
                // else:
                se.participantActions.updateFlag(
                    flags.hasOnGoingSymptoms.key,
                    flags.hasOnGoingSymptoms.values.no
                )
            )
        );

        const vacKey = this.keys.vaccination.key;

        const handleVaccination = se.ifThen(
            se.checkSurveyResponseKey(vacKey),
            // remove vaccination and re-add it with a new timeout
            assignedSurveys.remove(vacKey, 'all'),
            assignedSurveys.add(vacKey, 'prio', se.timestampWithOffset({days: 28})),
            // update vaccinationCompleted flag
            se.participantActions.updateFlag(flags.vaccinationCompleted.key, flags.vaccinationCompleted.values.yes)
        );

        const ageResponseComp = responseGroupKey + '.' + IntakeResponses.birthDate.date;

        const intakeBirthDateKey = this.keys.intake.getBirthDateItem().key;

        const handleChild = se.ifThen(
            se.checkSurveyResponseKey(intakeKey),
            se.do(
                // set child flag if younger than age
                se.if(
                    se.lt(
                        se.getResponseValueAsNum(intakeBirthDateKey, ageResponseComp),
                        se.timestampWithOffset({ years: -flags.isChild.age })
                    ),
                    se.participantActions.updateFlag(flags.isChild.key, flags.isChild.values.no),
                    se.participantActions.updateFlag(flags.isChild.key, flags.isChild.values.yes)
                ),
                // if not child, add vaccination survey if not already there
                se.if(
                    se.and(
                        se.participantState.hasParticipantFlagKeyAndValue(flags.isChild.key, flags.isChild.values.no),
                        se.not(
                            se.participantState.hasSurveyKeyAssigned(vacKey)
                        )
                    ),
                    se.participantActions.assignedSurveys.add(vacKey, 'prio')
                ),
                // if child, remove vaccination survey if present
                se.if(
                    se.and(
                        se.participantState.hasParticipantFlagKeyAndValue(flags.isChild.key, flags.isChild.values.yes),
                        se.participantState.hasSurveyKeyAssigned(vacKey)
                    ),
                    se.do(
                        se.participantActions.assignedSurveys.remove(vacKey, 'all'),
                        se.participantActions.removeFlag(flags.vaccinationCompleted.key)
                    )
                ) // if
            ) // do
        );


        const submitRules: Expression[] = [
            handleIntake,
            handleWeekly,
            handleVaccination,
            handleChild
        ];

        this.rules.entry = entryRules;
        this.rules.submit = submitRules;

        this.extraRules();
    }

    /**
     *
     * Build extra rules (placeholder for extension)
     */
    extraRules() {

    }

}
