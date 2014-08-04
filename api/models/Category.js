module.exports = {
	attributes: {
		beer: {
			type: "boolean",
			defaultsTo: false
		},
		otherAlcohol: {
			type: "boolean",
			defaultsTo: false
		},
		oldFashioned: {
			type: "boolean",
			defaultsTo: false
		},
		pepsi: {
			type: "boolean",
			defaultsTo: false
		},
		coke: {
			type: "boolean",
			defaultsTo: false
		},
		vendor: {
			model: "Vendor"
		}
	}
};

