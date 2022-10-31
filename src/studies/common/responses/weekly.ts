
const symptomsEncoding = {
    no_symptom: '0',
    fever: '1',
    "chills": "2",
    "rhino": "3",
    "sneeze": "4",
    "sorethroat": "5",
    "cough": "6",
    "dyspnea": "7",
    "headache": "8",
    "pain": "9",
    "chestpain": "10",
    "asthenia": "11",
    "anorexia": "12",
    "sputum": "13",
    "wateryeye": "14",
    "nausea": "15",
    "vomiting": "16",
    "diarrhea": "17",
    "abdopain": "18",
    "loss_smell": "23",
    "loss_taste": "21",
    "nose_bleed": "22",
    "rash": "20",
    "other": "19"
} as const;

const TookMedicationCodes = {
    "no": "0",
    "pain": "1",
    "cough": "2",
    "antiviral": "3",
    "antibio": "4",
    "homeo": "7",
    "alternative": "8",
    "other": "5",
    "dontknow": "6"
} as const;

const CovidHabitsChangesCodes = {

    "wash_hands": "1",
    "cough_elbow": "2",
    "use_tissue": "3",
    
    "wear_mask": "4a",
    "wear_mask_home": "4b",
    
    // In standard and use in France
    "wear_mask_french": "4",
    "wear_mask_home_french": "17",
    
    "avoid_shakehands": "5",
    
    "stop_hug": "11",

    "public_transport": "6",
    
    "avoid_gathering": "7",

    "stay_home": "8",

    "telework": "9",

    "avoid_travel": "10",

    "food_delivered": "13",
   
    "isolate_home": "18",

    "avoid_friends": "14",

    "avoid_at_risk": "15",

    "avoid_children": "16",

    "none": "12"

} as const;


export type SymptomKeysType =  keyof typeof symptomsEncoding;

export const WeeklyResponses = {
    symptoms: symptomsEncoding,
    same_illness: {
        'yes': '0',
        'no': '1',
        'dontknow': '2',
        'notapply': '9'
    },
    symptoms_start: {
        'date_input': '0',
        'dont_know': '1'
    },
    pcr_contacts: {
        'yes': '1',
        'no': '0',
        'dont_know': '2',
    },
    measure_temp: {
        'yes': '0',
        'no':'1',
        'dont_know': '2'
    },
    consent_more: {
        "yes": "1",
        "no": "0"
    },
    took_medication: TookMedicationCodes,
    symptom_test: {
        "yes": "1",
        "not_yet": "2",
        "no_wont": "3",
        "no": "0"
    },
    test_type: {
        "pcr": "1",
        "sero": "2",
        "antigenic": "3",
        "antigenic_nasal": "4"
    },
    flu_test: {
        "yes": "1",
        "yes_antigenic": "5",
        "plan": "3",
        "wontgo": "4",
        "no": "0"
    },
    visit_medical: {
        "no": "0",
        "gp": "1",
        "hospital": "2",
        "emergency": "3",
        "other": "4",
        "plan": "5"
    },
    daily_routine: {
        "no": "0",
        "yes": "1",
        "off": "2"
    },
    covid_habits: CovidHabitsChangesCodes
} as const;
