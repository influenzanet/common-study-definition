export const IntakeResponses = {
    gender: {
        'male':  '0',
        'female': '1',
        'other': '2',
        'dontwant': '3', // Dont want to answer, use in France from 2023
    } as const,
    birthDate: {
        'date': '1',
    },
    // Q12 Pregnancy
    pregnancy: {
        'yes': '0',
        "no": "1",
        "dontknow": "2"
    },
    // Q5 contact with people
    contact_people: {
        "children": "0",
        "elder": "1",
        "patient": "2",
        "crowd": "3",
        "none": "4"
        // "5" used in FR
    } as const,
    main_activity: {
        "fulltime": "0",
        "partial": "1",
        "self": "2",
        "student": "3",
        "home": "4",
        "unemployed": "5",
        "sick": "6",
        "retired": "7",
        "other": "8"
    } as const,
    working_type: {
        service_worker: '2',
        craft_worker: '3',
        army_worker: '6', 
        manager: '7', 
        professional: '8',
        technician: '9',
        clerical: '10',
        agriculture: '11',
        operator: '12', // "Plant and machine operators and assemblers
        elementary: '13', //  Elementary occupations
        other: '5',
    } as const, 

    // Q7 Mean of Transport
    transport: {
        "walk": "0",
        "bike": "1",
        "scooter": "2",
        "car": "3",
        "public": "4",
        "other": "5"
    } as const,
    // Q8 Common colde frequency
    cold_frequency: {
        "never": "0",
        "once": "1",
        "times_3": "2",
        "times_6": "3",
        "times_10": "4",
        "dontknow": "5"
        // 6 used in France (sometimes, not every year)
    } as const,
    // Q11 Condition
    condition: {
        "none": "0",
        "asthma": "1",
        "diabetes": "2",
        "lung": "3",
        "heart": "4",
        "kidney": "5",
        "immuno": "6",
        "noanswer": "7"
    } as const,

    find_about: {
        "radio": "0",
        "newspaper": "1",
        "internet": "2",
        "poster": "3",
        "family": "4",
        "work": "5",
        "other": "99",
        // French specific codes
        "healthworker": "6", // French Code
        "project": "7", // French Code
        "webinstit": "8", // French Code
        "webinfo": "9", // French Code
        "webhealth": "10", // French Code
        "social": "12", // French Code
        "other_alt":"13" // 13 code is used as "other" in historical French surveys
    } as const,
    "smoking": {
        "no": "0",
        "occas": "1",
        "daily_few": "2",
        "daily_more": "3",
        "dontknow": "4"
    } as const,
    allergy: {
        "hay": "1",
        "dust": "2",
        "pets": "3",
        "other": "4",
        "none": "5"
    } as const
} as const;
