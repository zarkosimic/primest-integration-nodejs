const { splitStreetAndNumber, mapAttributes } = require('../utils/cleaners');
const { DEFAULTS } = require('../config/mapping');

const calculateLeadScore = (rawData) => {
    let score = 0;
    const consumption = parseInt(rawData.questions["Wie hoch schätzen Sie ihren Stromverbrauch?"]) || 0;
    
    if (consumption > 4000) score += 50;
    else if (consumption > 2500) score += 30;
    
    if (rawData.questions["Sind Sie Eigentümer der Immobilie?"] === "Ja") score += 50;
    
    return score > 70 ? "High Priority" : "Standard";
};

const transformLeadData = (rawData) => {
    const address = splitStreetAndNumber(rawData.lead.street);
    const attributes = mapAttributes(rawData.questions);

    attributes["internal_lead_quality"] = calculateLeadScore(rawData);
    attributes["processed_at"] = new Date().toISOString();
    
    return {
        lead: {
            phone: rawData.lead.phone,
            email: rawData.lead.email,
            first_name: rawData.lead.first_name,
            last_name: rawData.lead.last_name,
            street: address.streetName,
            housenumber: address.houseNumber,
            postcode: rawData.lead.zipcode.toString(),
            city: rawData.lead.city,
            country: "de"
        },
        product: {
            name: DEFAULTS.PRODUCT_NAME
        },
        lead_attributes: attributes
    };
};

module.exports = { transformLeadData };