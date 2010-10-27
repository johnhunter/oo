/*
	oo.js - provides methods for using object-oriented patterns

	@author		John Hunter for johnhunter.info
	Created		2010-03-13
	Modified	2010-03-23
	
	
	
*/
var oo = {
	// augment target with properies of source, takes any number of source arguments
	extend: function (target, source) {
		var name, copy, undef;
		for (var i = 1, len = arguments.length; i < len; i++) {
			source = arguments[i];
			for (name in source) {
				copy = source[name];
				if (copy !== undef) target[name] = copy;
			}	
		}
		return target;
	},
	// return an object with proto instance as its prototype equivalent to ECMAScript 5 Object.create
	create: function (proto) {
		function F(){}
		F.prototype = proto;
		var o = new F();
		o.uber = proto;
		return o;
	},
	// return object which inherits from proto and is extended by source properties
	implement: function (proto, source) {
		return oo.extend(oo.create(proto), source);
	}
};

