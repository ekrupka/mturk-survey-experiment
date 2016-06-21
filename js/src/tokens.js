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
		this.tokenSliderText = 'You are currently ';
		this.takingText = ' taking';
		this.givingText = ' giving';
		this.tokenEndText = '</span> ';
		this.nothingText = 'You are not giving or taking any tokens';

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
				text += this.takingText + this.tokenSpanTaking + tokens + this.tokenEndText;
			} else if ( yourTokenVal < this.numTokensYouOwn ) {
				// giving more tokens that started with
				tokens = this.numTokensYouOwn - yourTokenVal;
				text += this.givingText + this.tokenSpanGiving + tokens + this.tokenEndText;
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