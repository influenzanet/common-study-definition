import { _T } from "../../common/languages"
import { OptionDef } from "case-editor-tools/surveys/types";
import { SurveyItems } from 'case-editor-tools/surveys';
import { ItemQuestion, ClientExpression, ItemProps } from "../../../tools";
import { Expression, SurveyItem } from "survey-engine/data_types";
import { as_input_option, option_def } from "../../../tools/options";
import { HeatSymptoms } from "./symptoms";

/*
Do you live in rental accommodation?
○  	Yes
○  	No
○  	Don’t know
*/
export class RentalAccomodation extends ItemQuestion {

    constructor(props:ItemProps) {
        super(props, 'Q1');
    }

    buildItem():SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q1.title", "Do you live in rental accommodation?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    

    getResponses():OptionDef[] {
        return [
                {
                key: '1', role: 'option',
                content: _T("heatwave.common.yes", "Yes")
            },
            {
                key: '0', role: 'option',
                content: _T("heatwave.common.no", "No")
            },
            {
                key: '2', role: 'option',
                content: _T("heatwave.common.dkn", "I don't know/can't remember")
            },
        ];
    }
}

/*
Q2 What best describes your current housing?
○  	1 Separate house
○  	2 Semi-detached / row or terrace house / historic attached home
○  	3 Flat / Apartment
○  	4 Cabin / Caravan / Houseboat
○  	5 Other
*/
export class DescribeHousing extends ItemQuestion {

    constructor(props:ItemProps) {
        super(props, 'Q2');
    }

    buildItem():SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q2.title", "What best describes your current housing?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {
        
        return [
            option_def('1', _T('heatwave.Q2.code.separate', "Separate house")),
            option_def('2', _T('heatwave.Q2.code.semidetached', "Semi-detached / row or terrace house / historic attached home")),
            option_def('3', _T('heatwave.Q2.code.flat', "Flat / Apartment")),
            option_def('4', _T('heatwave.Q2.code.cabin', "Cabin / Caravan / Houseboat")),
            as_input_option('5', _T('heatwave.Q2.code.other', "Other", "heatwave.common.other"), _T("heatwave.Q2.code.other_description", "")),
        ];
    }
}

/*
Q3 How many hours (approximately) of direct sunlight does your house receive currently?
○ 0    0
○  1	0-6h (half a day)
○  2	6-12h (full day)
○  3	Don’t know
*/
export class DirectSunriseInsolation extends ItemQuestion {

    constructor(props:ItemProps) {
        super(props, 'Q3');
    }

    buildItem():SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q3.title", "How many hours (approximately) of direct sunlight does your house receive currently?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {
       return [ 
        option_def('0', _T("heatwave.Q3.code.0", "0")),
        option_def('1',	_T("heatwave.Q3.code.half", "0-6h (half a day)")),
        option_def('2',	_T("heatwave.Q3.code.full", "6-12h (full day)")),
        option_def('3',	_T("heatwave.Q3.code.dnk", "Don’t know")),
        ];
    }
}

/*
Q4 Do you have air-conditioning in your current housing?
○  1	Yes
○  0	No
○  2	Don’t know
*/

const AirConditionningCoding = {
    'yes': '1',
    'no': '0',
    'dnk': '2'
} as const;

export class AirConditionning extends ItemQuestion {

    coding = AirConditionningCoding;

    constructor(props:ItemProps) {
        super(props, 'Q4');
    }

    buildItem():SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q4.title", "Do you have air-conditioning in your current housing?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {
        return [ 
        option_def(this.coding.yes, _T('heatwave.common.yes', "Yes", "heatwave.Q3.code.yes")),
        option_def(this.coding.no,  _T('heatwave.common.no', "No", "heatwave.Q3.code.no")),
        option_def(this.coding.dnk, _T('heatwave.common.yes', "Don’t know", "heatwave.Q3.code.dnk")),
        ];
    }

    responseConditionYes(): Expression {
        return ClientExpression.singleChoice.any(this.key, this.coding.yes);
    }
}

/*
[if Yes] Q5 How often do you use it on hot days (> 30 degrees)?
○  1	Always
○  2	Often
○  3	Sometimes
○  4	Never
*/
export class AirConditionnerUsage extends ItemQuestion {

    constructor(props:ItemProps) {
        super(props, 'Q5');
    }

    buildItem():SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q5.title", "How often do you use it on hot days (> 30 degrees)"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {
        return [ 
            option_def('1',	_T("heatwave.Q5.code.always", "Always")),
            option_def('2',	_T("heatwave.Q5.code.often", "Often")),
            option_def('3',	_T("heatwave.Q5.code.sometimes", "Sometimes")),
            option_def('4',	_T("heatwave.Q5.code.never", "Never ")),
        ];
    }
}

/*
Q6 Do you have air-conditioning in your current workplace/school?
○  	1 Yes
○  	0 No
○  	2 I work outdoors
○  	3 Don’t know
*/
export class AirConditionnerWork extends ItemQuestion {

    constructor(props:ItemProps) {
        super(props, 'Q6');
    }

    buildItem():SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q6.title", "Do you have air-conditioning in your current workplace/school?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {
        return [ 
            option_def('1', _T('heatwave.common.yes', "Yes", "heatwave.Q6.code.yes")),
            option_def('0',  _T('heatwave.common.no', "No", "heatwave.Q6.code.no")),
            option_def('2',  _T('heatwave.Q6.code.outdoors', "I work outdoors")),
            option_def('3', _T('heatwave.common.dnk', "Don’t know", "heatwave.Q6.code.dnk")),
        ];
    }
}

/*
Q7 In a typical summer week, approximately how many hours do you feel too hot while working, doing household activities or carrying out other daily activities (including at home)?
○  	Less than 1 hour
○  	Between 1-10 hours
○  	Between 10-40 hours
○  	More than 40 hours
*/
export class HoursTooHotWorking extends ItemQuestion {

    constructor(props:ItemProps) {
        super(props, 'Q7');
    }

    buildItem():SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q7.title", "In a typical summer week, approximately how many hours do you feel too hot while working, doing household activities or carrying out other daily activities (including at home)?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {
        return [ 
            option_def('1', _T("heatwave.Q7.codes.less1h", "Less than 1 hour")),
            option_def('2', _T("heatwave.Q7.codes.1_10", "Between 1-10 hours")),
            option_def('3', _T("heatwave.Q7.codes.10_40", "Between 10-40 hours")),
            option_def('4', _T("heatwave.Q7.codes.over40", "More than 40 hours")),
         ];
    }
}

export class HoursTooHotExercising extends ItemQuestion {

    constructor(props:ItemProps) {
        super(props, 'Q8');
    }

    buildItem():SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q8.title", "In a typical summer week, approximately how many hours do you feel too hot while exercising, or doing other more intense/strenuous daily activities?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses():OptionDef[] {
        // Nota translation are from Q7 translation key since responses are intented to be the same
        return [ 
            option_def('1', _T("heatwave.Q7.codes.less1h", "Less than 1 hour")),
            option_def('2', _T("heatwave.Q7.codes.1_10", "Between 1-10 hours")),
            option_def('3', _T("heatwave.Q7.codes.10_40", "Between 10-40 hours")),
            option_def('4', _T("heatwave.Q7.codes.over40", "More than 40 hours")),
         ];
    }
}

export class LastSummerSymptoms extends HeatSymptoms {
    constructor(props: ItemProps) {
        super(props, "Q9", _T("heatwave.Q9.title", "Have you experienced any symptoms due to high/extreme heat during the summer of 2025 and first part of 2026?"));
    }
}