Class.include("Module");

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