module.exports = {
    VALID_ZIP_PREFIX: '66',
    
    VALUE_TRANSLATIONS: {
        roof_age: {
            "Nach 1990": "Jünger als 30 Jahre",
            "Vor 1990": "Älter als 30 Jahre",
            "Neubau": "Gerade erst gebaut"
        },
        boolean: {
            "Ja": "Ja",
            "Nein": "Nein"
        }
    },

    ALLOWED_VALUES: {
        property_type: ["Einfamilienhaus", "Zweifamilienhaus", "Mehrfamilienhaus", "Firmengebäude", "Freilandfläche", "Garage", "Carport", "Scheune/Landwirtschaft", "Lagerhalle", "Industrie"],
        roof_type: ["Andere", "Flachdach", "Kaffeemühlenhaus", "Krüppelwalmdach", "Mansardendach", "Pultdach", "Satteldach", "Versetztes Pultdach", "Walmdach", "Winkelwalmdach", "Zwerchdach"],
        roof_material: ["Asbest", "Bitumen", "Blech/Trapezblech", "Dachziegel", "Gründach", "Holzdach", "Kies", "Schiefer", "Schindeldach", "Andere"],
        offer_type: ["Beides interessant", "Mieten", "Kaufen"],
        storage: ["Ja", "Nein", "Noch nicht sicher"]
    },
    
    DEFAULTS: {
        OFFER_TYPE: "Beides interessant",
        STORAGE: "Noch nicht sicher",
        ROOF_TYPE: "Satteldach",
        PROPERTY_TYPE: "Einfamilienhaus",
        MATERIAL: "Dachziegel",
        PRODUCT_NAME: "Solaranlagen"
    }
};