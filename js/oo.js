/*
	oo.js - methods for using object-oriented patterns

	@author		John Hunter for johnhunter.info
	Created		2010-03-13
	@version    1.1 (2011-02-07)
	
	Licenced under CC-BSD 2010, John Hunter
	<http://creativecommons.org/licenses/BSD/>
	
	
	oo.extend - follows signature of popular extend methods (Prototype, jQuery, etc)
		except that inherited properties are not copied, and properies with undefined values are copied.
		
	oo.create - returns an object that inherits from proto and is extended by properties.
		Has an uber property which is a ref to the prototype.
		
	oo.createClass (added v1.1) - returns a consructor function for a prototype which:
		inherits properties of the 'inherits' object
		and is augmented by the methods object.
		An initialize method (if defined) is called on instantation with constructor arguments.
	
*/

var oo = function () {
	
	function extend (target, source) {
		var name;
		for (var i = 1, len = arguments.length; i < len; i++) {
			source = arguments[i];
			for (name in source) {
				if (source.hasOwnProperty(name)) {
					target[name] = source[name];
				}
			}	
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
	
	function createClass (inherits, methods) {
		var func,
			proto = create(inherits, methods);
			
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
	
	
	// export public methods
	return {
		extend: extend, create: create, createClass: createClass
	};
}();


