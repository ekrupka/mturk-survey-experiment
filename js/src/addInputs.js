!(function($) {
	function AddInputs( $elt, $mturkForm ) {
		this.$main = $elt;
		this.$mturkForm = $mturkForm;
		this.$pageNumber = $( '.page-number [data-current-page]' );
		this.inp = 'input';
		this.inpNum = 'input[type="number"]';
		this.inpText = 'input[type="text"]';
		this.check = ':checked';
		this.select = 'select';
		this.questionContent = '.question-content';

		// onePic has not been called before
		this.onePicCalled = false;
	}

	AddInputs.prototype = {
		// driver to decide which method of addInpts to call
		updateInputs: function( pageNum ) {
			var $inpts = this.$main.find( this.inp ),
				$select = this.$main.find( this.select );

			// only calls add inputs if there are inputs or tokens on the page
			// other wise the page is a intro title page and should not have inputs added
			if ( $inpts.length !== 0 || $select.length !== 0 ) {
				// if the politician and voting line aren't finished displaying
				// add the input for two pics
				if ( ( pageNum >= 12 && pageNum <= 16 ) || pageNum === 18 ) {
					this.twoPics();
				} else if ( pageNum >= 20 && pageNum <= 23 ) {
					this.onePic();
				} else if ( pageNum >= 26 && pageNum <= 58 ) {
					this.token( $select, pageNum );
				} else if ( pageNum === 5 ) {
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
		token: function( $select, pageNum ) {
			var val = $select.val(),
				name = $select.attr('name'),
				inpt = this.generateHiddenInput( name, val ),
				orderName = '',
				orderInp = null;

			if ( pageNum === 26 ) {
				orderName = 'en_order' + $( this.questionContent ).attr( 'data-you-own-tokens' );
				orderInp = this.generateHiddenInput( orderName, 1 );
			} else if ( pageNum === 37 ) {
				orderName = 'en_order' + $( this.questionContent ).attr( 'data-you-own-tokens' );
				orderInp = this.generateHiddenInput( orderName, 2 );
			} else if ( pageNum === 48 ) {
				orderName = 'en_order' + $( this.questionContent ).attr( 'data-you-own-tokens' );
				orderInp = this.generateHiddenInput( orderName, 3 );
			}

			// append to mturk
			this.$mturkForm.append( inpt, orderInp );
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