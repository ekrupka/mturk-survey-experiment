function randomInt( min, max ) {
	return Math.floor( Math.random() * ( max - min ) + min );
}

// get a random item from the context list and delete it from the list
function randomItem( context ) {
	var contextRan = randomInt( 0, context.length ), // get random item
		contextItem = context[contextRan];

	context.splice( contextRan, 1);
	return contextItem;
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

(function stateTemp() {
	var avgSide = randomInt( 0, 2 ),
	stateName = null;

	Handlebars.registerHelper('randomState', function( context, options ) {
		var state = randomItem( context );

		stateName = state.name;
		return options.fn( state );
	});

	Handlebars.registerHelper('getStateTemp', function( context, options ) {
		var out = '',
			randAdd = randomInt( 0, 2 ), // randomly get 0 or 1 to determine whether to add or subtract std devitation from avg for alt choice
			add = randAdd > 0 ? 1 : -1, //
			state = context[stateName],
			item = null;

		for ( var i = 0; i < 2; i++ ) {
			// in order to set which side the avg is on
			if ( i === avgSide ) {
				item = state[0];
				item.indx = i;
				// out += options.fn( state[0] );
			} else {
				item = state[1];
				item.indx = i;
				// set temp opt for std dev
				item.text = (item.avg + item.std * add).toFixed(2);
			}
			out += options.fn( item );
		}

		return out;
	});
})();

// set random token value and function to token value and corresponding text
(function() {
	var yourTokenVal = null,
		otherTokenVal = null,
		tokenList = null,
		order = null,
		take = 'make a tax transfer of',//'take ',
		give = 'make a tax transfer of'//'give ',

		// text for transfer range
		beginRange = 'Worker A had the opportunity to ',
		zeroTenRangeGive = 'any amount of his or her <span class="border-bottom">10</span> tokens',
		zeroTenRangeTake = 'any amount of worker B\'s <span class="border-bottom">10</span> tokens',
		fiveRangeGive = 'any amount of his or her <span class="border-bottom">5</span> tokens',
		fiveRangeTake = 'any amount of worker B\'s <span class="border-bottom">5</span> tokens',
		endRangeTo = ' to worker B',
		endRangeFrom = ' from worker B',

		// transform text
		spanBold = '<span class="heavy taking-tokens">',
		takeTrans = spanBold + take,
		giveTrans = spanBold + give,
		transEnd = ' worker B.',
		spanUL = '<span class="border-bottom">',
		spanEnd = '</span>',

		count = 0,
		curToken = null;// keep track of where we are in 5 list

	Handlebars.registerHelper('setRandomToken', function( context ) {
		if ( !tokenList || tokenList.length === 0 ) {
			yourTokenVal = randomItem( context.tokensEarned );
			otherTokenVal = Math.abs( yourTokenVal - 10 ); // assign other token
			tokenList = context.tokens[yourTokenVal];
		}

		return yourTokenVal;
	});

	Handlebars.registerHelper('getYourToken', function() {
		return yourTokenVal;
	});

	Handlebars.registerHelper('getOtherToken', function() {
		return otherTokenVal;
	});

	Handlebars.registerHelper('getYourPostTax', function() {
		if ( yourTokenVal === 5 && count < 5 ) {
			return yourTokenVal + curToken;
		}
		return Math.abs( yourTokenVal - curToken );
	});

	Handlebars.registerHelper('getOtherPostTax', function() {
		if ( yourTokenVal === 10 || (yourTokenVal === 5 && count > 5 ) ) {
			return otherTokenVal + curToken;
		} else if ( yourTokenVal === 0 || ( yourTokenVal === 5 && count <= 5 ) ) {
			return otherTokenVal - curToken;
		}

	});

	Handlebars.registerHelper('transferRange', function() {
		var out = beginRange;

		if ( yourTokenVal === 10 ) {
			out += give + zeroTenRangeGive + endRangeTo;
		} else if ( yourTokenVal === 0 ) {
			out += take + zeroTenRangeTake + endRangeFrom;
		} else {
			out += give + fiveRangeGive + endRangeTo + ' or to ' + take + fiveRangeTake + endRangeFrom;
		}

		out += '.'

		return out;
	});

	Handlebars.registerHelper('transferText', function() {
		var out = 'Worker A chose to ';
		curToken = tokenList[0];

		if ( yourTokenVal === 10 ) {
			out += giveTrans + spanUL + curToken + spanEnd + ' tokens ' + spanEnd + ' to ';
		} else if ( yourTokenVal === 0 ) {
			out += takeTrans + spanUL + curToken + spanEnd + ' tokens ' +spanEnd + ' from ';
		} else {
			if ( count >= 5 ) {
				out += giveTrans + spanUL + curToken + spanEnd + ' tokens ' + spanEnd + ' to ';
			} else {
				out += takeTrans + spanUL + curToken + spanEnd + ' tokens ' + spanEnd + ' from ';
			}
		}


		out += transEnd;
		tokenList.splice(0, 1);
		return out;
	});

	Handlebars.registerHelper('selectName', function() {
		var name = '';
		if ( yourTokenVal === 5 ) {
			name = yourTokenVal + '_norm_' + (10 - count);
			count++;
		} else {
			name = yourTokenVal + '_norm_' + curToken;
		}

		return name;
	});
})();
