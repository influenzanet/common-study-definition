import { Expression } from "survey-engine/lib/data_types";
import { StudyRules } from "case-editor-tools/types/studyRules";
import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";
import { ParticipantFlags } from "./participantFlags";
import { Intake } from "./surveys/intake";
import { Weekly } from "./surveys/weekly";
import { Vaccination } from "./surveys/vaccination";


/**
 * Define what should happen, when persons enter the study first time:
 */
const entryRules: Expression[] = [
    StudyEngine.participantActions.assignedSurveys.add(Intake.key, 'normal')
];


/**
 * Define what should happen, when persons submit an intake survey:
 */
const handleIntake = StudyEngine.ifThen(
    StudyEngine.checkSurveyResponseKey(Intake.key),
    // remove assigned intake
    StudyEngine.participantActions.assignedSurveys.remove(Intake.key, 'all'),
    // add weekly survey if not already there
    StudyEngine.ifThen(
        StudyEngine.not(
            StudyEngine.participantState.hasSurveyKeyAssigned(Weekly.key)
        ),
        StudyEngine.participantActions.assignedSurveys.add(Weekly.key, 'prio')
    ),
    // add optional intake
    StudyEngine.participantActions.assignedSurveys.add(Intake.key, 'optional')
);

const handleWeekly = StudyEngine.ifThen(
    StudyEngine.checkSurveyResponseKey(Weekly.key),
    // remove weekly and re-add it with new a new timeout
    StudyEngine.participantActions.assignedSurveys.remove(Weekly.key, 'all'),
    StudyEngine.participantActions.assignedSurveys.add(Weekly.key, 'prio', StudyEngine.timestampWithOffset({
        hours: 1,
    })),
    // Manage flags:
    StudyEngine.if(
        // if has ongoing symptoms:
        StudyEngine.singleChoice.any(Weekly.Q_same_illnes.key, '2'),
        // then:
        StudyEngine.participantActions.updateFlag(
            ParticipantFlags.hasOnGoingSymptoms.key,
            ParticipantFlags.hasOnGoingSymptoms.values.yes
        ),
        // else:
        StudyEngine.participantActions.updateFlag(
            ParticipantFlags.hasOnGoingSymptoms.key,
            ParticipantFlags.hasOnGoingSymptoms.values.no
        )
    )
);

const handleVaccination = StudyEngine.ifThen(
    StudyEngine.checkSurveyResponseKey(Vaccination.key),
    // remove vaccination and re-add it with a new timeout
    StudyEngine.participantActions.assignedSurveys.remove(Vaccination.key, 'all'),
    StudyEngine.participantActions.assignedSurveys.add(Vaccination.key, 'prio', StudyEngine.timestampWithOffset({
        days: 28,
    })),
    // update vaccinationCompleted flag
    StudyEngine.participantActions.updateFlag(
        ParticipantFlags.vaccinationCompleted.key,
        ParticipantFlags.vaccinationCompleted.values.yes
    )
);


const handleChild = StudyEngine.ifThen(
    StudyEngine.checkSurveyResponseKey(Intake.key),
    StudyEngine.do(
        // set child flag if younger than age
        StudyEngine.if(
            StudyEngine.lt(
                StudyEngine.getResponseValueAsNum("intake.Q2", "rg.1"),
                StudyEngine.timestampWithOffset({ years: -ParticipantFlags.isChild.age })),
            StudyEngine.participantActions.updateFlag(
                ParticipantFlags.isChild.key,
                ParticipantFlags.isChild.values.no),
            StudyEngine.participantActions.updateFlag(
                ParticipantFlags.isChild.key,
                ParticipantFlags.isChild.values.yes)),
        // if not child, add vaccination survey if not already there
        StudyEngine.if(
            StudyEngine.and(
                StudyEngine.participantState.hasParticipantFlag(ParticipantFlags.isChild.key,
                    ParticipantFlags.isChild.values.no),
                StudyEngine.not(
                    StudyEngine.participantState.hasSurveyKeyAssigned(Vaccination.key))),
            StudyEngine.participantActions.assignedSurveys.add(Vaccination.key, 'prio')),
        // if child, remove vaccination survey if present
        StudyEngine.if(
            StudyEngine.and(
                StudyEngine.participantState.hasParticipantFlag(ParticipantFlags.isChild.key,
                    ParticipantFlags.isChild.values.yes),
                StudyEngine.participantState.hasSurveyKeyAssigned(Vaccination.key)),
            StudyEngine.do(
                StudyEngine.participantActions.assignedSurveys.remove(Vaccination.key, 'all'),
                StudyEngine.participantActions.removeFlag(ParticipantFlags.vaccinationCompleted.key))))
);

const submitRules: Expression[] = [
    handleIntake,
    handleWeekly,
    handleVaccination,
    handleChild
];

/**
 * STUDY RULES
 */
export const studyRules = new StudyRules(
    entryRules,
    submitRules,
)