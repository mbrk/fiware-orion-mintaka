/**
 * TODO
 * - interface for updating context
 * - interface for subscribing context
 * - interface for registering entities without attributes
 * - interface for registering attributes with types
 * - add proper logging
 * - helper for converting attributes/entity js-object to correct context broker json
 * - add verbose debug information
 */

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
		return this.createPromiseForGET(url, options);
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
		if(typeof json != 'undefined'){
			return this.createPromiseForJsonPOST(url, json, options);
		}

	},

	/**
	 * register entity with specified type
	 * @param entity
	 * @param type
	 * @param json
	 * @returns {*}
	 */
	registerEntityWithType: function(entity, type, json){
		var url = brokerUrl + 'contextEntities/type/' + type + "/id/" + entity;
		return this.createPromiseForJsonPOST(url, json, options);
	},

	/**
	 * set attribute on entity
	 *
	 * @param entity
	 * @param attribute
	 * @param value
	 * @returns {*}
	 */
	registerAttribute: function(entity, attribute, value){
		var url = brokerUrl + 'contextEntities/' + entity + '/attributes/' + attribute;
		var json = {
			"value" : "" + value
		};
		return this.createPromiseForJsonPOST(url, json, options);
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

	},

	/**
	 * get all attributes from specified entity
	 *
	 * @param entity
	 * @returns {*}
	 */
	queryAttributes: function(entity){
		var url = brokerUrl + 'contextEntities/' + entity;
		return this.createPromiseForGET(url, options);
	},

	/**
	 * get specified attribute from specified entity
	 * @param entity
	 * @param attribute
	 * @returns {*}
	 */
	querySingleAttribute: function(entity, attribute){
		var url = brokerUrl + 'contextEntities/' + entity + '/attributes/' + attribute;
		return this.createPromiseForGET(url, options);
	},

	/**
	 * get all entities from specified type
	 *
	 * @param type
	 * @returns {*}
	 */
	queryEntitiesByType: function(type){
		var url = brokerUrl + 'contextEntityTypes/' + type;
		return this.createPromiseForGET(url, options);
	},

	/**
	 * get a specified attribute from all entities with specified type
	 * @param type
	 * @param attribute
	 * @returns {*}
	 */
	querySingleAttributeByEntityType: function(type, attribute){
		var url = brokerUrl + 'contextEntityTypes/' + type + '/attributes/' + attribute;
		return this.createPromiseForGET(url, options);
	},

	/**
	 * helper to create promises for 'restler' GET calls
	 * @param url
	 * @param options
	 * @returns {*}
	 */
	createPromiseForGET: function(url, options){
		return new promise(function(resolve, reject){
			rest.get(url, options)
					.on('success', function(data, response) {
						resolve(data);
					})
					.on('fail', function(data, response) {
						reject(data);
					});
		})
	},

	/**
	 * helper to create promises for 'restler' POST calls
	 * @param url
	 * @param json
	 * @param options
	 * @returns {*}
	 */
	createPromiseForJsonPOST: function(url, json, options){
		return new promise(function(resolve, reject){
			rest.postJson(url, json, options)
					.on('success', function(data, response) {
						resolve(data);
					})
					.on('fail', function(data, response) {
						reject(data);
					});
		});
	}
};
