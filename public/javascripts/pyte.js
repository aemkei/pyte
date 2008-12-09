/**
 * @see http://github.com/aemkei/pyte/tree/master
 * 
 * @fileOverview 
 * This script file handles dynamic class dependencies. 
 * It must be included below "prototype.js"!
 *     <script type="text/javascript" src="js/lib/prototype.js"></script>
 *     <script type="text/javascript" src="js/pyte.js"></script>
 * </pre>
 */

Object.extend(Class, {
	_basePath: "/javascripts/",
	
	/**
	 * Append one or more classes to the document.
	 * @example Class.include("ubilabs.map.Map", "ubilabs.Settings");
	 * @param {String} ...	Path to classes eg: "ubilabs.map.GeoCoder"
	 */
	include: function(classPaths){
		$A(arguments).flatten().each(function(classPath){
			if (typeof classPath == "string"){
				classPath = classPath.replace("*", "_package");
				if (!Class.includedScripts.include(classPath)){
					Package.create(classPath);
					Class.load(Class._basePath + classPath.replace(/\./g, "/") + '.js');
					Class.includedScripts.push(classPath);
				}
			}
		});
	},
	
	/**
	 * Dynamically loads a script file.
	 * @param {String} script	Path to script eg: "script/ubilabs/map/GeoCoder.js"
	 */	
	load: function(script){
		if (this._loadedScripts.include(script)){
			return false;
		}
		var code = new Ajax.Request(script, {
			asynchronous: false,
			method: "GET",
			evalJS: false,
			evalJSON: false
		}).transport.responseText;
		
		code += '\n//@ sourceURL=' + script;
		
		if (Prototype.Browser.IE) {
			window.execScript(code);
		} else if (Prototype.Browser.WebKit){
			$$("head").first().insert(Object.extend(
				new Element("script", {type: "text/javascript"}), {text: code}
			));
		} else {
			window.eval(code);
		}
		
		this._loadedScripts.push(script);
	}
});


Class._loadedScripts = $$("head script").findAll(function(script){ 
	return script.src && script.src.match(document.location.host);
}).pluck("src");

var Package = {
	/**
	 * Provides a package namespace. 
	 * 
	 * @example Package.create("for.bar.events");
	 * @param {String} namespace	Namespace eg "for.bar.events".
	 * @return {Object} Returns the base package.
	 */
	create: function(namespace){
		return namespace.split(".").inject(window, function(base, part){
			return (
				base = base[part] || (base[part] = {})
			);
		});
	},
	/**
	 * Incluses a list of classes.
	 * @param {Array} classes Classes to include.
	 */
	include: function(classes){
		$A(arguments).each(Class.include);
	}
};

Class.includedScripts = (typeof pyte_preloaded != "undefined") ? pyte_preloaded : $A();
Class.includedScripts.each(Package.create);

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

/**
 * Load and run an application class. The application will be global 
 * accessible as "application".
 * 
 * @constructor
 * @example new Application("foo.bar.app.MyApp");
 * @param {String} klass		Class reference as string pattern.
 * @param {Function} [callback]	Callback method to run when app is initialized.
 */
var Application = Class.create(
	/** @scope Application.prototype */ {
	initialize: function(klass, callback){
		new Module(klass, {}, function(){
			window.application = this;
			if (callback){
				callback.apply(this);
			}
		});
	}
});

document.observe("dom:loaded", function(){
	Module._initialize();
