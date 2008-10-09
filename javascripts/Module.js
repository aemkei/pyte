/**
 * Page module constructed via it's class literal.
 * 
 * @constructor
 * @example new Module("ubilabs.map.Map", {container: "map1"});
 * @param {String} klass		Class literal.
 * @param {Object} [options]	Options to pass to constructor.
 * @param {Function} [callback]	Callback when module is initialized.
 */

var Module = Class.create(
	/** @scope Module.prototype */{
	initialize: function(klass, options, callback){
		this.args = $A(arguments).slice(1);
		this.callback = callback;
		this.options = options;
		this.klass = klass;
		Class.include(klass);
		Module._modules.push(this);
	}
});
Module._modules = $A();

/** 
 * Initialize all modules on DOM load.
 */ 
Module._initialize = function(){
	Module._modules.each(function(module){
		eval("var Klass = " + module.klass);
		var instance = new Klass(module.options);
		if (module.callback){
			module.callback.apply(instance);
		}
	});	
};

// Attatch document events and initialize scripts and classes;
document.observe("dom:loaded", function(){
	Module._initialize();
});