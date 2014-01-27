!function($) {
	function NextQuestion( $elt ) {
		// jquery selectors
		this.$main = $elt;
		this.$nextButton = this.$main.find('.button[data-next="question"]');
		this.$mturkForm = $( '#mturk_form' );

		// get handlebar templates
		this.$introTemplate = $('#intro-template').html();
		this.$qTemplate = $('#question-template').html();
		this.$twoPicTemplate = $('#two-pic-template').html();
		this.$onePicTemplate = $('#one-pic-template').html();
		this.$onePicInputTemplate = $('#one-pic-input-template').html();
		this.$tokenBase = $('#token-base').html();
		this.$surveyTemplate = $('#survey-template').html();

		// compile handlebar templates
		this.introTemplate = Handlebars.compile( this.$introTemplate );
		this.qTemplate = Handlebars.compile( this.$qTemplate );
		this.twoPicTemplate = Handlebars.compile( this.$twoPicTemplate );
		this.onePicTemplate = Handlebars.compile( this.$onePicTemplate );
		this.onePicInputTemplate = Handlebars.compile( this.$onePicInputTemplate );
		this.tokenBase = Handlebars.compile( this.$tokenBase );
		this.surveyTemplate = Handlebars.compile( this.$surveyTemplate );

		// strings for selectors
		this.header = 'header';
		this.inp = 'input';
		// css class selectors
		this.introTemp = '.intro';
		this.question = '.question';
		this.questionContent = '.question-content';
		this.introDesc = '.intro-desc';
		this.tokens = '.tokens';
		this.tokenSliderWrapper = '.token-slider-wrapper';
		this.err = '.error';

		// data attr
		this.dataDefaultSliderMoved = 'defaultSliderMoved';

		// Template Intro indicators
		this.intro = false;
		this.polIntro = false;
		this.statesIntro = false;
		this.votingLineIntro = false;
		this.tokenIntro = false;
		this.surveyIntro = false;

		// Templates that have been used once
		this.polUsed = false;
		this.votingLineUsed = false;
		this.statesUsed = false;
		this.surveyUsed = false;

		// templates finished used by update input logic
		this.polFinished = false;
		this.votingLineFinsihed = false;
		this.stateFinished = false;

		// validate types
		this.validateRadio = 'radio';

		this.tokenErrorString = ' <h3 class="error display col-xs-12 col-sm-12 col-md-12 center">Please make a decision by moving the slider</h3>';

		// intial state context length
		this.numTokensUsed = 0;
		this.MAXNUMTOKENS = 11;

		// other classes 
		this.misc = $( 'main' ).misscelanious();
		this.addInpts = $( 'main' ).addInputs( this.$mturkForm );
	}

	NextQuestion.prototype = {
		init: function() {
			this.nextQuestion();
			this.bind();
		},

		bind: function() {
			var that = this;
			// call randomSlider
			new RandomSlider();

			this.$nextButton.on('click', function(){
				that.nextButtonClicked();
			});
		},

		nextButtonClicked: function() {
			var $tokens = $( this.tokens ),
				sliderMoved = null;

			if ( $( this.introTemp ).length !== 0 ) {
				this.nextQuestion();
			} else if ( $tokens.length > 0 ) {
				// check to see if default slider was moved 
				// token plugin updates data attr when default slider is moved
				// if it's moved go to next question, if not display error message
				sliderMoved = $tokens.data( this.dataDefaultSliderMoved );
				if ( sliderMoved ) {
					this.nextQuestion();
				} else {
					this.tokenError();
				}
			} else if ( $( this.question ).validateForm() ) {
				// validate radio options
				this.nextQuestion();
			}
		},

		nextQuestion: function() {
			this.updateInputs();
			this.misc.updatePageNumber();
			this.removeQuestion();
			this.nextQuestionDriver();
		},

		// driver for the order of questions displayed
		nextQuestionDriver: function() {
			if ( this.intro === false ) {
				this.addHeader( contextIntro );
				// to not come back to intro again
				this.intro = true;
			} else if ( this.polIntro === false ) {
				this.addHeader( contextPolIntro );
				// done with poltician intro
				this.polIntro = true;
			} else if ( contextPhotos.photos.length !== 0 ) {
				// there are still politician photos to add
				this.addQuestion( this.polUsed, contextPhotos, this.twoPicTemplate );
				this.polUsed = true;
			} else if ( this.votingLineIntro === false ) {
				// pol finished used in update input logic
				this.polFinished = true;
				this.addHeader( contextVotingLineIntro );
				this.votingLineIntro = true;
			} else if ( contextVotingLine.photos.length != 0 ) {
				// add question
				this.addQuestion( this.votingLineUsed, contextVotingLine, this.twoPicTemplate );
				this.votingLineUsed = true;
			} else if ( this.statesIntro === false ) {
				// used by update input logic
				this.votingLineFinsihed = true;
				this.addHeader( contextStatesIntro );
				// used states into intro
				this.statesIntro = true;
			} else if ( contextStates.states.length != 0 ) {	
				// clear checked values from previous input state 
				// this done because the input fields are not removed from the page
				// input names are changed for each state
				this.misc.clearCheckedValues();
				this.addQuestion( this.statesUsed, contextStates, this.onePicTemplate );

				// add radio buttons - only done once
				this.addQuestionHelper( this.statesUsed, this.questionContent, contextStates, this.onePicInputTemplate );
				this.statesUsed = true;
				
				// fix radio names of inputs
				this.misc.fixInputName();
			} else if ( contextTokenIntro.descAll.length !== 0 ) {
				// to serve each desc subsequently 
				this.statesFinished = true;
				// this is done to show the desc on three seperate pages
				// but also have them logically housed in the same data location
				contextTokenIntro.desc = [contextTokenIntro.descAll[0]];
				contextTokenIntro.descAll.splice(0, 1);
				this.addHeader( contextTokenIntro );
				this.tokenIntro = true;
			} else if ( this.numTokensUsed < this.MAXNUMTOKENS ) {
				// another token is used
				this.numTokensUsed++;
				// add the token base 
				this.$main.find( this.header ).after( this.tokenBase(contextTokens) );
				// token class to deal with everything for the tokens
				$( this.tokens ).tokens();
			} else if ( this.surveyIntro === false ) {
				this.addHeader( contextSurveyIntro );
				this.surveyIntro = true;
			} else if ( this.surveyUsed === false ) {
				this.$main.find( this.header ).after( this.surveyTemplate(contextSurvey) );
				this.$nextButton.text( 'Submit Answers' );
				this.misc.radioOther();
				this.surveyUsed = true;
			} else {
				// once all the questions have been used submit to mturk
				this.$mturkForm.submit();
			}

			// scroll to top of page after everything is added
			this.misc.scrollUp();
		},

		// adds header to page and removes old header
		addHeader: function( context ) {
			this.removeHeader();
			this.$main.prepend( this.introTemplate( context ) );
		},

		// adds 
		addQuestion: function( contextUsed, context, template ) {
			// add question desc 
			if ( !contextUsed ) {
				// generate the associated tempalte and append it after appendAfter
				this.addQuestionHelper( contextUsed, this.header, context, this.qTemplate )
				// this.$main.find( this.header ).after( this.qTemplate( context ));
			}
			
			// generate question and append it
			this.$main.find( this.introDesc ).after( template(context) );
		},

		addQuestionHelper: function( contextUsed, appendAfter, context, template ) {
			// only add if this context hasn't been 'used'
			if ( !contextUsed ) {
				// generate the associated tempalte and append it after appendAfter
				this.$main.find( appendAfter ).after( template( context ));
			}
		},

		removeQuestion: function() {		
			// remove all possible classes that could be there
			$( this.tokens ).remove();
			$( this.introTemp ).remove();
			$( this.err ).remove();
			$( '.question-content' ).remove();
		},

		// remove header
		removeHeader: function() {
			$( this.header ).remove();
			$( this.question ).remove();
		},

		// adds the token arror to the slider
		tokenError: function() {
			if ( $( this.err ).length === 0 ) {
				$( this.tokenSliderWrapper ).before( this.tokenErrorString );
			}
		},

		// driver to decide which method in addInpts to call
		updateInputs: function() {
			var $inpts = this.$main.find( this.inp ),
				$tokens = $( this.tokenSliderWrapper );

			// this logic works bec poltician is displayed followed by votingline
			// followed by states (the variables below are updated once that group 
			// has all been displayed)
			if ( $inpts.length !== 0 || $tokens.length !== 0 ) {	
				// if the politician and voting line aren't finished displaying 
				// add the input for two pics
				if ( !this.polFinished || !this.votingLineFinsihed ) {
					this.addInpts.twoPics();
				} else if ( !this.statesFinished ) {
					this.addInpts.onePic();
				} else if ( $tokens.length !== 0 ) {
					this.addInpts.token( $tokens );
				} else {
					this.addInpts.appendAll();
				}
			}
		}
	}

	$.fn.nextQuestion = function() {
		var nextQ = new NextQuestion( this );
		nextQ.init();
		return nextQ;
	}
}(window.jQuery);