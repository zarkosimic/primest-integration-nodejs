const { VALUE_TRANSLATIONS, ALLOWED_VALUES, DEFAULTS } = require('../config/mapping');

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
        "solar_owner": questions["Sind Sie Eigentümer der Immobilie?"] || "Ja",
        "solar_energy_consumption": questions["Wie hoch schätzen Sie ihren Stromverbrauch?"],
        
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
        
        "solar_roof_material": validateOrFallback(
            questions["Dachmaterial"], 
            ALLOWED_VALUES.roof_material, 
            DEFAULTS.MATERIAL
        ),
        
        "solar_area": questions["Dachfläche"],
        "solar_roof_pitch": questions["Dachgefälle"],
        "solar_south_location": questions["Dachausrichtung"],
        
        "solar_power_storage": validateOrFallback(
            questions["Stromspeicher gewünscht"], 
            ALLOWED_VALUES.storage, 
            DEFAULTS.STORAGE
        ),
        
        "solar_wallbox": questions["Wallbox gewünscht"] === "Ja" ? "Ja" : "Nein",
        
        "solar_offer_type": validateOrFallback(
            questions["Finanzierung"], 
            ALLOWED_VALUES.offer_type, 
            DEFAULTS.OFFER_TYPE
        )
    };
};

module.exports = { splitStreetAndNumber, mapAttributes };