import { _T } from "../../common/languages"
import { OptionDef } from "case-editor-tools/surveys/types";
import { SurveyItems } from 'case-editor-tools/surveys';
import { ItemQuestion, ClientExpression, ItemProps, num_as_arg } from "../../../tools";
import { Expression, SurveyItem } from "survey-engine/data_types";
import { as_input_option, option_def, option_input_other, make_exclusive_options } from "../../../tools/options";
import { HeatSymptoms } from "./symptoms";

/*
Q10 What was the highest temperature recorded inside your home over the past week?
    - [number between 15 and 45]
    - I don't know
*/
export class HighestHomeTemperature extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q10');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q10.title", "What was the highest temperature recorded inside your home over the past week?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def('temp', _T("heatwave.Q10.code.temp", "Temperature (°C)"), {
                role: 'numberInput',
                optionProps: { min: num_as_arg(15), max: num_as_arg(45) }
            }),
            option_def('dnk', _T("heatwave.common.dkn", "I don't know", "heatwave.Q10.code.dnk")),
        ];
    }
}

/*
Q11 What was the lowest temperature recorded inside your home over the past week?
    - [number between 15 and 45]
    - I don't know
*/
export class LowestHomeTemperature extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q11');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q11.title", "What was the lowest temperature recorded inside your home over the past week?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def('temp', _T("heatwave.Q11.code.temp", "Temperature (°C)"), {
                role: 'numberInput',
                optionProps: { min: num_as_arg(15), max: num_as_arg(45) }
            }),
            option_def('dnk', _T("heatwave.common.dkn", "I don't know", "heatwave.Q11.code.dnk")),
        ];
    }
}

/*
Q12 During daylight hours, which location did you spend the most time in this past week?
    ○ Home
    ○ Work/School
    ○ Holiday destination (open field for the closest municipality)
    ○ Other (open field)
    ○ Don't know
*/
export class DaytimeLocation extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q12');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q12.title", "During daylight hours, which location did you spend the most time in this past week?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def('1', _T("heatwave.Q12.code.home", "Home")),
            option_def('2', _T("heatwave.Q12.code.work", "Work/School")),
            as_input_option('3', _T("heatwave.Q12.code.holiday", "Holiday destination"), _T("heatwave.Q12.code.holiday_desc", "Closest municipality")),
            option_input_other('4', _T("heatwave.Q12.code.other", "Other", "heatwave.common.other"), "heatwave.Q12.code.other_desc"),
            option_def('dnk', _T("heatwave.common.dkn", "Don't know", "heatwave.Q12.code.dnk")),
        ];
    }
}

/*
Q13 How uncomfortable were you because of the hot weather this past week during the day?
    ○ Not at all
    ○ A little
    ○ Quite
    ○ Very
    ○ Extremely
*/
export class DaytimeDiscomfort extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q13');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q13.title", "How uncomfortable (e.g. intense sweat, exhaustion, etc.) were you because of the hot weather this past week during the day?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def('1', _T("heatwave.discomfort.not_at_all", "Not at all", "heatwave.Q13.code.not_at_all")),
            option_def('2', _T("heatwave.discomfort.a_little", "A little", "heatwave.Q13.code.a_little")),
            option_def('3', _T("heatwave.discomfort.quite", "Quite", "heatwave.Q13.code.quite")),
            option_def('4', _T("heatwave.discomfort.very", "Very", "heatwave.Q13.code.very")),
            option_def('5', _T("heatwave.discomfort.extremely", "Extremely", "heatwave.Q13.code.extremely")),
        ];
    }
}

/*
Q14 During night hours, which location did you spend the most time in this past week?
    ○ Home
    ○ Holiday destination (open field for the closest municipality)
    ○ Other (open field)
    ○ Don't know
*/
export class NighttimeLocation extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q14');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q14.title", "During night hours, which location did you spend the most time in this past week?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def('1', _T("heatwave.Q14.code.home", "Home")),
            as_input_option('3', _T("heatwave.Q14.code.holiday", "Holiday destination"), _T("heatwave.Q14.code.holiday_desc", "Closest municipality")),
            option_input_other('4', _T("heatwave.Q14.code.other", "Other", "heatwave.common.other"), "heatwave.Q14.code.other_desc"),
            option_def('dnk', _T("heatwave.common.dkn", "Don't know", "heatwave.Q14.code.dnk")),
        ];
    }
}

/*
Q15 How uncomfortable were you because of the temperature this past week during the night?
    ○ Not at all / A little / Quite / Very / Extremely
*/
export class NighttimeDiscomfort extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q15');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q15.title", "How uncomfortable (intense sweat, exhaustion, etc.) were you because of the temperature this past week during the night?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def('1', _T("heatwave.discomfort.not_at_all", "Not at all", "heatwave.Q15.code.not_at_all")),
            option_def('2', _T("heatwave.discomfort.a_little", "A little", "heatwave.Q15.code.a_little")),
            option_def('3', _T("heatwave.discomfort.quite", "Quite", "heatwave.Q15.code.quite")),
            option_def('4', _T("heatwave.discomfort.very", "Very", "heatwave.Q15.code.very")),
            option_def('5', _T("heatwave.discomfort.extremely", "Extremely", "heatwave.Q15.code.extremely")),
        ];
    }
}

/*
Q16 Did you experience any symptoms due to high/extreme heat this past week?
    ○ No
    □ Extreme thirst
    □ Dizziness / light headedness
    □ Fainting / collapsing
    □ Too hot to sleep
    □ Feeling confused / couldn't think properly
    □ Muscle twitches / cramping
    □ Lack of coordination / difficulty with movement
    □ Racing heartbeat
    ○ Don't know
*/
export class WeeklyHeatSymptoms extends HeatSymptoms {
    constructor(props: ItemProps) {
        super(props, 'Q16', _T("heatwave.Q16.title", "Did you experience any symptoms due to high/extreme heat this past week?"));
    }
}

/*
Q16a [If any Q16 other than No or Don't know] Did you seek health care to manage your symptoms?
    ○ No
    □ Yes, from a pharmacy
    □ Yes, from a medical centre
    □ Yes, from a hospital
    □ Yes, through a telephone or online health advice service
    □ Other (____)
*/
export class SoughtHealthCare extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q16a');
    }

    buildItem(): SurveyItem {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q16a.title", "Did you seek health care to manage your symptoms?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        const options = [
            option_def('0', _T("heatwave.common.no", "No", "heatwave.Q16a.code.no")),
            option_def('1', _T("heatwave.Q16a.code.pharmacy", "Yes, from a pharmacy")),
            option_def('2', _T("heatwave.Q16a.code.medical_centre", "Yes, from a medical centre")),
            option_def('3', _T("heatwave.Q16a.code.hospital", "Yes, from a hospital")),
            option_def('4', _T("heatwave.Q16a.code.telephone", "Yes, through a telephone or online health advice service")),
            option_input_other('5', _T("heatwave.Q16a.code.other", "Other", "heatwave.common.other"), "heatwave.Q16a.code.other_desc"),
        ];
        make_exclusive_options(this.key, options, ['0']);
        return options;
    }
}

/*
Q17 Did extreme heat alter your routine/quality of life this past week?
    ○ No
    □ I could not work
    □ I had to work from home
    □ I canceled some activities (other than work) for the day
    □ I didn't work from home as usual but went to the office/location with AC because of AC
    □ changed the time when I go to work/everyday activities
    □ went to work but couldn't concentrate
    □ Other (_____)
*/
export class RoutineImpact extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q17');
    }

    buildItem(): SurveyItem {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q17.title", "Did extreme heat alter your routine/quality of life this past week?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        const options = [
            option_def('0', _T("heatwave.common.no", "No", "heatwave.Q17.code.no")),
            option_def('1', _T("heatwave.Q17.code.could_not_work", "I could not work")),
            option_def('2', _T("heatwave.Q17.code.work_from_home", "I had to work from home")),
            option_def('3', _T("heatwave.Q17.code.canceled", "I canceled some activities (other than work) for the day")),
            option_def('4', _T("heatwave.Q17.code.went_to_ac", "I didn't work from home as usual but went to the office/location with AC because of AC")),
            option_def('5', _T("heatwave.Q17.code.changed_time", "Changed the time when I go to work/everyday activities")),
            option_def('6', _T("heatwave.Q17.code.couldnt_concentrate", "Went to work but couldn't concentrate")),
            option_input_other('7', _T("heatwave.Q17.code.other", "Other", "heatwave.common.other"), "heatwave.Q17.code.other_desc"),
        ];
        make_exclusive_options(this.key, options, ['0']);
        return options;
    }
}

/*
Q17a [to ask only if Q16 different from No] Were you absent from work/normal activities due to your symptoms this past week?
    ○ No
    ○ Yes, for 1 day or less
    ○ Yes, for more than 1 day
*/
export class AbsentFromWork extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q17a');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q17a.title", "Were you absent from work/normal activities due to your symptoms this past week?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def('0', _T("heatwave.common.no", "No", "heatwave.Q17a.code.no")),
            option_def('1', _T("heatwave.Q17a.code.max1day", "Yes, for 1 day or less")),
            option_def('2', _T("heatwave.Q17a.code.more1day", "Yes, for more than 1 day")),
        ];
    }
}

/*
Q18 What actions did you take this past week to protect yourself from heat? (select all that apply)
□  	Removed layer/s of clothing
□  	Frequently drank water
□  	Stayed inside and closed all window shutters and curtains 
□  	Went to a park 
□  	Had recurrent showers/baths
□  	Went for a swim (e.g. pool, river, lake, sea, etc)
□  	Sprayed/splashed myself with water
□  	Turned on fan
□  	Turned on air-conditioning
□  	Went to a supermarket with air conditioning
□  	Went to a museum or library with air conditioning
□  	Went to a a cooler location in town (e.g., friend’s house)
□  	Went to a cooler location out of town (e.g. mountain, lake, seaside)
□  	Slept in another room (cooler) at my living place
□  	Other (____)
□ 	None

*/
export class ProtectiveActions extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q18');
    }

    buildItem(): SurveyItem {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q18.title", "What actions did you take this past week to protect yourself from heat?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        const options = [
            option_def('1', _T("heatwave.Q18.code.removed_layers", "Removed layer/s of clothing")),
            option_def('2', _T("heatwave.Q18.code.drank_water", "Frequently drank water")),
            option_def('3', _T("heatwave.Q18.code.closed_shutters", "Stayed inside and closed all window shutters and curtains")),
            option_def('4', _T("heatwave.Q18.code.park", "Went to a park")),
            option_def('5', _T("heatwave.Q18.code.showers", "Had recurrent showers/baths")),
            option_def('6', _T("heatwave.Q18.code.swim", "Went for a swim (e.g. pool, river, lake, sea, etc.)")),
            option_def('7', _T("heatwave.Q18.code.splashed", "Sprayed/splashed myself with water")),
            option_def('8', _T("heatwave.Q18.code.fan", "Turned on fan")),
            option_def('9', _T("heatwave.Q18.code.ac", "Turned on air-conditioning")),
            option_def('10', _T("heatwave.Q18.code.supermarket", "Went to a supermarket with air conditioning")),
            option_def('11', _T("heatwave.Q18.code.museum", "Went to a museum or library with air conditioning")),
            option_def('12', _T("heatwave.Q18.code.cooler_in_town", "Went to a cooler location in town (e.g. friend's house)")),
            option_def('13', _T("heatwave.Q18.code.cooler_out_town", "Went to a cooler location out of town (e.g. mountain, lake, seaside)")),
            option_def('14', _T("heatwave.Q18.code.another_room", "Slept in another room (cooler) at my living place")),
            option_input_other('15', _T("heatwave.Q18.code.other", "Other", "heatwave.common.other"), "heatwave.Q18.code.other_desc"),
            option_def('0', _T("heatwave.common.none", "None", "heatwave.Q18.code.none")),
        ];
        make_exclusive_options(this.key, options, ['0']);
        return options;
    }
}

/*
Q19 Have you accessed a climate shelter this past week?
    ○ A public building open all year round (library, museum, etc.)
    ○ A public building open specifically because of the heat
    ○ A private leisure venue (cinema, etc.)
    ○ A shop / shopping centre
    ○ Other (____)
    ○ No
*/
const ClimateShelterCoding = {
    all_year: '1',
    heat: '2',
    leisure: '3',
    shop: '4',
    other: '5',
    no: '0',
} as const;

export class ClimateShelter extends ItemQuestion {

    coding = ClimateShelterCoding;

    constructor(props: ItemProps) {
        super(props, 'Q19');
    }

    buildItem(): SurveyItem {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q19.title", "Have you accessed a climate shelter this past week?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        const c = this.coding;
        const options = [
            option_def(c.all_year, _T("heatwave.Q19.code.all_year", "A public building open all year round (library, museum, etc.)")),
            option_def(c.heat, _T("heatwave.Q19.code.heat", "A public building open specifically because of the heat")),
            option_def(c.leisure, _T("heatwave.Q19.code.leisure", "A private leisure venue (cinema, etc.)")),
            option_def(c.shop, _T("heatwave.Q19.code.shop", "A shop / shopping centre")),
            option_input_other(c.other, _T("heatwave.Q19.code.other", "Other", "heatwave.common.other"), "heatwave.Q19.code.other_desc"),
            option_def(c.no, _T("heatwave.common.no", "No", "heatwave.Q19.code.no")),
        ];
        make_exclusive_options(this.key, options, [c.no]);
        return options;
    }

    responseConditionNo(): Expression {
        return ClientExpression.multipleChoice.any(this.key, this.coding.no);
    }
}

/*
Q19a [if Q19 No] What are the reasons?
    ○ It is too far/hard to reach
    ○ It is too crowded
    ○ there are no climate shelters nearby
    ○ No, I have mobility issues and cannot go
    ○ Other (____)
*/
export class ClimateShelterNoReason extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q19a');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q19a.title", "What are the reasons for not accessing a shelter?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def('1', _T("heatwave.Q19a.code.too_far", "It is too far/hard to reach")),
            option_def('2', _T("heatwave.Q19a.code.too_crowded", "It is too crowded")),
            option_def('3', _T("heatwave.Q19a.code.none_nearby", "There are no climate shelters nearby")),
            option_def('4', _T("heatwave.Q19a.code.mobility", "I have mobility issues and cannot go")),
            option_input_other('5', _T("heatwave.Q19a.code.other", "Other", "heatwave.common.other"), "heatwave.Q19a.code.other_desc"),
        ];
    }
}

/*
Q20 Did you use public transport this past week?
    ○ Yes, more than usual
    ○ Yes, as usual
    ○ Yes, less than usual
    ○ No, but I usually use them
    ○ No, I don't usually use them
    ○ No (other reasons)
*/
const PublicTransportCoding = {
    yes_more: '1',
    yes_usual: '2',
    yes_less: '3',
    no_but_usually: '4',
    no_not_usually: '5',
    no_other: '6',
} as const;

export class PublicTransport extends ItemQuestion {

    coding = PublicTransportCoding;

    constructor(props: ItemProps) {
        super(props, 'Q20');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q20.title", "Did you use public transport this past week?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        const c = this.coding;
        return [
            option_def(c.yes_more, _T("heatwave.Q20.code.yes_more", "Yes, more than usual")),
            option_def(c.yes_usual, _T("heatwave.Q20.code.yes_usual", "Yes, as usual")),
            option_def(c.yes_less, _T("heatwave.Q20.code.yes_less", "Yes, less than usual")),
            option_def(c.no_but_usually, _T("heatwave.Q20.code.no_but_usually", "No, but I usually use them")),
            option_def(c.no_not_usually, _T("heatwave.Q20.code.no_not_usually", "No, I don't usually use them")),
            option_def(c.no_other, _T("heatwave.Q20.code.no_other", "No (other reasons)")),
        ];
    }

    responseConditionYes(): Expression {
        const c = this.coding;
        return ClientExpression.singleChoice.any(this.key, c.yes_more, c.yes_usual, c.yes_less);
    }
}

/*
Q20a [if Q20 Yes] Did it have air-conditioning onboard?
    ○ Yes
    ○ No
    ○ Yes but it was out of order
*/
export class PublicTransportAirConditioning extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q20a');
    }

    buildItem(): SurveyItem {
        return SurveyItems.singleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q20a.title", "Did it have air-conditioning onboard?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        return [
            option_def('1', _T("heatwave.common.yes", "Yes", "heatwave.Q20a.code.yes")),
            option_def('0', _T("heatwave.common.no", "No", "heatwave.Q20a.code.no")),
            option_def('2', _T("heatwave.Q20a.code.out_of_order", "Yes but it was out of order")),
        ];
    }
}

/*
Q21 Did you or your area experience any disruption related to heat during the past week?
□ Blackouts / Wildfires / Water shortages / Droughts / Transit delays / Damages / Transport issues / Other (____) / None of these
*/
export class HeatDisruption extends ItemQuestion {

    constructor(props: ItemProps) {
        super(props, 'Q21');
    }

    buildItem(): SurveyItem {
        return SurveyItems.multipleChoice({
            parentKey: this.parentKey,
            itemKey: this.itemKey,
            isRequired: this.isRequired,
            condition: this.condition,
            questionText: _T("heatwave.Q21.title", "Did you or your area experience any disruption related to heat during the past week?"),
            helpGroupContent: this.getHelpGroupContent(),
            responseOptions: this.getResponses()
        });
    }

    getResponses(): OptionDef[] {
        const options = [
            option_def('1', _T("heatwave.Q21.code.blackouts", "Blackouts")),
            option_def('2', _T("heatwave.Q21.code.wildfires", "Wildfires")),
            option_def('3', _T("heatwave.Q21.code.water_shortages", "Water shortages")),
            option_def('4', _T("heatwave.Q21.code.droughts", "Droughts")),
            option_def('5', _T("heatwave.Q21.code.transit_delays", "Transit delays")),
            option_def('6', _T("heatwave.Q21.code.damages", "Damages at my or others' homes")),
            option_def('7', _T("heatwave.Q21.code.transport_issues", "Transport issues")),
            option_input_other('8', _T("heatwave.Q21.code.other", "Other", "heatwave.common.other"), "heatwave.Q21.code.other_desc"),
            option_def('0', _T("heatwave.common.none", "None", "heatwave.Q21.code.none")),
        ];
        make_exclusive_options(this.key, options, ['0']);
        return options;
    }
}
