import { _T } from "../../common/languages"
import { SurveyBuilder } from "../../../tools";
import { ConsentQuestion } from "../questions/consent";

export class HeatwaveConsentSurvey extends SurveyBuilder {

    consent: ConsentQuestion;

    constructor(metadata: Map<string, string>) {
        super({
            surveyKey: 'heatconsent',
            name: _T("heatwave.consent.name", "Heatwave Consent"),
            description: _T(
                "heatwave.consent.description",
                "Consent to take part in the heatwave surveys",
            ),
            durationText: _T(
                "heatwave.consent.typicalDuration", "Duration less than 1 minute"
            ),
            metadata: metadata,
        });

        this.items = [];

        const rootKey = this.key;

        this.consent = new ConsentQuestion({ parentKey: rootKey, isRequired: true });
        this.items.push(this.consent);
    }
}
