/**
 * @copyright 2007 by Ubilabs
 *
 * @fileOverview
 * This script file handles dynamic modules and applications.
 * It must be included below "prototype.js"!
 *     <script type="text/javascript" src="js/lib/prototype.js"></script>
 *     <script type="text/javascript" src="js/Core.js"></script>
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
				if (!Class._includedScripts.include(classPath)){
					Package.create(classPath);
					Class.load(Class._basePath + classPath.replace(/\./g, "/") + '.js');
					Class._includedScripts.push(classPath);
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
	},

	/**
	 * Provides a package namespace.
	 *
	 * @example Class.namespace("for.bar.events");
	 * @param {String} namespace	Namespace eg "for.bar.events".
	 * @return {Object} Returns the base package.
	 */
	namespace: function(namespace){
		return namespace.split(".").inject(window, function(base, part){
			return (
				base = base[part] || (base[part] = {})
			);
		});
	}
});

Class._includedScripts = $A();
Class._loadedScripts = $A();

$$("script").each(function(){
	if (script.src){
		if (script.src.match(/Core\.js/)){
			Class._basePath = script.src.replace(/Core\.js(\?.*)?$/,'');
		}
		Class._loadedScripts.push(script.src);
	}
});
