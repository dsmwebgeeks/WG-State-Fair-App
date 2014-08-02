module.exports = {
	attributes: {
		user: {
			type: "string",
			required: true
		},
		comment: {
			type: "text",
			required: true
		},
		// Vendor can be a model, so it'll be possible to find a vendor with comments
		// That can only be an advantage if saving the comments to localstorage is wanted
		vendor: {
			type: "string",
			required: true
		}
	}
};

