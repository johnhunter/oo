/*
	oo.js - methods for using object-oriented patterns

	@author		John Hunter for johnhunter.info
	Created		2010-03-13
	Licence     CC-GNU LGPL <http://bit.ly/LGPL2>
	
	CHANGED: removed binding to Object as these methods are not directly interchangable with ECMA 3.1, 5.
	
	oo.extend - follows signature of popular extend methods (Prototype, jQuery, etc)
		except that inherited properties are not copied, and properies with undefined values are copied.
		
	oo.create - returns an object that inherits from proto and is extended by properties.
		Has an uber property which is a ref to the prototype.
	
*/

var oo = function () {
	
	function extend (target, source) {
		var name, copy, undef;
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
	
	// export public methods
	return {
		extend: extend, create: create
	};
}();


