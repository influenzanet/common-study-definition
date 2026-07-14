import { _T } from "../../common/languages"
import { SurveyBuilder } from "../../../tools";
import * as questions from "../questions/heatsymptoms";
import { HeatwaveKeys } from "./keys";

export class HeatwaveSymptomsSurvey extends SurveyBuilder {

    constructor(metadata: Map<string, string>) {
        super({
            surveyKey: HeatwaveKeys.SymptomSurvey,
            name: _T("heatwave.symptoms.name", "Heat-Related Illness Survey"),
            description: _T(
                "heatwave.symptoms.description",
                "Weekly survey about heat exposure, symptoms and the actions you took because of the heat",
            ),
            durationText: _T(
                "heatwave.symptoms.typicalDuration", "Duration 2-3 minutes"
            ),
            metadata:metadata
        });

        this.items = [];

        const rootKey = this.key;

        const defaultRequired = true;

        const Q10 = new questions.HighestHomeTemperature({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q10);

        const Q11 = new questions.LowestHomeTemperature({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q11);

        const Q12 = new questions.DaytimeLocation({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q12);

        const Q13 = new questions.DaytimeDiscomfort({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q13);

        const Q14 = new questions.NighttimeLocation({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q14);

        const Q15 = new questions.NighttimeDiscomfort({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q15);

        const Q16 = new questions.WeeklyHeatSymptoms({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q16);
        const hasSymptom = Q16.createSymptomCondition();

        // Q16a: only if at least one actual symptom was reported in Q16
        const Q16a = new questions.SoughtHealthCare({ parentKey: rootKey, isRequired: defaultRequired });
        Q16a.setCondition(hasSymptom);
        this.items.push(Q16a);

        const Q17 = new questions.RoutineImpact({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q17);

        // Q17a: only if at least one actual symptom was reported in Q16
        const Q17a = new questions.AbsentFromWork({ parentKey: rootKey, isRequired: defaultRequired });
        Q17a.setCondition(hasSymptom);
        this.items.push(Q17a);

        const Q18 = new questions.ProtectiveActions({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q18);

        const Q19 = new questions.ClimateShelter({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q19);

        // Q19a: only if Q19 was answered "No"
        const Q19a = new questions.ClimateShelterNoReason({ parentKey: rootKey, isRequired: defaultRequired });
        Q19a.setCondition(Q19.responseConditionNo());
        this.items.push(Q19a);

        const Q20 = new questions.PublicTransport({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q20);

        // Q20a: only if Q20 was answered with any "Yes" option
        const Q20a = new questions.PublicTransportAirConditioning({ parentKey: rootKey, isRequired: defaultRequired });
        Q20a.setCondition(Q20.responseConditionYes());
        this.items.push(Q20a);

        const Q21 = new questions.HeatDisruption({ parentKey: rootKey, isRequired: defaultRequired });
        this.items.push(Q21);
    }
}
