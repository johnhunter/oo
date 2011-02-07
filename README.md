# oo.js - object-oriented patterns #


A simple helper for using Javascript inheritance patterns. Useful for prototypal inheritance and augmentation / mixins. The module was originally a polyfill for ECMA 3.1 & ECMA 5 but recreating Object.defineProperties seemed a pointless exercise.

<dl>
	<dt>oo.extend</dt>
	<dd>
		follows signature of popular extend methods (Prototype, jQuery, etc) except that inherited properties are not copied, and properties with undefined values are copied.
	</dd>
	
	<dt>oo.create</dt>
	<dd>
		returns an object that inherits from proto and is extended by properties. Has an uber property which is a ref to the prototype.
	</dd>
	<dt>oo.createClass</dt>
	<dd>
		(added v1.1) returns a constructor function for a prototype which:
		inherits properties of the 'inherits' object argument
		and is augmented by the 'methods' object argument.
		An initialize method (if defined) is called on instantation with constructor arguments.
	</dd>
</dl>

## Use ##

To be written.



*Standing on the shoulders of giants: Doug Crockford, John Resig, Stoyan Stefanov.*