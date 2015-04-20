var rest = require('restler');
var promise = require('promise');
var config = require('./config.js');

// default options for restler
var options = {
	username: config.ORION.user,
	password: config.ORION.pass,
	rejectUnauthorized: false,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'User-Agent': 'Restler for node.js'
	}
};

// create url to use in calls
if(config.ORION.user && config.ORION.pass){
	var brokerUrl = config.ORION.protocol + '://' + config.ORION.user + ':' + config.ORION.pass + '@' + config.ORION.url;
}else{
	var brokerUrl = config.ORION.protocol + '://' + config.ORION.url;
}


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
	registerEntityt: function(entity, json){
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
