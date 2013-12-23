!(function($) {
	var ValidateForm = function( $elt ) {
		this.$validate = $elt;
		this.radioInputs = 'input[type="radio"]';
		this.numberInputs = 'input[type="number"]';

		// data error calue corresponds to name value of input
		this.dataError = '.error[data-error="';
		this.dataErrorEnd = '"]';

		this.numberErrorText = 'Please enter a valid number';

		// number regular expression
		this.reNum = /^\d+$/;

		this.invalid = true;
	}

	ValidateForm.prototype = {
		validate: function() {
			this.validateRadio();
			this.validateNumber();
			return this.invalid;
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

		validateRadio: function() {
			var $inputs = this.$validate.find( this.radioInputs ),
				radioNames = new Array(),
				radioErrors = new Array();;

			if ( $inputs.length !== 0 ) {
				$inputs.each(function() {
					var isChecked = this.checked,
						name = this.name;

					if ( isChecked ) {
						radioNames[this.name] = true;
					} else if ( !isChecked && !(name in radioNames ) ) {
						radioNames[name] = false;
					}
					radioErrors[this.name] = this.dataset.error;
				});

				for ( var key in radioNames ) {
					var $err = null;

					if ( !radioNames[key] ) {
						this.invalid = false;
						this.radioError( radioErrors[key] );
					}
				}	
			}
		},

		radioError: function( name ) {
			var $err = $( this.dataError + name + this.dataErrorEnd ),
				dataText = $err.data( 'errorText' );
			if ( !dataText ) {
				dataText = 'Please select one of the ' + $err.data( 'error' ) + ' above';
			}
			$err.text( dataText );
			$err.show();
		}
	}

	$.fn.validateForm = function() {
		var isValidForm = new ValidateForm( this );
		return isValidForm.validate();
	}

})(window.jQuery);