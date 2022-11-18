
const CovidVaccindeBrands = {
        "pfizer": "1", // Pfizer/BioNtech
        "moderna": "2",
        "astrazeneca": "3", // AstraZeneca
        "janssen": "4",
        "dontknow": "99"
} as const;

const CovidReasonNotVaccinated = {
    "plan": "0",
    "notproposed": "1",
    "pregnant_disc": "15",
    "pregnant_fear": "16",
    "notriskgroup": "2",
    "natural_immunity": "3",
    "doubt_efficacy": "4",
    "benign": "5",
    "avoid_health_facilities": "17",
    "unlikely": "6",
    "cause_covid": "7",
    "adverse_event": "8",
    "dontlike": "9",
    "accessible": "10",
    "disagree": "20",
    "not_free": "11",
    "dontknow": "12",
    "other": "14",
    "counter_indication": '18', // Code used in France (2022)
    "bad_experience": '19',// Code used in France (2022)
} as const;


export const VaccinationResponses = {

    vacstart: {
        'nothing_changed': '2'
    },
    flu_vaccine_season: {
        'yes': '0',
        'no': '1',
    },
    flu_vaccine_last: {
        'yes': '0',
        'no':'1'
    },
    // Q10c
    flu_vac_reason: {
        "riskgroup": "0",
        "myrisk": "1",
        "spread": "2",
        "doctor": "3",
        "work": "4",
        "available": "5",
        "free": "6",
        "miss": "7",
        "always": "8",
        "other": "9",
        "covid19": "12",

        /* Reserved codes (historically used in France) */
        "voucher": "10", // I have a voucher to get vaccinated, provided by National Health Service
        "pregnant_baby": "11", // I'm pregnant and I want to protect my baby
    },
    // Q10d
    flu_notvac_reason: {
        "plan": "0",
        "offer": "1",
        "risk_group": "2",
        "own_immunity": "3",
        "doubt": "4",
        "minor_illness": "5",
        "unlikely": "6", // I'm not likely to
        "cause_flu": "7",
        "safety": "8",
        "vaccine": "9", // Dont like vaccine
        "not_available": "10",
        "free": "11",
        "no_reason": "12",
        "doctor": "13",
        "other": "14",

        // Reserved codes use in French platform
        "advised_pregnancy": "15", // Advised not to get vaccination because of pregnancy
        "pregnant_baby": "16", // Pregnant and fear for the baby
        "avoid_healthseek": "17", // Because of covid I avoid to get to doctor or to pharmacy
        "risk_covid": "18", // Fear about the flu shot increase the risk of getting the covid
        "covid_other": "19", // Other reason related to covid
        "bad_experience": "20" // Introduced in 2022 in France
    },
    covid_vac: {
        'yes': '1',
        'no': '0',
        'dontknow':'2'
    },
    covid_vac_shots: {
        'one': '1',
        "two": "2",
        "more_2": "3",
        "three": "4",
        "more_3": "5", // Survey modifications
        'dontknow': '99',
    },

    covid_notvac_reason: CovidReasonNotVaccinated,

    covid_vac_brands: CovidVaccindeBrands,

} as const;
