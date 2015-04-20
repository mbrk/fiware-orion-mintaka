var rest = require('restler');
var promise = require('promise');
var config = null;

// default options for restler
var options = {
	rejectUnauthorized: false,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'User-Agent': 'Restler for node.js'
	}
};



module.exports = {
	/**
	 * override default options
	 *
	 * @param opt
	 */
	setOptions: function(opt){
		options = opt;
	},

	/**
	 * set configuration in the format shown in ./conf.sample.js
	 * @param cnf
	 */
	configure: function(cnf){
		config = cnf;
		// create url to use in calls
		if(config.user && config.pass){
			brokerUrl = config.protocol + '://' + config.user + ':' + config.pass + '@' + config.url;
		}else{
			brokerUrl = config.protocol + '://' + config.url;
		}
	},

	/**
	 * request all registered entities
	 * @returns {*}
	 */
	requestEntities: function(){
		var url = brokerUrl + 'contextEntities';
		return new promise(function(resolve, reject){
			rest.get(url, options)
					.on('success', function(data, response) {
						resolve(data);
					})
					.on('fail', function(data, response) {
						reject(data);
					});
		});
	},

	/**
	 * register a new entity - pass in the attribute json
	 *
	 *
	 * {
	 *	"attributes" : [
	 *		{
	 *			"name" : "temperature",
	 *			"type" : "float",
	 *			"value" : "23"
	 *		},
	 *		{
	 *			"name" : "pressure",
	 *			"type" : "integer",
	 *			"value" : "720"
	 *		}
	 *	]
	 *}
	 *
	 * @param entity
	 * @param json
	 * @returns {*}
	 */
	registerEntity: function(entity, json){
		var url = brokerUrl + 'contextEntities/' + entity;
		console.log('registercontext', url);
		return new promise(function(resolve, reject){
			rest.postJson(url, json, options)
					.on('success', function(data, response) {
						resolve(data);
					})
					.on('fail', function(data, response) {
						reject(data);
					});
		});
	},

	/**
	 * delete a registered entity
	 * @param entity
	 * @returns {*}
	 */
	deleteEntity: function(entity){
		var url = brokerUrl + 'contextEntities/' + entity;
		console.log('deleteentity', url);
		return new promise(function(resolve, reject){
			rest.del(url, options)
					.on('success', function(data, response) {
						resolve(data);
					})
					.on('fail', function(data, response) {
						reject(data);
					});
		});

	}
};
