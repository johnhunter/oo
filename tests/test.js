/*
	Unit testing for localstore.js
	2011-02-15
*/


/*
	Objects used in tests:
*/

var baseLiteral = {
	name: 'baseLiteral',
	setName: function (name) {
		this.name = name;
	},
	getName: function () {
		return this.name;
	},
	getThis: function () {
		return this;
	}
};

var subLiteral = {
	name: 'subLiteral',
	getName: function () {
		return this.uber.getName() +':'+ this.name;
	}
};

var toBeExtended = { name: 'toBeExtended' };



module("oo");
	
test('module and methods exist', function() {
	expect(4);
	
	same(typeof oo, 'object', "oo module is an object");
	same(typeof oo.extend, 'function', "oo.extend method exists");
	same(typeof oo.create, 'function', "oo.create method exists");
	same(typeof oo.makeConstructor, 'function', "oo.makeConstructor method exists");
	
});

test('extends method', function() {
	expect(4);
	
	same(
		baseLiteral, oo.extend({}, baseLiteral), 
		'Copy properties to new object.'
	);
	
	var extended = oo.extend(toBeExtended, baseLiteral);
		
	
	ok(
		extended.name === 'baseLiteral',
		'Target properties correctly overwritten by source properties.'
	);
		
	ok(
		(toBeExtended.getThis() === toBeExtended && toBeExtended.hasOwnProperty('getThis')),
		'Properties copied to target include inherited ones.'
	);
		
	extended = oo.extend({}, baseLiteral, {name: 'extendedAgain'});
	
	ok(
		extended.name === 'extendedAgain',
		'Properties extended from multiple source objects.'
	);
	
});

test('create method', function() {
	expect(3);
	
	var instance = oo.create(baseLiteral);
	
	ok(
		baseLiteral.getName === instance.getName && !instance.hasOwnProperty('getName'), 
		'Instance inherits methods from prototype.'
	);
		
	ok(
		instance.getThis() === instance,
		'Prototype methods access this instance correctly.'
	);
	
	ok(
		instance.uber === baseLiteral && instance.uber.getName() === 'baseLiteral',
		'The instance.uber property references the base object.'
	);
			
});

test('create method with instance properties', function() {
	expect(4);
	
	var instance = oo.create(baseLiteral, {name: 'instance'});
	
	ok(
		instance.getName() === 'instance',
		'Instance property set and accessible to prototye methods.'
	);
	
	var instance2 = oo.create(baseLiteral, subLiteral);
	
	ok(
		instance2.getName() === 'baseLiteral:subLiteral',
		'Instance methods can override base and call them via uber property'
	);
		
	var instance3 = oo.create(oo.create(baseLiteral, subLiteral), {name: 'instance3'});
	
	ok(
		instance3.getName() === 'baseLiteral:subLiteral:instance3',
		'Inheritance occurs through multiple levels'
	);
		
	ok(
		instance3.uber.uber === baseLiteral, 
		'Can access prototype chain through uber properties'
	);
	
});

test('makeConstructor method', function () {
	expect(6);
	
	var inheritedFrom = {};
	var myConstructor = oo.makeConstructor(inheritedFrom, {
		initialize: function (name) {
			this.setName(name);
		},
		setName: function (name) {
			this.name = name;
		},
		getName: function () {
			return this.name;
		},
		getThis: function () {
			return this;
		}
	});
	
	var instance = myConstructor('Fred');
	
	
	ok(
		(typeof myConstructor === 'function'),
		'Returns a constructor function.'
	);
	
	ok(
		typeof myConstructor.prototype.getThis  === 'function',
		'Constructor function has correct prototype.'
	);
	
	ok(
		myConstructor === instance.constructor,
		'Instance has correct constructor.'
	);
	
	ok(
		instance.uber === inheritedFrom,
		'Instance inherits from object passed to constructor factory.'
	);
	
	ok(
		instance.getName() === 'Fred',
		'Instance is initialized correctly.'
	);
	
	ok(
		instance.getThis() === instance && instance.hasOwnProperty('getThis') ===  false,
		'Instance has inherited methods.'
	);
	
});

