/*
	oo.js - methods for using object-oriented patterns

	@author		John Hunter for johnhunter.info
	Created		2010-03-13
	@version    1.1 (2011-02-07)
	
	Licenced under CC-BSD 2010, John Hunter
	<http://creativecommons.org/licenses/BSD/>
	
	
	oo.extend - copies all properties from sources to target object.
		CHANGED (v1.1): now copies inherited properties, and properies with undefined values are NOT copied.
		
	oo.create - returns an object that inherits from proto and is extended by properties.
		Has an uber property which is a ref to the prototype.
		
	oo.makeConstructor (added v1.1) - factory method, returns an object constructor function.
	The object is based on a prototype which:
		inherits properties of the inheritsFrom argument
		and is augmented by the methods argument.
		An initialize method (if defined in methods) is called on instantation with constructor arguments.
	
*/

var oo = function () {
	
	function extend (target, source) {
		var name,
			value,
			undef,
			i = 1,
			len = arguments.length;
		
		while (i < len) {
			source = arguments[i];
			for (name in source) {
				value = source[name];
				if (value !== undef) {
					target[name] = value;
				}
			}
			i++;
		}
		return target;
	}
	
	function create (proto, properties) {
		function F() {}
		F.prototype = proto;
		var o = new F();
		if (properties) {
			extend(o, properties);
		}
		o.uber = proto;
		return o;
	}
	
	function makeConstructor (inheritsFrom, methods) {
		var func,
			proto = create(inheritsFrom, methods);

		func = function () {
			var that = create(proto);
			that.uber = proto.uber;
			if (typeof that.initialize === 'function') {
				that.initialize.apply(that, arguments);
			}
			return that;
		};
		func.prototype = proto;
		proto.constructor = func;
		return func;
	}
	
	
	// expose public methods
	return {
		extend: extend,
		create: create,
		makeConstructor: makeConstructor
	};
}();


