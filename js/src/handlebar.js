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

// set random token value and function to token value and corresponding text
(function() {
	var yourTokenVal = null,
		otherTokenVal = null,
		tokenList = null,
		order = null,
		take = 'take ',
		make = 'make ',

		// text for transfer range
		beginRange = 'Worker A was able to ',
		zeroTenRange = 'a tax transfer that ranged between 0 tokens and 10 tokens',
		fiveRange = 'a tax transfer that ranged between 0 tokens and 5 tokens',
		endRangeTo = ' to worker B',
		endRangeFrom = ' from worker B',

		// transform text
		spanBold = '<span class="heavy taking-tokens">',
		govtInvolved = 'got the government involved',
		govtNotInvolved = 'did not want the government involved',
		choseText = ' and chose to ',
		taxTrans = ' a tax transfer of '
		takeTrans = choseText + spanBold + take + taxTrans,
		makeTrans = choseText + spanBold + make + taxTrans,
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
			console.log( 'count is less than 5' );
			return otherTokenVal - curToken;
		}

	});

	Handlebars.registerHelper('transferRange', function() {
		var out = beginRange;

		if ( yourTokenVal === 10 ) {
			out += make + zeroTenRange + endRangeTo;
		} else if ( yourTokenVal === 0 ) {
			out += take + zeroTenRange + endRangeFrom;
		} else {
			out += make + fiveRange + endRangeTo + ' or to ' + take + fiveRange + endRangeFrom;
		}

		out += '.'

		return out;
	});

	Handlebars.registerHelper('transferText', function() {
		var out = 'Worker A ';
		curToken = tokenList[0];

		if ( curToken === 0 ) {
			out += govtNotInvolved;
		} else {
			out += govtInvolved;
		}

		if ( yourTokenVal === 10 ) {
			out += makeTrans + spanUL + curToken + spanEnd + spanEnd + ' to ';
		} else if ( yourTokenVal === 0 ) {
			out += takeTrans + spanUL + curToken + spanEnd + spanEnd + ' from ';
		} else {
			if ( count >= 5 ) {
				out += makeTrans + spanUL + curToken + spanEnd + spanEnd + ' to ';
			} else {
				out += takeTrans + spanUL + curToken + spanEnd + spanEnd + ' from ';
			}
		}

		console.log( yourTokenVal );

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