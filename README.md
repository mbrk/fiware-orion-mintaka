fiware-orion-mintaka
=====================

A node.js client to interact with https://github.com/telefonicaid/fiware-orion

This module is WORK IN PROGRESS. NOT SUITED FOR PRODUCTION!

## Installation 
   
    npm install fiware-orion-mintaka
   
## Usage

After installation first you must configure fiware-orion-mintaka
    
    var mintaka = require('fiware-orion-mintaka');
    
    var conf = {
    	protocol: 'https',
    	url: 'my.orion.context.com:9999/v1/',
    	user: 'username',
    	pass: 'password'
    };
    
    mintaka.configure(conf);
    
Optional you can pass in some options for 'restler'
    
    var options = {
    	rejectUnauthorized: false,
    	headers: {
    		'Content-Type': 'application/json',
    		'Accept': 'application/json',
    		'User-Agent': 'Restler for node.js'
    	}
    };
    
    mintaka.setOptions(options);
    
Now you can use fiware-orion-mintaka. All function calls return a promise which you can use in a .then() chain.

    mintaka.requestEntities().then(
    		function(success){
    			// handle success
    		},
    		function(error){
                // handle error
    		}
    	);
    	
Available functions are

    mintaka.requestEntities() // list all registered entities
    mintaka.registerEntity(entityName, attributeJSON) // create a new entity with given attributes
    mintaka.deleteEntity(entityName) // delete given entity
    
## Tests

    // to be written
    
## Release History

* 0.2.0 added more contextbroker api functions
* 0.1.1 bug fixes
* 0.1.0 Initial release

