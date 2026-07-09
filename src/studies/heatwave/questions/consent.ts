import { _T } from "../../common/languages"
import { OptionDef } from "case-editor-tools/surveys/types";
import { SurveyItems } from 'case-editor-tools/surveys';
import { ItemQuestion, ClientExpression, ItemProps } from "../../../tools";
import { Expression, SurveyItem } from "survey-engine/data_types";
import { option_def } from "../../../tools/options";
import { markdownComponent } from "../../../compat";

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
            questionText: _T("heatwave.consent.Q1.title", "Do you consent to take part in the heatwave surveys?"),
            topDisplayCompoments: [
                markdownComponent({
                    key: "text",
                    content: _T(
                        "heatwave.consent.Q1.text",
                        "Bla bla bla, Please read the [information sheet](https://influweb.org/privacy) for more information",
                    ),
                }),
            ],
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses(),
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def(this.coding.yes, _T("heatwave.common.yes", "Yes", "heatwave.consent.Q1.code.yes")),
            option_def(this.coding.no, _T("heatwave.common.no", "No", "heatwave.consent.Q1.code.no")),
        ];
    }

    responseConditionYes(): Expression {
        return ClientExpression.singleChoice.any(this.key, this.coding.yes);
    }
}
