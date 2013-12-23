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