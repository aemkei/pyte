/**
 * Event dispatcher mixin methods. Provides #observe, #dispatch, #pass, 
 * and #stopObserving.
 * 
 * @constructor
 * @alias Event.Dispatcher
 * @example var Klass = Class.create(Event.Dispatcher, {...});
 */
Event.Dispatcher = /** @scope Event.Dispatcher.prototype */ {
	/**
	 * Registers an event handler on a DOM element.
	 * @param {String} event
	 * @param {Function} observer
	 * @return {Object} Target object.
	 */
	observe: function(event, observer){
		this._observers = this._observers || $H();
		var observers = this._observers.get(event) || this._observers.set(event,  $A());
		observers.push(observer);
		return this;
	},
	
	/**
	 * Unregisters an event handler.
	 * @param {String} event
	 * @param {Object} observer
	 * @return {Object} Target object.
	 */
	stopObserving: function(event, observer){
		this._observers.set(event, 
			observer ? this._observers.get(event).without(observer) : $A()
		);
		return this;
	},
	
	/**
	 * Dispatches an event. 
	 * @param {String} event
	 * @return {Object} Target object.
	 */
	dispatch: function(event){
		var observers = (this._observers && this._observers.get(event)) || $A();
		if (observers){
			var args = $A(arguments).slice(1);
			observers.each(function(observer){
				observer.apply(this, args);
			});
		}
		return this;
	},
	
	/**
	 * Passes an event.
	 * @param {String} event
	 * @param {Object} target
	 * @return {Object} Target object.
	 */
	pass: function(event, target){
		this.observe(event, function(){
			target.dispatch(event);
		});
		return this;
	}
};
