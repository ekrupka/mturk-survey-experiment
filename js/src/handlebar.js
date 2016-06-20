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
			out += ' give any amount of your ' + yourTokenVal + ' tokens to the other person ' + endRange;
		}
		else if ( yourTokenVal == 0 ) {
			out += ' take any of the ' +otherTokenVal + ' tokens from the other person ' + endRange;
		}
		else {
			out += ' give any amount of your ' + yourTokenVal + ' or to take any amount of the ' + otherTokenVal + ' tokens from the other person for yourself. ' + endRange;
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

