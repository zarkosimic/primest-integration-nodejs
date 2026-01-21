const { VALUE_TRANSLATIONS, ALLOWED_VALUES, DEFAULTS } = require('../config/mapping');

const extractNumber = (val) => {
    if (typeof val === 'number') return val;
    const numbers = val.match(/\d+/g);
    if (!numbers) return 0;
    if (numbers.length > 1) {
        return Math.round((parseInt(numbers[0]) + parseInt(numbers[1])) / 2);
    }
    return parseInt(numbers[0]);
};

const splitStreetAndNumber = (fullStreet = "") => {
    const match = fullStreet.match(/^(.+?)\s?(\d+[a-z]?)$/i);
    return {
        streetName: match ? match[1].trim() : fullStreet,
        houseNumber: match ? match[2].trim() : ""
    };
};

const validateOrFallback = (value, allowedArray, fallback) => {
    return allowedArray.includes(value) ? value : fallback;
};

const mapAttributes = (questions) => {
    
    const rawRoofAge = (questions["Wie alt ist Ihr Dach?"] || "").replace("solar_", "");
    const translatedRoofAge = VALUE_TRANSLATIONS.roof_age[rawRoofAge] || "Jünger als 30 Jahre";

    return {
        "solar_energy_consumption": extractNumber(questions["Wie hoch schätzen Sie ihren Stromverbrauch?"]),
        "solar_area": extractNumber(questions["Dachfläche"] || "0"),
        
        "solar_owner": validateOrFallback(questions["Sind Sie Eigentümer der Immobilie?"], ["Ja", "Nein", "In Auftrag"], "Ja"),
        
        "solar_property_type": validateOrFallback(
            questions["Wo möchten Sie die Solaranlage installieren?"], 
            ALLOWED_VALUES.property_type, 
            DEFAULTS.PROPERTY_TYPE
        ),
        
        "solar_roof_type": validateOrFallback(
            questions["Welche Dachform haben Sie na Ihrem Haus?"], 
            ALLOWED_VALUES.roof_type, 
            DEFAULTS.ROOF_TYPE
        ),
        
        "solar_roof_age": translatedRoofAge,
        
        "solar_power_storage": validateOrFallback(
            questions["Stromspeicher gewünscht"], 
            ALLOWED_VALUES.storage, 
            DEFAULTS.STORAGE
        ),
        
        "solar_offer_type": validateOrFallback(
            questions["Finanzierung"], 
            ALLOWED_VALUES.offer_type, 
            DEFAULTS.OFFER_TYPE
        )
    };
};

module.exports = { splitStreetAndNumber, mapAttributes };