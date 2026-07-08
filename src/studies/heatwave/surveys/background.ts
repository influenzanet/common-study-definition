import { _T } from "../../common/languages"
import { ClientExpression as ce, SurveyBuilder } from "../../../tools";
import * as questions from "../questions/background";

export class HeatwaveBackgroundSurveyBuilder extends SurveyBuilder {

    constructor() {
        super({
            surveyKey: 'heatback',
            name: _T( "heatwave.background.name", "Heatwave Background survey"),
            description: _T(
                "heatwave.background.description",
                 "Heatwave background survey description",
            ),
            durationText: _T(
                "heatwave.background.typicalDuration", "Duration 5-10 minutes"
            )
        });

        this.items = [];

        const rootKey = this.key;

        const defaultRequired = true;

        const Q1 = new questions.RentalAccomodation({'parentKey': rootKey, isRequired: defaultRequired});

        this.items.push(Q1);

        const Q2 = new questions.DescribeHousing({'parentKey': rootKey, isRequired: defaultRequired});
        this.items.push(Q2);

        const Q3 = new questions.DirectSunriseInsolation({'parentKey': rootKey, isRequired: defaultRequired});
        this.items.push(Q3);

        const QAirConditionner = new questions.AirConditionning({'parentKey': rootKey, isRequired: defaultRequired});
        this.items.push(QAirConditionner);
        const hasAirConditioner = QAirConditionner.responseConditionYes();

        const Q5 = new questions.AirConditionnerUsage({'parentKey': rootKey, isRequired: defaultRequired});
        Q5.setCondition(hasAirConditioner);
        this.items.push(Q5);

        const Q6 = new questions.AirConditionnerWork({'parentKey': rootKey, isRequired: defaultRequired});
        this.items.push(Q6);

        const Q7 = new questions.HowManyHoursTooHot({'parentKey': rootKey, isRequired: defaultRequired});
        this.items.push(Q7);
    }
}