/*! $.noUiSlider
 @version 5.0.0
 @author Leon Gersen https://twitter.com/LeonGersen
 @license WTFPL http://www.wtfpl.net/about/
 @documentation http://refreshless.com/nouislider/
*/

// ==ClosureCompiler==
// @externs_url http://refreshless.com/externs/jquery-1.8.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// ==/ClosureCompiler==

/*jshint laxcomma: true */
/*jshint smarttabs: true */
/*jshint sub: true */

/*jslint browser: true */
/*jslint continue: true */
/*jslint plusplus: true */
/*jslint white: true */
/*jslint sub: true */

(function( $ ){

	'use strict';

	if ( $['zepto'] && !$.fn.removeData ) {
		throw new ReferenceError('Zepto is loaded without the data module.');
	}

	$.fn['noUiSlider'] = function( options, rebuild ){

		var
		// Cache the document and body selectors;
		 doc = $(document)
		,body = $('body')

		// Namespace for binding and unbinding slider events;
		,namespace = '.nui'

		// Copy of the current value function;
		,$VAL = $.fn.val

		// Re-usable list of classes;
		,clsList = [
		/*  0 */  'noUi-base'
		/*  1 */ ,'noUi-origin'
		/*  2 */ ,'noUi-handle'
		/*  3 */ ,'noUi-input'
		/*  4 */ ,'noUi-active'
		/*  5 */ ,'noUi-state-tap'
		/*  6 */ ,'noUi-target'
		/*  7 */ ,'-lower'
		/*  8 */ ,'-upper'
		/*  9 */ ,'noUi-connect'
		/* 10 */ ,'noUi-horizontal'
		/* 11 */ ,'noUi-vertical'
		/* 12 */ ,'noUi-background'
		/* 13 */ ,'noUi-stacking'
		/* 14 */ ,'noUi-block'
		/* 15 */ ,'noUi-state-blocked'
		/* 16 */ ,'noUi-ltr'
		/* 17 */ ,'noUi-rtl'
		/* 18 */ ,'noUi-dragable'
		/* 19 */ ,'noUi-extended'
		/* 20 */ ,'noUi-state-drag'
		]

		// Determine the events to bind. IE11 implements pointerEvents without
		// a prefix, which breaks compatibility with the IE10 implementation.
		,actions = window.navigator['pointerEnabled'] ? {
			 start: 'pointerdown'
			,move: 'pointermove'
			,end: 'pointerup'
		} : window.navigator['msPointerEnabled'] ? {
			 start: 'MSPointerDown'
			,move: 'MSPointerMove'
			,end: 'MSPointerUp'
		} : {
			 start: 'mousedown touchstart'
			,move: 'mousemove touchmove'
			,end: 'mouseup touchend'
		};


// Percentage calculation

	// (percentage) How many percent is this value of this range?
		function fromPercentage ( range, value ) {
			return (value * 100) / ( range[1] - range[0] );
		}

	// (percentage) Where is this value on this range?
		function toPercentage ( range, value ) {
			return fromPercentage( range, range[0] < 0 ?
				value + Math.abs(range[0]) :
					value - range[0] );
		}

	// (value) How much is this percentage on this range?
		function isPercentage ( range, value ) {
			return ((value * ( range[1] - range[0] )) / 100) + range[0];
		}


// Type tests

	// Test in an object is an instance of jQuery or Zepto.
		function isInstance ( a ) {
			return a instanceof $ || ( $['zepto'] && $['zepto']['isZ'](a) );
		}

	// Checks whether a value is numerical.
		function isNumeric ( a ) {
			return !isNaN( parseFloat( a ) ) && isFinite( a );
		}


// General helper functions

	// Test an array of objects, and calls them if they are a function.
		function call ( functions, scope ) {

			// Allow the passing of an unwrapped function.
			// Leaves other code a more comprehensible.
			if( !$.isArray( functions ) ){
				functions = [ functions ];
			}

			$.each( functions, function(){
				if (typeof this === 'function') {
					this.call(scope);
				}
			});
		}

	// Returns a proxy to set a target using the public value method.
		function setN ( target, number ) {

			return function(){

				// Determine the correct position to set,
				// leave the other one unchanged.
				var val = [null, null];
				val[ number ] = $(this).val();

				// Trigger the 'set' callback
				target.val(val, true);
			};
		}

	// Round a value to the closest 'to'.
		function closest ( value, to ){
			return Math.round(value / to) * to;
		}

	// Format output value to specified standards.
		function format ( value, options ) {

			// Round the value to the resolution that was set
			// with the serialization options.
			value = value.toFixed( options['decimals'] );

			// Rounding away decimals might cause a value of -0
			// when using very small ranges. Remove those cases.
			if ( parseFloat(value) === 0 ) {
				value = value.replace('-0', '0');
			}

			// Apply the proper decimal mark to the value.
			return value.replace( '.', options['serialization']['mark'] );
		}

	// Determine the handle closest to an event.
		function closestHandle ( handles, location, style ) {

			if ( handles.length === 1 ) {
				return handles[0];
			}

			var total = handles[0].offset()[style] +
						handles[1].offset()[style];

			return handles[ location < total / 2 ? 0 : 1 ];
		}

	// Round away small numbers in floating point implementation.
		function digits ( value, round ) {
			return parseFloat(value.toFixed(round));
		}

// Event abstraction

	// Provide a clean event with standardized offset values.
		function fixEvent ( e ) {

			// Prevent scrolling and panning on touch events, while
			// attempting to slide. The tap event also depends on this.
			e.preventDefault();

			// Filter the event to register the type, which can be
			// touch, mouse or pointer. Offset changes need to be
			// made on an event specific basis.
			var  touch = e.type.indexOf('touch') === 0
				,mouse = e.type.indexOf('mouse') === 0
				,pointer = e.type.indexOf('pointer') === 0
				,x,y, event = e;

			// IE10 implemented pointer events with a prefix;
			if ( e.type.indexOf('MSPointer') === 0 ) {
				pointer = true;
			}

			// Get the originalEvent, if the event has been wrapped
			// by jQuery. Zepto doesn't wrap the event.
			if ( e.originalEvent ) {
				e = e.originalEvent;
			}

			if ( touch ) {
				// noUiSlider supports one movement at a time,
				// so we can select the first 'changedTouch'.
				x = e.changedTouches[0].pageX;
				y = e.changedTouches[0].pageY;
			}
			if ( mouse || pointer ) {

				// Polyfill the pageXOffset and pageYOffset
				// variables for IE7 and IE8;
				if( !pointer && window.pageXOffset === undefined ){
					window.pageXOffset = document.documentElement.scrollLeft;
					window.pageYOffset = document.documentElement.scrollTop;
				}

				x = e.clientX + window.pageXOffset;
				y = e.clientY + window.pageYOffset;
			}

			return $.extend( event, {
				 'pointX': x
				,'pointY': y
				,cursor: mouse
			});
		}

	// Handler for attaching events trough a proxy
		function attach ( events, element, callback, pass ) {

			var target = pass.target;

			// Add the noUiSlider namespace to all events.
			events = events.replace( /\s/g, namespace + ' ' ) + namespace;

			// Bind a closure on the target.
			return element.on( events, function( e ){

				// jQuery and Zepto handle unset attributes differently.
				var disabled = target.attr('disabled');
					disabled = !( disabled === undefined || disabled === null );

				// Test if there is anything that should prevent an event
				// from being handled, such as a disabled state or an active
				// 'tap' transition.
				if( target.hasClass('noUi-state-tap') || disabled ) {
					return false;
				}

				// Call the event handler with three arguments:
				// - The event;
				// - An object with data for the event;
				// - The slider options;
				// Having the slider options as a function parameter prevents
				// getting it in every function, which muddies things up.
				callback (
					 fixEvent( e )
					,pass
					,target.data('base').data('options')
				);
			});
		}


// Serialization and value storage

	// Store a value on all serialization targets, or get the current value.
		function serialize ( a ) {

			/*jshint validthis: true */

			// Re-scope target for availability within .each;
			var target = this.target;

			// Get the value for this handle
			if ( a === undefined ) {
				return this.element.data('value');
			}

			// Write the value to all serialization objects
			// or store a new value on the handle
			if ( a === true ) {
				a = this.element.data('value');
			} else {
				this.element.data('value', a);
			}

			// Prevent a serialization call if the value wasn't initialized.
			if ( a === undefined ) {
				return;
			}

			// If the provided element was a function,
			// call it with the slider as scope. Otherwise,
			// simply call the function on the object.
			$.each( this.elements, function() {
				if ( typeof this === 'function' ) {
					this.call(target, a);
				} else {
					this[0][this[1]](a);
				}
			});
		}

	// Map serialization to [ element, method ]. Attach events where required.
		function storeElement ( handle, item, number ) {

			// Add a change event to the supplied jQuery objects,
			// which triggers the value-setting function on the target.
			if ( isInstance( item ) ) {

				var elements = [], target = handle.data('target');

				// Link the field to the other handle if the
				// slider is inverted.
				if ( handle.data('options').direction ) {
					number = number ? 0 : 1;
				}

				// Loop all items so the change event is properly bound,
				// and the items can individually be added to the array.
				item.each(function(){

					// Bind the change event.
					$(this).on('change' + namespace, setN( target, number ));

					// Store the element with the proper handler.
					elements.push([ $(this), 'val' ]);
				});

				return elements;
			}

			// Append a new input to the noUiSlider base.
			// Prevent the change event from flowing upward.
			if ( typeof item === 'string' ) {

				item = [ $('<input type="hidden" name="'+ item +'">')
					.appendTo(handle)
					.addClass(clsList[3])
					.change(function ( e ) {
						e.stopPropagation();
					}), 'val'];
			}

			return [item];
		}

	// Access point and abstraction for serialization.
		function store ( handle, i, serialization ) {

			var elements = [];

			// Loops all items in the provided serialization setting,
			// add the proper events to them or create new input fields,
			// and add them as data to the handle so they can be kept
			// in sync with the slider value.
			$.each( serialization['to'][i], function( index ){
				elements = elements.concat(
					storeElement( handle, serialization['to'][i][index], i )
				);
			});

			return {
				 element: handle
				,elements: elements
				,target: handle.data('target')
				,'val': serialize
			};
		}


// Handle placement

	// Fire callback on unsuccessful handle movement.
		function block ( base, stateless ) {

			var target = base.data('target');

			if ( !target.hasClass(clsList[14]) ){

				// The visual effects should not always be applied.
				if ( !stateless ) {
					target.addClass(clsList[15]);
					setTimeout(function(){
						target.removeClass(clsList[15]);
					}, 450);
				}

				target.addClass(clsList[14]);
				call( base.data('options').block, target );
			}
		}

	// Change inline style and apply proper classes.
		function placeHandle ( handle, to ) {

			var settings = handle.data('options');

			to = digits(to, 7);

			// If the slider can move, remove the class
			// indicating the block state.
			handle.data('target').removeClass(clsList[14]);

			// Set handle to new location
			handle.css( settings['style'], to + '%' ).data('pct', to);

			// Force proper handle stacking
			if ( handle.is(':first-child') ) {
				handle.toggleClass(clsList[13], to > 50 );
			}

			if ( settings['direction'] ) {
				to = 100 - to;
			}

			// Write the value to the serialization object.
			handle.data('store').val(
				format ( isPercentage( settings['range'], to ), settings )
			);
		}

	// Test suggested values and apply margin, step.
		function setHandle  ( handle, to ) {

			var base = handle.data('base'), settings = base.data('options'),
				handles = base.data('handles'), lower = 0, upper = 100;

			// Catch invalid user input
			if ( !isNumeric( to ) ){
				return false;
			}

			// Handle the step option.
			if ( settings['step'] ){
				to = closest( to, settings['step'] );
			}

			if ( handles.length > 1 ){
				if ( handle[0] !== handles[0][0] ) {
					lower = digits(handles[0].data('pct')+settings['margin'],7);
				} else {
					upper = digits(handles[1].data('pct')-settings['margin'],7);
				}
			}

			// Limit position to boundaries. When the handles aren't set yet,
			// they return -1 as a percentage value.
			to = Math.min( Math.max( to, lower ), upper < 0 ? 100 : upper );

			// Stop handling this call if the handle can't move past another.
			// Return an array containing the hit limit, so the caller can
			// provide feedback. ( block callback ).
			if ( to === handle.data('pct') ) {
				return [!lower ? false : lower, upper === 100 ? false : upper];
			}

			placeHandle ( handle, to );
			return true;
		}

	// Handles movement by tapping
		function jump ( base, handle, to, callbacks ) {

			/*commenting out the following code (lines 492-495) allows using 
			the style left position of the handle dragger when the slide 
			is triggered.
			You could add the trigger in the setTimeout, 
			but it seems awkawrd and clunky for the reaction to be on 
			a 300 ms timeout */
			
			// Flag the slider as it is now in a transitional state.
			// Transition takes 300 ms, so re-enable the slider afterwards.
			/*base.addClass(clsList[5]);
			setTimeout(function(){
				base.removeClass(clsList[5]);
			}, 300);*/ 

			// Move the handle to the new position.
			setHandle( handle, to );

			// Trigger the 'slide' and 'set' callbacks,
			// pass the target so that it is 'this'.
			call( callbacks, base.data('target') );

			base.data('target').change();
		}


// Event handlers

	// Handle movement on document for handle and range drag.
		function move ( event, Dt, Op ) {

			// Map event movement to a slider percentage.
			var handles = Dt.handles, limits,
				proposal = event[ Dt.point ] - Dt.start[ Dt.point ];

			proposal = ( proposal * 100 ) / Dt.size;

			if ( handles.length === 1 ) {

				// Run handle placement, receive true for success or an
				// array with potential limits.
				limits = setHandle( handles[0], Dt.positions[0] + proposal );

				if ( limits !== true ) {

					if ( $.inArray ( handles[0].data('pct'), limits ) >= 0 ){
						block ( Dt.base, !Op['margin'] );
					}
					return;
				}

			} else {

				// Dragging the range could be implemented by forcing the
				// 'move' event on both handles, but this solution proved
				// lagging on slower devices, resulting in range errors. The
				// slightly ugly solution below is considerably faster, and
				// it can't move the handle out of sync. Bypass the standard
				// setting method, as other checks are needed.

				var l1, u1, l2, u2;

				// Round the proposal to the step setting.
				if ( Op['step'] ) {
					proposal = closest( proposal, Op['step'] );
				}

				// Determine the new position, store it twice. Once for
				// limiting, once for checking whether placement should occur.
				l1 = l2 = Dt.positions[0] + proposal;
				u1 = u2 = Dt.positions[1] + proposal;

				// Round the values within a sensible range.
				if ( l1 < 0 ) {
					u1 += -1 * l1;
					l1 = 0;
				} else if ( u1 > 100 ) {
					l1 -= ( u1 - 100 );
					u1 = 100;
				}

				// Don't perform placement if no handles are to be changed.
				// Check if the lowest value is set to zero.
				if ( l2 < 0 && !l1 && !handles[0].data('pct') ) {
					return;
				}
				// The highest value is limited to 100%.
				if ( u1 === 100 && u2 > 100 && handles[1].data('pct') === 100 ){
					return;
				}

				placeHandle ( handles[0], l1 );
				placeHandle ( handles[1], u1 );
			}

			// Trigger the 'slide' event, if the handle was moved.
			call( Op['slide'], Dt.target );
		}

	// Unbind move events on document, call callbacks.
		function end ( event, Dt, Op ) {

			// The handle is no longer active, so remove the class.
			if ( Dt.handles.length === 1 ) {
				Dt.handles[0].data('grab').removeClass(clsList[4]);
			}

			// Remove cursor styles and text-selection events bound to the body.
			if ( event.cursor ) {
				body.css('cursor', '').off( namespace );
			}

			// Unbind the move and end events, which are added on 'start'.
			doc.off( namespace );

			// Trigger the change event.
			Dt.target.removeClass( clsList[14] +' '+ clsList[20]).change();

			// Trigger the 'end' callback.
			call( Op['set'], Dt.target );
		}

	// Bind move events on document.
		function start ( event, Dt, Op ) {

			// Mark the handle as 'active' so it can be styled.
			if( Dt.handles.length === 1 ) {
				Dt.handles[0].data('grab').addClass(clsList[4]);
			}

			// A drag should never propagate up to the 'tap' event.
			event.stopPropagation();

			// Attach the move event.
			attach ( actions.move, doc, move, {
				 start: event
				,base: Dt.base
				,target: Dt.target
				,handles: Dt.handles
				,positions: [ Dt.handles[0].data('pct')
					   ,Dt.handles[ Dt.handles.length - 1 ].data('pct') ]
				,point: Op['orientation'] ? 'pointY' : 'pointX'
				,size: Op['orientation'] ? Dt.base.height() : Dt.base.width()
			});

			// Unbind all movement when the drag ends.
			attach ( actions.end, doc, end, {
				 target: Dt.target
				,handles: Dt.handles
			});

			// Text selection isn't an issue on touch devices,
			// so adding additional callbacks isn't required.
			if ( event.cursor ) {

				// Prevent the 'I' cursor and extend the range-drag cursor.
				body.css('cursor', $(event.target).css('cursor'));

				// Mark the target with a dragging state.
				if ( Dt.handles.length > 1 ) {
					Dt.target.addClass(clsList[20]);
				}

				// Prevent text selection when dragging the handles.
				body.on('selectstart' + namespace, function( ){
					return false;
				});
			}
		}

	// Move closest handle to tapped location.
		function tap ( event, Dt, Op ) {

			var base = Dt.base, handle, to, point, size;

			// The tap event shouldn't propagate up to trigger 'edge'.
			event.stopPropagation();

			// Determine the direction of the slider.
			if ( Op['orientation'] ) {
				point = event['pointY'];
				size = base.height();
			} else {
				point = event['pointX'];
				size = base.width();
			}

			// Find the closest handle and calculate the tapped point.
			handle = closestHandle( base.data('handles'), point, Op['style'] );
			to = (( point - base.offset()[ Op['style'] ] ) * 100 ) / size;

			// The set handle to the new position.
			jump( base, handle, to, [ Op['slide'], Op['set'] ]);
		}

	// Move handle to edges when target gets tapped.
		function edge ( event, Dt, Op ) {

			var handles = Dt.base.data('handles'), to, i;

			i = Op['orientation'] ? event['pointY'] : event['pointX'];
			i = i < Dt.base.offset()[Op['style']];

			to = i ? 0 : 100;
			i = i ? 0 : handles.length - 1;

			jump ( Dt.base, handles[i], to, [ Op['slide'], Op['set'] ]);
		}

// API

	// Validate and standardize input.
		function test ( input, sliders ){

	/*	Every input option is tested and parsed. This'll prevent
		endless validation in internal methods. These tests are
		structured with an item for every option available. An
		option can be marked as required by setting the 'r' flag.
		The testing function is provided with three arguments:
			- The provided value for the option;
			- A reference to the options object;
			- The name for the option;

		The testing function returns false when an error is detected,
		or true when everything is OK. It can also modify the option
		object, to make sure all values can be correctly looped elsewhere. */

			function values ( a ) {

				if ( a.length !== 2 ){
					return false;
				}

				// Convert the array to floats
				a = [ parseFloat(a[0]), parseFloat(a[1]) ];

				// Test if all values are numerical
				if( !isNumeric(a[0]) || !isNumeric(a[1]) ){
					return false;
				}

				// The lowest value must really be the lowest value.
				if( a[1] < a[0] ){
					return false;
				}

				return a;
			}

			var serialization = {
				 resolution: function(q,o){

					// Parse the syntactic sugar that is the serialization
					// resolution option to a usable integer.
					// Checking for a string '1', since the resolution needs
					// to be cast to a string to split in on the period.
					switch( q ){
						case 1:
						case 0.1:
						case 0.01:
						case 0.001:
						case 0.0001:
						case 0.00001:
							q = q.toString().split('.');
							o['decimals'] = q[0] === '1' ? 0 : q[1].length;
							break;
						case undefined:
							o['decimals'] = 2;
							break;
						default:
							return false;
					}

					return true;
				}
				,mark: function(q,o,w){

					if ( !q ) {
						o[w]['mark'] = '.';
						return true;
					}

					switch( q ){
						case '.':
						case ',':
							return true;
						default:
							return false;
					}
				}
				,to: function(q,o,w){

					// Checks whether a variable is a candidate to be a
					// valid serialization target.
					function ser(r){
						return isInstance ( r ) ||
							typeof r === 'string' ||
							typeof r === 'function' ||
							r === false ||
							( isInstance ( r[0] ) &&
							  typeof r[0][r[1]] === 'function' );
					}

					// Flatten the serialization array into a reliable
					// set of elements, which can be tested and looped.
					function filter ( value ) {

						var items = [[],[]];

						// If a single value is provided it can be pushed
						// immediately.
						if ( ser(value) ) {
							items[0].push(value);
						} else {

							// Otherwise, determine whether this is an
							// array of single elements or sets.
							$.each(value, function(i, val) {

								// Don't handle an overflow of elements.
								if( i > 1 ){
									return;
								}

								// Decide if this is a group or not
								if( ser(val) ){
									items[i].push(val);
								} else {
									items[i] = items[i].concat(val);
								}
							});
						}

						return items;
					}

					if ( !q ) {
						o[w]['to'] = [[],[]];
					} else {

						var i, j;

						// Flatten the serialization array
						q = filter ( q );

						// Reverse the API for RTL sliders.
						if ( o['direction'] && q[1].length ) {
							q.reverse();
						}

						// Test all elements in the flattened array.
						for ( i = 0; i < o['handles']; i++ ) {
							for ( j = 0; j < q[i].length; j++ ) {

								// Return false on invalid input
								if( !ser(q[i][j]) ){
									return false;
								}

								// Remove 'false' elements, since those
								// won't be handled anyway.
								if( !q[i][j] ){
									q[i].splice(j, 1);
								}
							}
						}

						// Write the new values back
						o[w]['to'] = q;
					}

					return true;
				}
			}, tests = {
				/*	Handles.
				 *	Has default, can be 1 or 2.
				 */
				 'handles': {
					 'r': true
					,'t': function(q){
						q = parseInt(q, 10);
						return ( q === 1 || q === 2 );
					}
				}
				/*	Range.
				 *	Must be an array of two numerical floats,
				 *	which can't be identical.
				 */
				,'range': {
					 'r': true
					,'t': function(q,o,w){

						o[w] = values(q);

						// The values can't be identical.
						return o[w] && o[w][0] !== o[w][1];
					}
				 }
				/*	Start.
				 *	Must be an array of two numerical floats when handles = 2;
				 *	Uses 'range' test.
				 *	When handles = 1, a single float is also allowed.
				 */
				,'start': {
					 'r': true
					,'t': function(q,o,w){
						if( o['handles'] === 1 ){
							if( $.isArray(q) ){
								q = q[0];
							}
							q = parseFloat(q);
							o.start = [q];
							return isNumeric(q);
						}

						o[w] = values(q);
						return !!o[w];
					}
				}
				/*	Connect.
				 *	Must be true or false when handles = 2;
				 *	Can use 'lower' and 'upper' when handles = 1.
				 */
				,'connect': {
					 'r': true
					,'t': function(q,o,w){

						if ( q === 'lower' ) {
							o[w] = 1;
						} else if ( q === 'upper' ) {
							o[w] = 2;
						} else if ( q === true ) {
							o[w] = 3;
						} else if ( q === false ) {
							o[w] = 0;
						} else {
							return false;
						}

						return true;
					}
				}
				/*	Connect.
				 *	Will default to horizontal, not required.
				 */
				,'orientation': {
					 't': function(q,o,w){
						switch (q){
							case 'horizontal':
								o[w] = 0;
								break;
							case 'vertical':
								o[w] = 1;
								break;
							default: return false;
						}
						return true;
					}
				}
				/*	Margin.
				 *	Must be a float, has a default value.
				 */
				,'margin': {
					 'r': true
					,'t': function(q,o,w){
						q = parseFloat(q);
						o[w] = fromPercentage(o['range'], q);
						return isNumeric(q);
					}
				}
				/*	Direction.
				 *	Required, can be 'ltr' or 'rtl'.
				 */
				,'direction': {
					 'r': true
					,'t': function(q,o,w){

						switch ( q ) {
							case 'ltr': o[w] = 0;
								break;
							case 'rtl': o[w] = 1;
								// Invert connection for RTL sliders;
								o['connect'] = [0,2,1,3][o['connect']];
								break;
							default:
								return false;
						}

						return true;
					}
				}
				/*	Behaviour.
				 *	Required, defines responses to tapping and
				 *	dragging elements.
				 */
				,'behaviour': {
					 'r': true
					,'t': function(q,o,w){

						o[w] = {
							 'tap': q !== (q = q.replace('tap', ''))
							,'extend': q !== (q = q.replace('extend', ''))
							,'drag': q !== (q = q.replace('drag', ''))
							,'fixed': q !== (q = q.replace('fixed', ''))
						};

						return !q.replace('none','').replace(/\-/g,'');
					}
				}
				/*	Serialization.
				 *	Required, but has default. Must be an array
				 *	when using two handles, can be a single value when using
				 *	one handle. 'mark' can be period (.) or comma (,).
				 */
				,'serialization': {
					 'r': true
					,'t': function(q,o,w){

						return serialization.to( q['to'], o, w ) &&
							   serialization.resolution( q['resolution'], o ) &&
							   serialization.mark( q['mark'], o, w );
					}
				}
				/*	Slide.
				 *	Not required. Must be a function.
				 */
				,'slide': {
					 't': function(q){
						return $.isFunction(q);
					}
				}
				/*	Set.
				 *	Not required. Must be a function.
				 *	Tested using the 'slide' test.
				 */
				,'set': {
					 't': function(q){
						return $.isFunction(q);
					}
				}
				/*	Block.
				 *	Not required. Must be a function.
				 *	Tested using the 'slide' test.
				 */
				,'block': {
					 't': function(q){
						return $.isFunction(q);
					}
				}
				/*	Step.
				 *	Not required.
				 */
				,'step': {
					 't': function(q,o,w){
						q = parseFloat(q);
						o[w] = fromPercentage ( o['range'], q );
						return isNumeric(q);
					}
				}
			};

			$.each( tests, function( name, test ){

				/*jslint devel: true */

				var value = input[name], isSet = value !== undefined;

				// If the value is required but not set, fail.
				if( ( test['r'] && !isSet ) ||
				// If the test returns false, fail.
					( isSet && !test['t']( value, input, name ) ) ){

					// For debugging purposes it might be very useful to know
					// what option caused the trouble. Since throwing an error
					// will prevent further script execution, log the error
					// first. Test for console, as it might not be available.
					if( console && console.log && console.group ){
						console.group( 'Invalid noUiSlider initialisation:' );
						console.log( 'Option:\t', name );
						console.log( 'Value:\t', value );
						console.log( 'Slider(s):\t', sliders );
						console.groupEnd();
					}

					throw new RangeError('noUiSlider');
				}
			});
		}

	// Parse options, add classes, attach events, create HTML.
		function create ( options ) {

			/*jshint validthis: true */

			// Store the original set of options on all targets,
			// so they can be re-used and re-tested later.
			// Make sure to break the relation with the options,
			// which will be changed by the 'test' function.
			this.data('options', $.extend(true, {}, options));

			// Set defaults where applicable;
			options = $.extend({
				 'handles': 2
				,'margin': 0
				,'connect': false
				,'direction': 'ltr'
				,'behaviour': 'tap'
				,'orientation': 'horizontal'
			}, options);

			// Make sure the test for serialization runs.
			options['serialization'] = options['serialization'] || {};

			// Run all options through a testing mechanism to ensure correct
			// input. The test function will throw errors, so there is
			// no need to capture the result of this call. It should be noted
			// that options might get modified to be handled properly. E.g.
			// wrapping integers in arrays.
			test( options, this );

			// Pre-define the styles.
			options['style'] = options['orientation'] ? 'top' : 'left';

			return this.each(function(){

				var target = $(this), i, dragable, handles = [], handle,
					base = $('<div/>').appendTo(target);

				// Throw an error if the slider was already initialized.
				if ( target.data('base') ) {
					throw new Error('Slider was already initialized.');
				}

				// Apply classes and data to the target.
				target.data('base', base).addClass([
					clsList[6]
				   ,clsList[16 + options['direction']]
				   ,clsList[10 + options['orientation']] ].join(' '));

				for (i = 0; i < options['handles']; i++ ) {

					handle = $('<div><div/></div>').appendTo(base);

					// Add all default and option-specific classes to the
					// origins and handles.
					handle.addClass( clsList[1] );

					handle.children().addClass([
						clsList[2]
					   ,clsList[2] + clsList[ 7 + options['direction'] +
						( options['direction'] ? -1 * i : i ) ]].join(' ') );

					// Make sure every handle has access to all variables.
					handle.data({
						 'base': base
						,'target': target
						,'options': options
						,'grab': handle.children()
						,'pct': -1
					}).attr('data-style', options['style']);

					// Every handle has a storage point, which takes care
					// of triggering the proper serialization callbacks.
					handle.data({
						'store': store(handle, i, options['serialization'])
					});

					// Store handles on the base
					handles.push(handle);
				}

				// Apply the required connection classes to the elements
				// that need them. Some classes are made up for several
				// segments listed in the class list, to allow easy
				// renaming and provide a minor compression benefit.
				switch ( options['connect'] ) {
					case 1:	target.addClass( clsList[9] );
							handles[0].addClass( clsList[12] );
							break;
					case 3: handles[1].addClass( clsList[12] );
							/* falls through */
					case 2: handles[0].addClass( clsList[9] );
							/* falls through */
					case 0: target.addClass(clsList[12]);
							break;
				}

				// Merge base classes with default,
				// and store relevant data on the base element.
				base.addClass( clsList[0] ).data({
					 'target': target
					,'options': options
					,'handles': handles
				});

				// Use the public value method to set the start values.
				target.val( options['start'] );

				// Attach the standard drag event to the handles.
				if ( !options['behaviour']['fixed'] ) {
					for ( i = 0; i < handles.length; i++ ) {

						// These events are only bound to the visual handle
						// element, not the 'real' origin element.
						attach ( actions.start, handles[i].children(), start, {
							 base: base
							,target: target
							,handles: [ handles[i] ]
						});
					}
				}

				// Attach the tap event to the slider base.
				if ( options['behaviour']['tap'] ) {
					attach ( actions.start, base, tap, {
						 base: base
						,target: target
					});
				}

				// Extend tapping behaviour to target
				if ( options['behaviour']['extend'] ) {

					target.addClass( clsList[19] );

					if ( options['behaviour']['tap'] ) {
						attach ( actions.start, target, edge, {
							 base: base
							,target: target
						});
					}
				}

				// Make the range dragable.
				if ( options['behaviour']['drag'] ){

					dragable = base.find('.'+clsList[9]).addClass(clsList[18]);

					// When the range is fixed, the entire range can
					// be dragged by the handles. The handle in the first
					// origin will propagate the start event upward,
					// but it needs to be bound manually on the other.
					if ( options['behaviour']['fixed'] ) {
						dragable = dragable
							.add( base.children().not(dragable).data('grab') );
					}

					attach ( actions.start, dragable, start, {
						 base: base
						,target: target
						,handles: handles
					});
				}
			});
		}

	// Return value for the slider, relative to 'range'.
		function getValue ( ) {

			/*jshint validthis: true */

			var base = $(this).data('base'), answer = [];

			// Loop the handles, and get the value from the input
			// for every handle on its' own.
			$.each( base.data('handles'), function(){
				answer.push( $(this).data('store').val() );
			});

			// If the slider has just one handle, return a single value.
			// Otherwise, return an array, which is in reverse order
			// if the slider is used RTL.
			if ( answer.length === 1 ) {
				return answer[0];
			}

			if ( base.data('options').direction ) {
				return answer.reverse();
			}

			return answer;
		}

	// Set value for the slider, relative to 'range'.
		function setValue ( args, set ) {

			/*jshint validthis: true */

			// If the value is to be set to a number, which is valid
			// when using a one-handle slider, wrap it in an array.
			if( !$.isArray(args) ){
				args = [args];
			}

			// Setting is handled properly for each slider in the data set.
			return this.each(function(){

				var b = $(this).data('base'), to, i,
					handles = Array.prototype.slice.call(b.data('handles'),0),
					settings = b.data('options');

				// If there are multiple handles to be set run the setting
				// mechanism twice for the first handle, to make sure it
				// can be bounced of the second one properly.
				if ( handles.length > 1) {
					handles[2] = handles[0];
				}

				// The RTL settings is implemented by reversing the front-end,
				// internal mechanisms are the same.
				if ( settings['direction'] ) {
					args.reverse();
				}

				for ( i = 0; i < handles.length; i++ ){

					// Calculate a new position for the handle.
					to = args[ i%2 ];

					// The set request might want to ignore this handle.
					// Test for 'undefined' too, as a two-handle slider
					// can still be set with an integer.
					if( to === null || to === undefined ) {
						continue;
					}

					// Add support for the comma (,) as a decimal symbol.
					// Replace it by a period so it is handled properly by
					// parseFloat. Omitting this would result in a removal
					// of decimals. This way, the developer can also
					// input a comma separated string.
					if( $.type(to) === 'string' ) {
						to = to.replace(',', '.');
					}

					// Calculate the new handle position
					to = toPercentage( settings['range'], parseFloat( to ) );

					// Invert the value if this is an right-to-left slider.
					if ( settings['direction'] ) {
						to = 100 - to;
					}

					// If the value of the input doesn't match the slider,
					// reset it. Sometimes the input is changed to a value the
					// slider has rejected. This can occur when using 'select'
					// or 'input[type="number"]' elements. In this case, set
					// the value back to the input.
					if ( setHandle( handles[i], to ) !== true ){
						handles[i].data('store').val( true );
					}

					// Optionally trigger the 'set' event.
					if( set === true ) {
						call( settings['set'], $(this) );
					}
				}
			});
		}

	// Unbind all attached events, remove classed and HTML.
		function destroy ( target ) {

			// Start the list of elements to be unbound with the target.
			var elements = [[target,'']];

			// Get the fields bound to both handles.
			$.each(target.data('base').data('handles'), function(){
				elements = elements.concat( $(this).data('store').elements );
			});

			// Remove all events added by noUiSlider.
			$.each(elements, function(){
				if( this.length > 1 ){
					this[0].off( namespace );
				}
			});

			// Remove all classes from the target.
			target.removeClass(clsList.join(' '));

			// Empty the target and remove all data.
			target.empty().removeData('base options');
		}

	// Merge options with current initialization, destroy slider
	// and reinitialize.
		function build ( options ) {

			/*jshint validthis: true */

			return this.each(function(){

				// When uninitialised, jQuery will return '',
				// Zepto returns undefined. Both are falsy.
				var values = $(this).val() || false,
					current = $(this).data('options'),
				// Extend the current setup with the new options.
					setup = $.extend( {}, current, options );

				// If there was a slider initialised, remove it first.
				if ( values !== false ) {
					destroy( $(this) );
				}

				// Make the destroy method publicly accessible.
				if( !options ) {
					return;
				}

				// Create a new slider
				$(this)['noUiSlider']( setup );

				// Set the slider values back. If the start options changed,
				// it gets precedence.
				if ( values !== false && setup.start === current.start ) {
					$(this).val( values );
				}
			});
		}

	// Overwrite the native jQuery value function
	// with a simple handler. noUiSlider will use the internal
	// value method, anything else will use the standard method.
		$.fn.val = function(){

			// If the function is called without arguments,
			// act as a 'getter'. Call the getValue function
			// in the same scope as this call.
			if ( this.hasClass( clsList[6] ) ){
				return arguments.length ?
					setValue.apply( this, arguments ) :
					getValue.apply( this );
			}

			// If this isn't noUiSlider, continue with jQuery's
			// original method.
			return $VAL.apply( this, arguments );
		};

		return ( rebuild ? build : create ).call( this, options );
	};

}( window['jQuery'] || window['Zepto'] ));

!(function($) {
	function AddInputs( $elt, $mturkForm ) {
		this.$main = $elt;
		this.$mturkForm = $mturkForm;
		this.$pageNumber = $( '.page-number [data-current-page]' );
		this.inp = 'input';
		this.inpNum = 'input[type="number"]';
		this.inpText = 'input[type="text"]';
		this.check = ':checked';
		this.questionContent = '.question-content';
		this.tokenSliderWrapper = '.token-slider-wrapper';
		this.tokenSlider = '.token-slider';

		// onePic has not been called before
		this.onePicCalled = false;
	}

	AddInputs.prototype = {
		// driver to decide which method of addInpts to call
		updateInputs: function( pageNum ) {
			var $inpts = this.$main.find( this.inp ),
				$tokens = $( this.tokenSliderWrapper );

			// only calls add inputs if there are inputs or tokens on the page
			// other wise the page is a intro title page and should not have inputs added
			if ( $inpts.length !== 0 || $tokens.length !== 0 ) {	
				// if the politician and voting line aren't finished displaying 
				// add the input for two pics
				if ( ( pageNum >= 4 && pageNum <= 8 ) || pageNum === 10 ) {
					this.twoPics();
				} else if ( pageNum >= 12 && pageNum <= 15 ) {
					this.onePic();
				} else if ( pageNum >= 19 && pageNum <= 29 ) {
					this.token( $tokens );
				} else if ( pageNum === 31 ) {
					this.appendAll();
				}
			}
		},

		// append the input that was clicked for two pictures
		twoPics: function() {
			// get the input that is checked
			var $inpts = this.$main.find( this.inp + this.check ),
				name = $inpts.attr( 'name' ) + '-LR', // get the name
				picSide = this.generateHiddenInput( name, $inpts.data( 'indx' ) ); //get the side that was clicked

			// hide the input that was clicked
			$inpts.attr( 'type', 'hidden' );
			// append it to the mturk form
			this.$mturkForm.append( $inpts, picSide );
		},

		// append input result for one pic
		onePic: function() {
			var sideChoice = null,
				$decision = null
				$inpts = null;

			// if this is the first time onePic is called
			if ( !this.onePicCalled ) {
				// get the side of the page that the pres-nominee is on
				// and create hidden input with val to append to mturk data
				sideChoice = this.generateHiddenInput( 'obama-LR', this.$main.find( this.inp + '[id="obama"]').data( 'indx' ) );
				this.onePicCalled = true;
			}

			// get input that was clicked
			$inpts = this.$main.find( this.inp + this.check );
			// clone it so as to keep the pol name on the same side
			$decision = $inpts.clone();
			// remvoe id from decision
			$decision.removeAttr( 'id' );
			$decision.attr('type', 'hidden')
			// append to mturk
			this.$mturkForm.append( $decision, sideChoice );
		},

		// append inputs for tokens
		token: function( $tokens ) {
			// get default slider side
			var sliderSide = $tokens.data( 'side' ), 
				tokenStart = $( this.questionContent ).data('you-own-tokens'),//number of tokens started with
				yourTokenVal = parseInt( $( this.tokenSlider).val() ), // tokens selected 
				tokenOrder = parseInt( this.$pageNumber.text() ) - 18, // starts at 1, 1st token at page 18
				sideInp = this.generateHiddenInput( tokenStart + '_slider_L', sliderSide  ), //create hidden input for default slider side
				keepInp = this.generateHiddenInput( tokenStart + '_keep', yourTokenVal ), // create hiddne input for token amount
				orderInp = this.generateHiddenInput( tokenStart + '_order', tokenOrder ); // create hidden input for token order

			this.$mturkForm.append( sideInp, keepInp, orderInp );
		},

		// append all check inputs, text inputs with a length > 1
		// and number inputs to the mturk Form
		appendAll: function() {
			// get input that was clicked
			var $inpts = this.$main.find( this.inp + this.check ), 
				$numInpts = this.$main.find( this.inpNum ),
				$textInpts = this.$main.find( this.inpText );

			// hide the inputs that are being appended to the mturk form
			$inpts.attr( 'type', 'hidden' );
			$numInpts.attr( 'type', 'hidden' );
			$textInpts.attr( 'type', 'hidden' );

			// textInpt is only for other, only append if it has a value
			if ( $textInpts.val().length > 0 ) {
				this.$mturkForm.append( $textInpts );
			}

			// append inputs to mturk
			this.$mturkForm.append( $inpts, $numInpts );
		},

		// generate a hidden input given a name and value
		generateHiddenInput: function( name, value ) {
			return '<input type="hidden"' + ' name="' + name + '" value="' + value + '" >';
		}
	}

	$.fn.addInputs = function( $mturkForm ) {
		var inpts = new AddInputs( this, $mturkForm );
		return inpts;
	}
})(window.jQuery);
/* DATA OPTIONS FOR DIFFERENT TEMPLATES */  
// intro for templates
var contextIntro = {
    header: 'Overview of tasks',

    desc: [
        'This is a study in decision making that has three parts.  You will earn a 50 cent base pay for completing the study.',
        'In the first part, we will ask you to tell us what you think about various images.',
        'In the second part, you will have a chance to earn a bonus.  Your earnings for the second part will be in tokens, which will be converted to money.  Every 10 tokens you earn is worth $1 to you.  Your earnings will depend on the decisions you make and on the decisions that the other worker you are paired with will make.',
        'In the final third part, we will ask you to tell us about yourself.',
        'You will be paid the base plus the bonus within 3 days after you complete this task.',
        '<h2 class="error display heavy">Note: If you are using Internet Explorer you will not be able to complete the survey. Please try using Safari, Firefox, or Chrome.</h2>'
    ]
}

// politician intro
var contextPolIntro = {
    header: 'Tell us what you think',

    desc: [
        'You will now be shown several pairs of pictures of politicians.  Please indicate which politician in each pair you find more attractive.'
    ]
}

// politician data
var contextPol = {
    question: 'Please indicate which politician in each pair you find more attractive',

    errorText: 'Please select one of the politicians above',

    photos: [
        {
            images: [
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/BillClinton.jpg',
                    alt: 'Bill Clinton photo',
                    id: 'bill-clinton', 
                    label: 'Bill Clinton',
                    name: 'ex-presidents',
                    value: '0'
                },
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/RonaldReagan.jpg',
                    alt: 'Ronald Reagan Photo',
                    id: 'ronald-reagan',
                    label: 'Ronald Reagan',
                    name: 'ex-presidents',
                    value: '1'
                }
            ]
        },
        {
            images: [
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/MitchMcConnell.jpg',
                    alt: 'Mitch McConnell photo',
                    id: 'mitch-mcconnell', 
                    label: 'Mitch McConnell',
                    name: 'senators',
                    value: '1'
                },
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/HarryReid.jpg',
                    alt: 'Harry Reid Photo',
                    id: 'harry-reid',
                    label: 'Harry Reid',
                    name: 'senators',
                    value: '0'
                }
            ]
        },
        {
            images: [
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/JanBrewer.jpg',
                    alt: 'Jan Brewer photo',
                    id: 'jan-brewer', 
                    label: 'Jan Brewer',
                    name: 'governors',
                    value: '1'
                },
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/KathleenSebelius.jpg',
                    alt: 'Kathleen Sebelius Photo',
                    id: 'kathleen-sebelius',
                    label: 'Kathleen Sebelius',
                    name: 'governors',
                    value: '0'
                }
            ]
        },
        {
            images: [
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/MicheleBachmann.jpg',
                    alt: 'Michelle Bachmann photo',
                    id: 'michelle-bachmann', 
                    label: 'Michelle Bachmann',
                    name: 'house-reps',
                    value: '1'
                },
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/NancyPelosi.jpg',
                    alt: 'Nancy Pelosi  Photo',
                    id: 'nancy-pelosi',
                    label: ' Nancy Pelosi',
                    name: 'house-reps',
                    value: '0'
                }
            ]
        },
        {
            images: [
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/JoeBiden.jpg',
                    alt: 'Joe Biden photo',
                    id: 'joe-biden', 
                    label: 'Joe Biden',
                    name: 'vice-presidents',
                    value: '0'
                },
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/DickCheney.jpg',
                    alt: 'Dick Cheney Photo',
                    id: 'Dick-Cheney',
                    label: 'Dick Cheney',
                    name: 'vice-presidents',
                    value: '1'
                }
            ]
        }
    ]
}

// voting line intro
var contextVotingLineIntro = {
    header: 'Tell us what you think',

    desc: [
        'On the next screen you will see two images of voting lines.  Please indicate which voting line you think is the longest.'
    ]
}

// voting line data
var contextVotingLine = {
    validateType: 'radio',

    question: 'Please indicate which voting line you think is longest.',

    errorText: 'Please select one of the voting lines above',

    photos: [
        {
            images: [
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/VotingLine1.jpg',
                    alt: 'Voting line photo',
                    id: 'voting-line-1', 
                    label: 'I think this voting line is longest',
                    name: 'voting-line',
                    value: 0
                },
                {
                    src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/VotingLine2.jpg',
                    alt: 'Voting Line Photo',
                    id: 'voting-line-2',
                    label: 'I think this voting line is longest',
                    name: 'voting-line',
                    value: 1
                }
            ]
        }
    ]
}

// state questions intro
var contextStatesIntro = {
    header: 'Tell us what you think',

    desc: [
        'You will now be shown several states.  For each state, please answer the following question: Which presidential candidate, Barack Obama or Mitt Romney, won this state’s electoral votes in the 2012 presidential election?',
    ]
}

// states data intro
var contextStates = {
    validateType: 'radio',

    question: 'Which presidential candidate, Barack Obama or Mitt Romney, won this state’s electoral votes in the 2012 presidential election?',

    errorText: 'Please select one of the presdential candidates above',

    states: [
        {
            src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/NorthCarolina.png',
            alt: 'North Carolina photo',
            name: 'north-carolina',
            state: 'North Carolina'
        },
        {
            src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/Georgia.png',
            alt: 'Georgia photo',
            name: 'georgia',
            state: 'Georgia'
        },
        {
            src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/Florida.png',
            alt: 'Florida photo',
            name: 'florida',
            state: 'Florida'
        },
        {
            src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/images/Ohio.png',
            alt: 'Ohio photo',
            name: 'ohio',
            state: 'Ohio'
        }
    ],

    options: [
        {
            name: 'obama',
            id: 'obama',
            text: 'Barack Obama',
            value: 0
        },
        {
            name: 'obama',
            id: 'Romney',
            text: 'Mitt Romney',
            value: 1
        }
    ]
}

// token intro
var contextTokenIntro = {
    header: "Bonus Task",

    descAll: [
        [
            'For the following task, you will be randomly paired with another person, whom we will call your match.  The match will be randomly selected from the other workers.',
        ],
        [
            'You will be shown 11 situations. In each situation, at least one of you will be holding some number of tokens. You will then decide whether you would like to give some tokens to your match, take some tokens from your match or do nothing.',
            
        ],
        [
            'When you and your match have entered all of your decisions, we will then randomly pick one of the decisions from the set that you and your match made.  The selected decision will determine the final token split between you and your match and will be paid out to you as a bonus for this task.'
        ]
    ]
}

// potential order of tokens
var contextTokens = [
    [10,9,8,7,6,5,4,3,2,1,0],
    [0,1,2,3,4,5,6,7,8,9,10],
    [5,10,9,8,7,6,4,3,2,1,0],
    [5,0,1,2,3,4,6,7,8,9,10]
];

// survey intro
var contextSurveyIntro = {
    header: 'Tell us about yourself',

    desc: [
        'Please complete the following demographic survey.  Your responses will not be connected to your worker ID.' 
    ]
}

// survey data
var contextSurvey = {
    politics: {
        question: 'In politics, as of today, do you consider yourself:',
        name: 'pol-classification',
        error: 'political classifications',
        inputs: [
            {
                id: 'republican',
                label: 'a Republican'
            },
            {
                id: 'democrat',
                label: 'a Democrat'
            },
            {
                id: 'democratish',
                label: 'leaning more towards the Democratic party'
            },
            {
                id: 'republicanish',
                label: 'leaning more towards the Republican party'
            }
        ]
    },

    age: {
        error: 'age'
    },

    gender: {
        question: 'What is your gender?',
        name: 'gender',
        inputs: [
            {
                id: 'male',
                label: 'male'
            },
            {
                id: 'female',
                label: 'female'
            }
        ],
        error: 'genders'
    },

    race: {
        question: 'Which of the following best describes your racial or ethnic background?',
        name: 'race',
        inputs: [
            {
                id: 'asian',
                label: 'Asian/Pacific Islander'
            },
            {
                id: 'black',
                label: 'Black'
            },
            {
                id: 'latino',
                label: 'Hispanic/Latino'
            },
            {
                id: 'white',
                label: 'white'
            }
        ],
        other: {
            id: 'other',
            label: 'other',
            use: {},
            idText: 'other-text'
        },
        error: 'ethnicities'
    },

    voted: {
        question: 'Have you ever voted in a government election?',
        name: 'voted',
        inputs: [
            {
                id: 'yes',
                label: 'yes'
            },
            {
                id: 'no',
                label: 'no'
            }
        ],
        error: 'selections'
    }
}

var contextThankYou = {
    header: 'Thank You',

    desc: [
        'Thank you for participating in our study.' 
    ]
}
// get a random group of politician 
// and place one of the sets of politicians on a random side of the page (left, right)
Handlebars.registerHelper('randomPol', function( context, options ) {
	var contextLen = context.length, 
		contextRan = Math.floor( Math.random() * contextLen ), // get random item
		out = '',
		imgs = context[contextRan].images,
		imgsLen = imgs.length,
		imgsRand = Math.floor( Math.random() * imgsLen ),
		imgInfo = null;

	while ( imgsLen != 0 ) {
		imgInfo = imgs[imgsRand];
		// indx 1 = left side of page, indx 0 = right
		imgInfo.indx = imgsLen - 1;
		out += options.fn( imgInfo ); // get random image context
		imgs.splice( imgsRand, 1 );
		imgsLen = imgs.length;
		imgsRand = Math.floor( Math.random() * imgsLen ); 
	}

	context.splice( contextRan, 1 );
	return out;
});

// get random item from context
Handlebars.registerHelper('randomItem', function(context, options) {
	var item = randomItem( context );
	return options.fn( item );
});

// random input for one pic with two input options
Handlebars.registerHelper('randomInput', function(context, options) {
	var out = '';

	for ( var contextLen = context.length; contextLen != 0; contextLen = context.length ) {
		var item = randomItem( context );
		item.indx = contextLen - 1;
		out += options.fn( item );
	}
	return out;
});

// get a random item from the context list and delete it from the list
function randomItem( context ) {
	var contextLen = context.length, 
		contextRan = Math.floor( Math.random() * contextLen ), // get random item
		contextItem = context[contextRan];

	context.splice( contextRan, 1);
	return contextItem;
}	

// set random token value and function to token value and corresponding text
(function() {
	var yourTokenVal = null,
		otherTokenVal = null,
		randomTokenList = null; //get random token order
		
		// text for end of the transfer range
		endRange = ' If this decision is selected for payment this will determine how many tokens each person gets'

	Handlebars.registerHelper('setRandomToken', function( context ) {
		if ( !randomTokenList ) {
			randomTokenList = randomItem( context );
		} 
		yourTokenVal = randomTokenList[0];
		otherTokenVal = Math.abs( yourTokenVal - 10 ); // assign other token
		randomTokenList.splice( 0, 1 ); //delete the first item from the random token list to not recieve it again
		return yourTokenVal;
	});

	Handlebars.registerHelper('getYourToken', function() {
		return yourTokenVal;
	});

	Handlebars.registerHelper('getOtherToken', function() {
		return otherTokenVal;
	});

	// get text function to return 'tokens' if more than 1 token or 'token' if else
	Handlebars.registerHelper('getYourTokenText', function() {
		return yourTokenVal === 1 ? 'token' : 'tokens';
	});

	Handlebars.registerHelper('getOtherTokenText', function() {
		return otherTokenVal === 1 ? 'token' : 'tokens';
	});
	
	Handlebars.registerHelper('transferText', function() {
		var out = 'You have the opportunity to ';
		
		if ( yourTokenVal == 10) {
			out += ' give any amount of your ' +  '<span class="you-own-tokens">' + yourTokenVal + '</span>' + ' tokens to the other person ' + endRange;
		}
		else if ( yourTokenVal == 0 ) {
			out += ' take any of the ' + '<span class="other-own-tokens">' + otherTokenVal + '</span>' + ' tokens from the other person ' + endRange;
		}
		else {
			out += ' give any amount of your ' + '<span class="you-own-tokens">' + yourTokenVal + '</span>' + ' tokens or to take any amount of the ' + '<span class="other-own-tokens">' + otherTokenVal + '</span>' + ' tokens from the other person for yourself. ' + endRange;
		}
		
		out += '.'
		
		return out;
	});
	
})();

// create the random slider side
function RandomSlider() {
	// left = 0, right = 1 for neutral
	var sliderSide = null,
		neutralSlider = '<div class="col-sm-1 col-md-1"><div class="token-default-slider"></div></div>',
		tokenSlider = '<div class="col-sm-11 col-md-11"><div class="token-slider"></div></div>',
		tokenFiller = '<div class="token-filler"></div>';

	Handlebars.registerHelper('setSliderSide', function() {
		// left = 0, right = 1 for neutral
		sliderSide = Math.floor( Math.random() * 2 );

		return sliderSide;
	});

	Handlebars.registerHelper('generateSliderDivs', function(context, options) {
		var out = '';
		
		if ( sliderSide ) {
			out += tokenSlider;
			out += tokenFiller;
			out += neutralSlider;
		} else {
			out += neutralSlider;
			out += tokenFiller;
			out += tokenSlider;
		}

		 return new Handlebars.SafeString( out );
	});
}


$(function() {
	$('main').nextQuestion();
});
// methods that don't seem to logically fit in other classes go here
!(function($) {
	function Misc( $elt ) {
		this.$main = $elt;
		this.$pageNumber = $( '.page-number [data-current-page]' );
		this.image = 'img';
		this.inp = 'input';

		// data attr selectors
		this.dataName = 'data-name';

		return this;
	};

	Misc.prototype = {
		//update page number at top of page
		updatePageNumber: function() {
			var prevPageNum = parseInt( this.$pageNumber.text() ); // convert the value to a string

			this.$pageNumber.text( ++prevPageNum );
			return prevPageNum;
		},

		removePageNumber: function() {
			this.$pageNumber.remove();
		},

		// scroll up to top of the page
		scrollUp: function() {
			$("html, body").animate({ scrollTop: 0 }, "slow");
		},


		fixInputName: function() {
			var state = $( this.image ).attr( this.dataName ),
				$inputs = this.$main.find( this.inp );

			$inputs.each(function() {
				this.name = state;
			});
		},

		
		clearCheckedValues: function() {
			$( this.inp ).prop('checked', false);
		},

		radioOther: function() {
			// by default radio input text box is disabled
			$( 'input[type="text"][id="other-text"]' ).prop('disabled', true);

			// when other radio button is clicked enable other input text, if not don't enable it
			$( 'body' ).on('change', 'input[name="race"]', function() {
				if ( this.id == 'other' ) {
					$( 'input[type="text"][id="other-text"]' ).prop('disabled', false);
				} else {
					$( 'input[type="text"][id="other-text"]' ).prop('disabled', true);
				}
			});
		}
	};

	$.fn.misscelanious = function() {
		var msc = new Misc( this );
		return msc;
	}
})(window.jQuery);
!function($) {
	function NextQuestion( $elt ) {
		// jquery selectors
		this.$main = $elt;
		this.$nextButton = this.$main.find('.button[data-next="question"]');
		this.$mturkForm = $( '#mturk_form' );
		// strings for selectors
		this.header = 'header';
		this.inp = 'input';
		// css class selectors
		this.introTemp = '.intro';
		this.question = '.question';
		this.questionContent = '.question-content';
		this.introDesc = '.intro-desc';
		this.tokens = '.tokens';
		this.err = '.error';

		// dictionary for handlebar templates
		this.templates = {};
		// templates urls for requesting template files and names to store templates
		this.templateNames = [
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/templates/intro.html',
				dataName: 'intro'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/templates/question-header.html',
				dataName: 'question'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/templates/two-question.html',
				dataName: 'twoPic'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/templates/one-pic.html',
				dataName: 'onePic'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/templates/one-pic-radio-opts.html',
				dataName: 'onePicInput'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/templates/tokens.html',
				dataName: 'tokenBase'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior_no-frame/templates/survey.html',
				dataName: 'survey'
			}
		];

		// other classes 
		this.misc = $( 'main' ).misscelanious();
		this.addInpts = $( 'main' ).addInputs( this.$mturkForm );
	}

	NextQuestion.prototype = {
		init: function() {
			this.getTemplates();
			this.nextQuestion();
			this.bind();
		},

		// get handlebar templates 
		getTemplates: function() {
			var that = this;

			// loop over all the handlebar files and get them
			for ( var i = 0; i < this.templateNames.length; i++ ) {
				$.ajax({
					url: that.templateNames[i].url,
					method: 'GET',
					async: false,
					success: function( template ) {
						that.compileTemplate( template, that.templateNames[i].dataName );
					},
					error: function( e ) {
						console.error( 'error ' + e);
					}
				});
			}
		},

		// compile Handlebar templates
		compileTemplate: function( template, name ) {
			this.templates[name] = Handlebars.compile( template );
		},

		// bind for next button click driver
		bind: function() {
			var that = this;
			// call randomSlider
			// consider moving to init Function
			new RandomSlider();

			this.$nextButton.on('click', function(){
				that.nextButtonClicked();
			});
		},

		// driver for whether to continue to next question or not
		nextButtonClicked: function() {
			if ( $( this.introTemp ).length !== 0 ) {
				this.nextQuestion();
			} else if ( $( this.question ).validateForm() ) {
				// validate radio options
				this.nextQuestion();
			}
		},

		// calls functions that must be called before driver
		nextQuestion: function() {
			var pageNum = this.misc.updatePageNumber();
			this.addInpts.updateInputs( pageNum );
			this.removeQuestion();
			this.nextQuestionDriver( pageNum );
		},

		// driver for the order of questions displayed
		// pageNum determines which template/data to use
		nextQuestionDriver: function( pageNum ) {
			if ( pageNum === 1 ) {
				this.addHeader( contextIntro );
			} else if ( pageNum === 2 ) {
				this.addHeader( contextPolIntro );
			} else if ( pageNum >= 3 && pageNum <= 7 ) {
				// there are still politician photos to add
				if ( pageNum === 3 ) {
					this.addQuestionDesc( contextPol );
				}
				this.addQuestion( this.templates.twoPic, contextPol );
			} else if ( pageNum === 8 ) {
				this.addHeader( contextVotingLineIntro );
			} else if ( pageNum === 9 ) {
				// add question
				this.addQuestionDesc( contextVotingLine );
				this.addQuestion( this.templates.twoPic, contextVotingLine );
			} else if ( pageNum === 10 ) {
				this.addHeader( contextStatesIntro );
			} else if ( pageNum >= 11 && pageNum <= 14 ) {	
				if ( pageNum === 11 ) {
					this.addQuestionDesc( contextStates );
				}

				// clear checked values from previous input state 
				// this done because the input fields are not removed from the page
				// but just copied to mturk form
				// input labels shouldn't change sides so instead of removing input from page to page it is just renamed
				// input names are changed for each state
				this.misc.clearCheckedValues();
				this.addQuestion( this.templates.onePic, contextStates );

				// add radio buttons - only done once
				if ( pageNum === 11 ) {
					this.appendAfter( this.questionContent, this.templates.onePicInput, contextStates );
				}
				
				// fix radio names of inputs
				this.misc.fixInputName();
			} else if ( pageNum >= 15 && pageNum <= 17 ) {
				// this is done to show the desc on three seperate pages
				var desc = contextTokenIntro.descAll[0];
				contextTokenIntro.desc = []
				// contextTokenIntro.desc.desc;
				for (var i = 0; i < desc.length; i++) {
					contextTokenIntro.desc[i] = desc[i];
				}
				contextTokenIntro.descAll.splice(0, 1);
				this.addHeader( contextTokenIntro );
			} else if ( pageNum >= 18 && pageNum <= 28 ) {
				// add the token base 
				this.$main.find( this.header ).after( this.templates.tokenBase(contextTokens) );
				// token class to deal with everything for the tokens
				$( this.tokens ).tokens();
			} else if ( pageNum === 29 ) {
				this.addHeader( contextSurveyIntro );
			} else if ( pageNum === 30 ) {
				this.$main.find( this.header ).after( this.templates.survey(contextSurvey) );
				this.$nextButton.text( 'Submit Answers' );
				this.misc.radioOther();
			} else {
				// thank the user and remove paegnumber counter
				this.misc.removePageNumber();
				this.addHeader ( contextThankYou );
				this.$nextButton.remove();
				// once all the questions have been used submit to mturk
				// this.$mturkForm.submit();
			}

			// scroll to top of page after everything is added
			this.misc.scrollUp();
		},

		// adds header to page and removes old header
		addHeader: function( context ) {
			this.removeHeader();
			this.$main.prepend( this.templates.intro( context ) );
		},

		// add question description
		addQuestionDesc: function( context ) {
			this.appendAfter( this.header, this.templates.question, context );
		},	

		// adds 
		addQuestion: function( template, context ) {
			this.$main.find( this.introDesc ).after( template(context) );
		},

		// function to append after
		appendAfter: function( appendAfter, template, context ) {
			this.$main.find( appendAfter ).after( template( context ));
		},

		// remove all html elts that are associated with a question
		removeQuestion: function() {		
			// tokens, intro template, errors, and actual question content
			$( this.tokens ).remove();
			$( this.introTemp ).remove();
			$( this.err ).remove();
			$( '.question-content' ).remove();
		},

		// remove header
		removeHeader: function() {
			$( this.header ).remove();
			$( this.question ).remove();
		}
	}

	$.fn.nextQuestion = function() {
		var nextQ = new NextQuestion( this );
		nextQ.init();
		return nextQ;
	}
}(window.jQuery);
!(function($) {
	function Tokens( elt ) {
		// data attr selectors
		this.dataDynamic = '[data-dynamic]';
		this.dataOtherTokens = '[data-tokens="other"]';
		this.dataYourTokens = '[data-tokens="you"]';
		this.dataDefaultSliderMoved = 'defaultSliderMoved';

		// strings for selectors
		this.noUiOrigin = '.noUi-origin';
		this.noUiHandle = '.noUi-handle';
		this.err = '.error';
		this.tokenStringSlider = '.token-string-slider';

		// elements used in Tokens class
		this.$tokens = $( elt ); //
		this.$tokenSliderWrapper = $( '.token-slider-wrapper' );	
		this.$tokenSlider = $( '.token-slider' ); // slider for tokens
		this.$defaultSlider = $( '.token-default-slider' ); // default slider
		this.$sliderText = $( '.token-slider-text' ); // text moves with sliders
		this.$otherTokens = $( '.other-own-tokens' + this.dataDynamic ); 
		this.$yourTokens = $( '.you-own-tokens' + this.dataDynamic );
		this.$otherTokensStr = this.$tokens.find( this.dataOtherTokens );// 'token' str for confirming other tokens
		this.$yourTokensStr = this.$tokens.find( this.dataYourTokens );// 'token' str for confirming your tokens

		// handlebars template
		this.$tokenTemplate = $('#token-template').html();
		this.$tokenTemplateTen = $('#token-template-ten').html();
		this.$tokenTemplateZero= $('#token-template-zero').html();

		// / 0 = left, 1 = right
		this.defaultSliderSide = parseInt( this.$tokenSliderWrapper.data('side') );
		
		// number of token use intially owns
		this.numTokensYouOwn = parseInt( this.$tokens.attr('data-you-own-tokens') );

		// html strings used for moving slider text
		this.tokenSpanTaking = '<span class="you-own-tokens" data-dynamic>';
		this.tokenSpanGiving = '<span class="other-own-tokens" data-dynamic>';
		this.tokenSliderText = 'Involve the government and transfer ';
		this.takingEndText = ' to myself';
		this.givingEndText = 'to my match';
		this.tokenEndText = '</span> ';
		this.nothingText = 'Do not involve the government and make no transfers';

		// used to calculate moving slider text
		this.sliderTextWidth = 452;
	};

	Tokens.prototype = {
		initTokens: function() {
			this.initSlider();
		},

		// init slider and select correct starting range
		initSlider: function() {
			// needed to determine whether the tokenslider starts at val of 10 or 0
			// this is done to randomize the side of each of the sliders 
			// and that they transition smoothly
			var tokenStart = 10 * this.defaultSliderSide
				that = this;

			if ( this.defaultSliderSide === 1 ) {
				this.$sliderText.removeClass('col-md-12').addClass( 'float-right' );
			}

			// create nuetral slider
			this.$defaultSlider.noUiSlider({
				range: [0, 1],
				start: this.defaultSliderSide,
				handles: 1,
				step: 1,
				slide: function() {
					that.defaultSliderMoved();
				}
			});

			// create token slider
			this.$tokenSlider.noUiSlider({
				range: [0, 10],
				start: tokenStart,
				handles: 1,
				step: 1,
				slide: function() {
					that.updateTokens();
				}
			});

			// elts can only be selected after sliders are created
			// elts needed to move slider text when slider is clicked
			this.$noUiTokenSlider = this.$tokenSlider.find( this.noUiOrigin );
			this.$noUiTokenHandle = this.$noUiTokenSlider.find( this.noUiHandle );

			// disable token slider and noui-handle
			// gives the user appearance of one slider then
			this.$tokenSlider.attr('disabled', 'disabled');
			this.$tokenSlider.find( '.noUi-handle' ).hide();
		},

		// update default and token slider when default moved
		defaultSliderMoved: function() {
			// token slider is disabled at first and handle is hidden to kep illusion of one handle
			this.$tokenSlider.removeAttr( 'disabled' );
			this.$tokenSlider.find( '.noUi-handle' ).show();
			// make the default slider disabled to keep illusion of one slider,
			 // and hide handle
			this.$defaultSlider.attr('disabled', 'disabled');
			this.$defaultSlider.find( '.noUi-handle' ).hide();
			// consider removing this, not sure what it helps with
			this.$defaultSlider.val(1);
			
			// figure out where this should logicaly be plased
			$( this.err ).hide();

			// so that the next question driver can tell if the default slider moved
			this.$tokens.data( this.dataDefaultSliderMoved, 'true' );

			this.updateTokens();
		},

		updateTokens: function() {
			var yourTokenVal = parseInt(  this.$tokenSlider.val() ),
				otherTokenVal = Math.abs( yourTokenVal - 10 );

			// update numbers to reflect slider values
			this.$yourTokens.text( yourTokenVal );
			this.$otherTokens.text( otherTokenVal );

			this.updateTokensText( yourTokenVal, this.$yourTokensStr );
			this.updateTokensText( otherTokenVal, this.$otherTokensStr );
			
			this.updateSliderText( yourTokenVal, otherTokenVal );
			this.moveSliderText();
		},

		// update token text for one token or multiple tokens
		updateTokensText: function( tokenVal, $elt ) {
			if ( tokenVal === 1 ) {
				$elt.text( 'token' );
			} else {
				$elt.text( 'tokens' );
			}
		},

		// update slider text to reflect whether a user is taking or giving tokens
		updateSliderText: function( yourTokenVal ) {
			var tokens = null,
				text = this.tokenSliderText;

			// taking more tokens that started with
			if ( yourTokenVal > this.numTokensYouOwn ) {
				tokens = yourTokenVal - this.numTokensYouOwn;
				text += this.tokenSpanTaking + tokens + this.tokenEndText + this.takingEndText;
			} else if ( yourTokenVal < this.numTokensYouOwn ) {
				// giving more tokens that started with
				tokens = this.numTokensYouOwn - yourTokenVal;
				text += this.tokenSpanGiving + tokens + this.tokenEndText + this.givingEndText;
			} else {
				text = this.nothingText;
			}

			// empty the slider text and append current val text
			this.$sliderText.empty();
			this.$sliderText.append( text );
			// this.updateTokensText( tokens, $( this.tokenStringSlider ) );
		},

		// move the slider text with the slider
		moveSliderText: function( ) {
			var leftTokenSlider = parseInt( this.$noUiTokenSlider.position().left ),
				defaultWidth = parseInt( this.$defaultSlider.width() ),
				handleWidth = parseInt( this.$noUiTokenHandle.width() ),
				marginLeft = 0;  

			if ( this.defaultSliderSide === 0 ) {
				marginLeft = leftTokenSlider - defaultWidth + handleWidth/2;
				this.$sliderText.removeClass( 'float-right' );

				if ( marginLeft < 0 ) {
					this.$sliderText.css('left', 0);
				} else if ( marginLeft < 600 ) {
					this.$sliderText.css('left', marginLeft);
				} else {
					this.$sliderText.css('left', 0);
					this.$sliderText.removeClass('col-md-12').addClass( 'float-right' );
				}
			} else {
				marginLeft = leftTokenSlider - 	this.sliderTextWidth/2;
				this.$sliderText.removeClass( 'float-right' );
				if ( marginLeft < 0 ) {
					this.$sliderText.css('left', 0);
				} else if ( marginLeft < 600 ) {
					this.$sliderText.css('left', marginLeft);
				} else {
					this.$sliderText.css('left', 0);
					this.$sliderText.removeClass('col-md-12').addClass( 'float-right' );
				}
			}
		}
	};

	// doesn't need to be a jquery plugin, but since it uses jquery to manipulate the dom makes sense
	$.fn.tokens = function() {
		var token = new Tokens( this );
		token.initTokens();
		return token;
	}
})(window.jQuery);
!(function($) {
	var ValidateForm = function( $elt ) {
		this.$validate = $elt;
		this.$question = $( '.question' );
		this.$survey = $( '.survey' );
		this.radioInputs = 'input[type="radio"]';
		this.numberInputs = 'input[type="number"]';

		// data error calue corresponds to name value of input
		this.dataError = '.error[data-error="';
		this.dataErrorEnd = '"]';

		this.dataErrorName = '[data-error-name="';
		this.dataErrorNameEnd = '"]';

		this.numberErrorText = 'Please enter a valid number';

		// number regular expression
		this.reNum = /^\d+$/;

		// tokens
		this.$tokens = $( '.tokens' );
		this.$tokenSliderWrapper = $( '.token-slider-wrapper' );
		this.$err = $( '.error' );
		this.sliderMoved = null;
		// data attr
		this.dataDefaultSliderMoved = 'defaultSliderMoved';
		this.tokenErrorString = ' <h3 class="error display col-xs-12 col-sm-12 col-md-12 center">Please make a decision by moving the slider</h3>';

		this.invalid = true;

		this.errorMessageHtml = '<h3 class="error col-xs-12 col-sm-12 col-md-12 center">';
		this.errorMessageClose = '</h3>';
	}

ValidateForm.prototype = {
		validate: function() {
			this.validateRadio();
			this.validateNumber();
			this.validateTokens();
			return this.invalid;
		},

		// validates default slider was moved
		validateTokens: function() {
			if ( this.$tokens.length > 0 ) {
				// check to see if default slider was moved 
				// token plugin updates data attr when default slider is moved
				this.sliderMoved = this.$tokens.data( this.dataDefaultSliderMoved );
				if ( !this.sliderMoved ) {
					this.tokenError();
					this.invalid = false;
				}
			}
		},

		// validate number input types
		validateNumber: function() {
			var $inputs = this.$validate.find( this.numberInputs ),
				that = this;

			$inputs.each( function() {
				if ( !that.reNum.test( this.value ) ) {
					that.invalid = false;
					that.numberError( this.dataset.error );
				}
			});
		},

		numberError: function( dataError ) {
			var $err = $( this.dataError + dataError + this.dataErrorEnd );

			$err.text( this.numberErrorText );
			$err.show();
		},

		// validates that radio button was clicked
		validateRadio: function() {
			var $inputs = this.$validate.find( this.radioInputs ),
				radioNames = {},
				radioErrors = {};

			if ( $inputs.length !== 0 ) {
				$inputs.each(function() {
					var isChecked = this.checked,
						name = this.name;

					// if input is checked, value in radio names is true
					// if input isn't checked and not in radio names value in radio names is false
					// 
					if ( isChecked ) {
						radioNames[this.name] = true;
					} else if ( !isChecked && !( name in radioNames ) ) {
						radioNames[name] = false;
					}
					radioErrors[this.name] = this.dataset.error;
				});

				// if a key in radionames is false, that radio name wasn't checked
				// display radio error
				for ( var key in radioNames ) {
					// var $err = null;

					if ( !radioNames[key] ) {
						this.invalid = false;
						this.radioError( radioErrors[key] );
					}
				}	
			}
		},

		// display radio error
		radioError: function( error ) {
			// used to display errors on survey page
			// errors currently are hidden and displayed when needed
			// html for errors on other pages is created and appended
			if ( this.$err.length === 0 ) {
				var err = this.errorMessageHtml + error + this.errorMessageClose;
				this.$question.append( err );
			} else if ( this.$survey.length !== 0 ) {
				var $err = $( this.dataError + error + this.dataErrorEnd ),
					dataText = $err.data( 'errorText' );
					
				if ( !dataText ) {
					dataText = 'Please select one of the ' + $err.data( 'error' ) + ' above';
				}

				$err.text( dataText );
				$err.show();
			}
		},

		// adds the token error to the slider
		tokenError: function() {
			if ( this.$err.length === 0 ) {
				this.$tokenSliderWrapper.before( this.tokenErrorString );
			}
		}
	}

	$.fn.validateForm = function() {
		var isValidForm = new ValidateForm( this );
		return isValidForm.validate();
	}

})(window.jQuery);