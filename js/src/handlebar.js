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
		tokenList = null,
		order = null,
		choseText = 'choose to '
		taxTrans = ' a tax transfer of '
		makeTrans = choseText + 'make' + taxTrans,
		takeTrans = choseText + 'take' + taxTrans,
		makeTransEnd = ' to his match',
		takeTransEnd = ' for himself',
		nothing = 'chose NOT to take or make a tax transfer.',
		spanBold = '<span class="heavy border-bottom">',
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

	Handlebars.registerHelper('transferText', function() {
		var out = '';
		curToken = tokenList[0];
		if ( yourTokenVal === 10 ) {
			out += makeTrans + spanBold + curToken + spanEnd + makeTransEnd;
		} else if ( yourTokenVal === 5 ) {
			if ( count < 5 ) {
				out += takeTrans + spanBold + curToken + spanEnd + takeTransEnd;
			} else if ( count === 5 ) {
				out += nothing;
			} else {
				out += makeTrans + spanBold + curToken + spanEnd + makeTransEnd;
			}
			count++;
		} else {
			if ( yourTokenVal === 0 && curToken === 0 ) {
				out += nothing;
			} else {
				out += takeTrans + spanBold + curToken + spanEnd + takeTransEnd;
			}
		}
		tokenList.splice(0, 1);
		return out;
	});

	Handlebars.registerHelper('selectName', function() {
		var name = '';
		if ( yourTokenVal === 5 ) {
			name = yourTokenVal + '_norm_' + (10 - count + 1);
		} else {
			name = yourTokenVal + '_norm_' + curToken;
		}
		return name;
	});
})();
