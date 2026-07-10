import { _T } from "../../common/languages"
import { OptionDef } from "case-editor-tools/surveys/types";
import { SurveyItems } from 'case-editor-tools/surveys';
import { ItemQuestion, ClientExpression, ItemProps } from "../../../tools";
import { Expression, SurveyItem } from "survey-engine/data_types";
import { option_def } from "../../../tools/options";
import { markdownComponent } from "../../../compat";

const CONSENT_TEXT_EN = `**Help us track the health effects of heat waves — confirm your participation**

Dear Influweb participant,

Because you are already part of the Influweb community, we would like to invite you to take part in a new study on the health effects of heat waves, running from mid-July to mid-September 2026.

To join, we ask you to complete one short one-off questionnaire now, about your housing and how heat affects you. During the study, you will then receive a short (~30 second) survey once a week, asking whether you experienced any heat-related symptoms (such as extreme thirst, dizziness, fainting, difficulty sleeping due to heat, confusion, muscle cramps, lack of coordination, or a racing heartbeat) and how you managed them.

Participation is entirely voluntary. You can withdraw at any time, without giving a reason, by compiling again this short questionnaire and selecting “No / I want to withdraw”; this will not affect your involvement in Influweb. Your data is protected under GDPR: only pseudonymized data is used for research purposes, and your responses remain confidential and securely held by ISI Foundation. You can find full details, including your data protection rights, in the study's [Participant Information Sheet](link). **You may also reference the copy sent to your email.**

Interim results will be shared in October 2026 and final results in December 2026, published as anonymous, aggregate statistics on [Name of the platform](link).

Thank you for helping us better understand how heat affects health in the community.`;

const ConsentCoding = {
    no: '0',
    yes: '1',
} as const;

export class ConsentQuestion extends ItemQuestion {

    coding = ConsentCoding;

    constructor(props: ItemProps) {
        super(props, 'Q1');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.consent.Q1.title", "Do you want to participate in this study?"),
            topDisplayCompoments: [
                markdownComponent({
                    key: "text",
                    content: _T("heatwave.consent.Q1.text", CONSENT_TEXT_EN),
                }),
            ],
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses(),
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def(this.coding.yes, _T("heatwave.consent.Q1.code.yes", "Yes, I understand the rules and accept to participate in the survey")),
            option_def(this.coding.no, _T("heatwave.consent.Q1.code.no", "No / I want to withdraw")),
        ];
    }

    responseConditionYes(): Expression {
        return ClientExpression.singleChoice.any(this.key, this.coding.yes);
    }
}
