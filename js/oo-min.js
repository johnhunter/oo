/*
	Compressed from: oo.js v1.1 <https://github.com/johnhunter/oo>
	On: 09/02/2011 16:11
	Licenced under CC-BSD 2010, John Hunter <http://creativecommons.org/licenses/BSD/>
*/

var oo=function(){function c(k,j){var e,h,g,f=1,d=arguments.length;while(f<d){j=arguments[f];for(e in j){h=j[e];if(h!==g){k[e]=h}}f++}return k}function b(f,d){function e(){}e.prototype=f;var g=new e();if(d){c(g,d)}g.uber=f;return g}function a(d,e){var g,f=b(d,e);g=function(){var h=b(f);h.uber=f.uber;if(typeof h.initialize==="function"){h.initialize.apply(h,arguments)}return h};g.prototype=f;f.constructor=g;return g}return{extend:c,create:b,makeConstructor:a}}();

