/*
	oo.js - augment Object with static methods for using object-oriented patterns

	@author		John Hunter for johnhunter.info
	Created		2010-03-13
	Licence     CC-GNU LGPL <http://bit.ly/LGPL2>
	
	Object.extend - follows signature of popular extend methods (Prototype, jQuery, etc)
		except that inherited properties are not copied, and properies with undefined values are copied.
		
	Object.create - follows signature for ECMAScript 5 method.
	
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
			Object.extend(o, properties);
		}
		return o;
	}
	
	// augment Object if no native implementation
	if (typeof Object.extend !== 'function') {
		Object.extend = extend;
	}
	if (typeof Object.create !== 'function') {
		Object.create = create;
	}
	
	// export public methods
	return {
		extend: extend, create: create
	};
}();

