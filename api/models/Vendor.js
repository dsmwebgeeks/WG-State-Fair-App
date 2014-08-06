module.exports = {
	attributes: {
		name: {
			type: "string",
			required: true,
		},
		landmark: {
			type: "string",
			required: true,
		},
		lat: {
			type: "string",
			required: true,
		},
		lng: {
			type: "string",
			required: true,
		},
		categories: {
			model: "Category",
		}
	},

	afterCreate: function (values, cb) {
		Category.create({vendor: values.id}).exec(function(err, cat) {
			Vendor.update({id: values.id}, {categories: cat.id}).exec(function(err, vendor) {
				cb();
			});
		});
	}
};

