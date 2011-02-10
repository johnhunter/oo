# oo.js - object-oriented patterns #


A simple helper for using Javascript inheritance patterns. Useful for prototypal inheritance and augmentation / mixins.  
<https://github.com/johnhunter/oo>


<dl>
	<dt><b>oo.extend(target, source)</b></dt>
	<dd>
		Copies all properties from source object[s] to target object. This is a destructive operation.<br>
		CHANGED (v1.1): now copies inherited properties, and properties with undefined values are NOT copied. This is more inline with behaviour of other implementations.
	</dd>
	
	<dt><b>oo.create(proto, properties)</b></dt>
	<dd>
		Returns an object that inherits from the proto object and is extended by the properties object. Returned object has an uber property which is a reference to the proto.
	</dd>
	<dt><b>oo.makeConstructor(inheritsFrom, properties)</b></dt>
	<dd>
		(added v1.1) factory method, returns an object constructor function.
		The object is based on a prototype which:
		<ul>
			<li>inherits properties of the inheritsFrom object</li>
			<li>and is augmented by the properties object - normally containing methods but can be any properties</li>
			<li>an initialize method (if defined in properties) is called on instantation with the constructor arguments</li>
		</ul>
	</dd>
</dl>


## Use ##

targetObject is extended with the sourceObject's properties

	oo.extend(targetObject, sourceObject[, sourceObjectN..]);

*	Returns the `targetObject`. This method is destructive.
*	You can use any number of `sourceObjects` and they will be copied (rightmost overwrites previous).
*	Object properties (objects, functions, etc) are copied by reference so `targetObject.foo === sourceObject.foo`.
*	To create a new object use `oo.extend({}, sourceObject);`.
*	This method uses memory due to copying, but run-time property lookup is fastest.


newObject inherits from the prototypeObject and is extended with the optional propertiesObject

	var newObject = oo.create(prototypeObject [, propertiesObject]);

*	Returns a new object.
*	Returned object has an `uber` property that is a reference to the `prototypeObject`.
*	This method uses less memory but run-time property lookup is slower for prototype properties. 



constructorFn returns an object that is initialized and share a common prototype

	var constructorFn = oo.makeConstructor(inheritsFromObject, {
		initialize: function (prop) {
			this.prop = prop;
		},
		// ... more methods
	});
	var instance = constructorFn(instancePropValue);
	
*	Returns a constructor function.
*	Constructor arguments are passed to the `initialize` method if one is defined - used to define instance properties.
*	`initialize` method can call the `inheritsFrom.initialize` via the uber property (equivalent to super), e.g: `this.uber.initialize(arguments)`
*	If the prototype does not inherit (equivalent to a base class) then set the inheritFrom to the Object constructor: `oo.makeConstructor(Object, { ... });`
*	This method uses least memory, but run-time property lookup is slowest since it has to 2 jumps to make up the prototype chain (its own proto, and the inheritsFrom object).

## Description and rationale ##

JavaScript is very much an object-oriented language. However it does not have classes. Newcomers to JavaScript familiar with a class-ical idiom can find this challenging. They are not helped because they are encouraged to approximate a class-like (pseudoclassical) behaviour using prototypes and the 'new' keyword. This is a crazy situation because they throw out the power of a dynamic multi-paradigm language and in turn are lumbered with a counterintuitive and misleading inheritance pattern that is nothing like classes.

In JavaScript there is no class-object duality. If you want an object you just create one. If you want methods you can just bind functions to the object. When the function is invoked the 'this' property is bound to the object. Methods are just functions, the only difference is you call them in the context of an object. I.E. a function only acts as a method of an object at the point you invoke it. With such a dynamic language the idea of a class just doesn't make sense.

So we can make objects and give them methods by binding functions to them, but there are times when you want a set of objects to have the same behaviour. As its a dynamic language we could just copy the methods from one object to all the others. Note that objects (including functions) are passed by reference so copying only creates new references. But its still a little wasteful. We can have a set of objects share methods (or other properties) through a common object - called a prototype. Each object has a property that gives access to a prototype object. Not all environments expose that property, but we can access it through the prototype property of the object's constructor.

	var obj = { name: 'foo' };
	obj.getName(); // TypeError: obj.getName is not a function
	Object.prototype.getName = function () { return this.name };
	obj.getName(); // returns "foo"

Ok, so we don't have classes but we have constructors. And constructors have a 'prototype' property that points to an object that is the prototype for each object the constructor creates. If you assign methods to the prototype object of the constructor then they will be available to each instance via the prototype chain. Call any of those methods and their 'this' property will point to the instance from which it was called. ...Oh and by the way, a constructor is just another function. Calling a function with the 'new' operator will create an object, that inherits from the prototype, and will pass it to the function as 'this' before returning it.

So the constructor creates the instance, and it will add a reference to the prototype object. But the prototype object is an entirely separate thing. So again - there are no classes in JavaScript - nothing like them.

Now we can see why simulating classes in JavaScript is the fast lane to insanity. But we still want objects with common behaviour, and we want a nice and easy way to do it. Well JavaScript is a dynamic and extraordinarily expressive language - there's a whole bunch of ways to do this.

### Mixins ###

We can take an object and mixin properties from another object with the oo.extend method (you might recognise this from libraries like jQuery).

	var dog = {
		legs: 4,
		hasTail: true
	};
	
	var fish = {
		fins: 1,
		hasTail: true,
	}
	
	oo.extend(dog, fish);
	
	/* we get...
	
		dog {
			legs: 4,
			fins: 1,
			hasTail: true
		}
	*/

Not that useful. But we can mixin common behaviour...

	var coastDweller = {
		stomach: [],
		energy: 0,
		swim: function () {
			this.speed = 3;
			this.energy--;
		}
		eat: function (foodType) {
			this.stomach.push(foodType);
			this.energy++;
		}
	};
	
	oo.extend(dog, coastDweller);
	oo.extend(fish, coastDweller);
	
	dog.eat(fish);
	// dog.energy is 1
	dog.swim();
	// dog.energy is 0
	
	
So we can mixin properties and behaviour at run time. These are all instance properties (although the methods are actually references to the `coastDweller` object properties).

### Inheritance ###

If we have an object that we want to use as a prototype for other objects we can use `oo.create`. This similar to the ES5 `Object.create` method. It hides the complexity (and pitfalls) of using a constructor function with `new` - so we have an easy way to get an object that inherits from another.

	var fishes = [];
	while (fishes.length < 10) {
		fishes.push(oo.create(coastDweller));
	}
	
	fishes[4].eat(fishes[3]);
	fishes[4].swim();
	
We can have all the fishes share coastDweller behaviour. When we call the eat method JavaScript looks for eat in the instance object. It doesn't find an eat property so it then looks further up the prototype chain and finds the reference to the eat function in `coastDweller`. It then calls the `eat` function and within the function the `this` property points to the fishes instance.

As well as shared behaviour we might want instances to have instance properties. We can pass oo.create a properties object that is mixed into the newly created instance:

	var bigFish = oo.create(coastDweller, { name: 'big fish', size: 3 });
	
So `bigFish` inherits from `coastDweller` and has some instance properties of its own. Useful but not quite there as an alternative to a class.

### Constructor factory ###

What we really want is a constructor that will create instance objects with their own instance properties but that share a common prototype object. The `oo.makeConstructor` is a factory that makes a constructor function. You tell it what to inherit from, and give it a set of properties (usually methods). It creates and stores an object which is uses as the prototype for the instances it constructs.

	var Fishes = oo.makeConstructor(coastDweller, {
		initialize: function (name, size) {
			this.name = name;
			this.size = size || 1;
		},
		dive: function () {
			this.energy -= this.size;
		}
	});
	
	var bigFish = Fishes('big fish', 3);
	bigFish.dive();

This will be familiar territory if you are used to classes. However the focus here is on the instance constructor. The factory has created a prototype shared across all the instances it creates. And if you define a method called `initialize` it will call this method when the constructor is called - passing any arguments provided to the constructor.

*	So we can share common behaviour by using an object as a prototype.
*	We can mixin behaviour and inherit from common ancestors.
*	We have a factory for constructors that initialize instances. 

And all without any classes - because of course they don't exist.

## Performance issues ##

In static compiled languages, like Java, deep inheritance chains are common. Inheritance is resolved during compilation and has no impact on run-time performance. In Javascript inheritance is resolved at *invocation* so deep chains have a run-time performance impact. Newer JITing interpreters do a good job of mitigation, but you should avoid deep inheritance where feasible and use more delegation or mixins.

## License ##

Licenced under CC-BSD 2010, John Hunter  
<http://creativecommons.org/licenses/BSD/>


*Standing on the shoulders of giants: Doug Crockford, John Resig, Stoyan Stefanov.*