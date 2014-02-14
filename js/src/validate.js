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

			console.log( 'in radio errors' )

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
				console.log(dataText);
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