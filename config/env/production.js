module.exports = { 
	session: {
		url: process.env.MONGOLAB_URI
	},
	models: {
		connection: 'prodMongodbServer'
	}
}