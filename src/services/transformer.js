const { splitStreetAndNumber, mapAttributes } = require('../utils/cleaners');
const { DEFAULTS } = require('../config/mapping');

const transformLeadData = (rawData) => {
    const address = splitStreetAndNumber(rawData.lead.street);
    
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
        lead_attributes: mapAttributes(rawData.questions)
    };
};

module.exports = { transformLeadData };