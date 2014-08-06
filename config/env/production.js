module.exports = { 
	session: {
		adapter: 'mongo',
		url: process.env.MONGOLAB_URI
	},
	models: {
		connection: 'prodMongodbServer'
	}
}