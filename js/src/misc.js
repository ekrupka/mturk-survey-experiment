// methods that don't seem to logically fit in other classes go here
!(function($) {
	function Misc( $elt, $mturkForm ) {
		this.$main = $elt;
		this.$mturkForm = $mturkForm;
		this.$pageNumber = $( '.page-number [data-current-page]' );
		this.image = 'img';
		this.polInpSelector = 'input[name="pol-classification"]';
		this.polClassSelector = '.pol-class'
		this.inp = 'input';

		// data attr selectors
		this.dataName = 'data-name';

		this.dem = 'Democrat';
		this.rep = 'Republican';
		this.polClass = null;

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
		},

		// add the political classification text of the study participant
		fixPolClass: function() {
			var $polClass = $( this.polClassSelector );
				polClassVal = null;

			// if we don't currently have the policitical classification of
			// the individual get it
			if ( !this.polClass ) {
				polClassVal = parseInt( this.$mturkForm.find( this.polInpSelector ).val() );
				if ( polClassVal === 1 || polClassVal === 2 ) {
					this.polClass = this.dem;
				} else {
					this.polClass = this.rep;
				}
			}

			$polClass.text( this.polClass );

		}
	};

	$.fn.misscelanious = function( $mturkForm ) {
		var msc = new Misc( this, $mturkForm );
		return msc;
	}
})(window.jQuery);
