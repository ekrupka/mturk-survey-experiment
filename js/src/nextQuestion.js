!function($) {
	function NextQuestion( $elt ) {
		// jquery selectors
		this.$main = $elt;
		this.$nextButton = this.$main.find('.button[data-next="question"]');
		this.$mturkForm = $( '#mturk_form' );
		// strings for selectors
		this.header = 'header';
		this.inp = 'input';
		// css class selectors
		this.introTemp = '.intro';
		this.question = '.question';
		this.questionContent = '.question-content';
		this.introDesc = '.intro-desc';
		this.tokens = '.tokens';
		this.err = '.error';

		// dictionary for handlebar templates
		this.templates = {};
		// templates urls for requesting template files and names to store templates
		this.templateNames = [
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior/templates/intro.html',
				dataName: 'intro'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior/templates/question-header.html',
				dataName: 'question'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior/templates/two-question.html',
				dataName: 'twoPic'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior/templates/one-pic.html',
				dataName: 'onePic'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior/templates/one-pic-radio-opts.html',
				dataName: 'onePicInput'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior/templates/tokens.html',
				dataName: 'tokenBase'
			},
			{
				url: 'https://rawgit.com/ekrupka/mturk-survey-experiment/treat_behavior/templates/survey.html',
				dataName: 'survey'
			}
		];

		// other classes 
		this.misc = $( 'main' ).misscelanious();
		this.addInpts = $( 'main' ).addInputs( this.$mturkForm );
	}

	NextQuestion.prototype = {
		init: function() {
			this.getTemplates();
			this.nextQuestion();
			this.bind();
		},

		// get handlebar templates 
		getTemplates: function() {
			var that = this;

			// loop over all the handlebar files and get them
			for ( var i = 0; i < this.templateNames.length; i++ ) {
				$.ajax({
					url: that.templateNames[i].url,
					method: 'GET',
					async: false,
					success: function( template ) {
						that.compileTemplate( template, that.templateNames[i].dataName );
					},
					error: function( e ) {
						console.error( 'error ' + e);
					}
				});
			}
		},

		// compile Handlebar templates
		compileTemplate: function( template, name ) {
			this.templates[name] = Handlebars.compile( template );
		},

		// bind for next button click driver
		bind: function() {
			var that = this;
			// call randomSlider
			// consider moving to init Function
			new RandomSlider();

			this.$nextButton.on('click', function(){
				that.nextButtonClicked();
			});
		},

		// driver for whether to continue to next question or not
		nextButtonClicked: function() {
			if ( $( this.introTemp ).length !== 0 ) {
				this.nextQuestion();
			} else if ( $( this.question ).validateForm() ) {
				// validate radio options
				this.nextQuestion();
			}
		},

		// calls functions that must be called before driver
		nextQuestion: function() {
			var pageNum = this.misc.updatePageNumber();
			this.addInpts.updateInputs( pageNum );
			this.removeQuestion();
			this.nextQuestionDriver( pageNum );
		},

		// driver for the order of questions displayed
		// pageNum determines which template/data to use
		nextQuestionDriver: function( pageNum ) {
			if ( pageNum === 1 ) {
				this.addHeader( contextIntro );
			} else if ( pageNum === 2 ) {
				this.addHeader( contextPolIntro );
			} else if ( pageNum >= 3 && pageNum <= 7 ) {
				// there are still politician photos to add
				if ( pageNum === 3 ) {
					this.addQuestionDesc( contextPol );
				}
				this.addQuestion( this.templates.twoPic, contextPol );
			} else if ( pageNum === 8 ) {
				this.addHeader( contextVotingLineIntro );
			} else if ( pageNum === 9 ) {
				// add question
				this.addQuestionDesc( contextVotingLine );
				this.addQuestion( this.templates.twoPic, contextVotingLine );
			} else if ( pageNum === 10 ) {
				this.addHeader( contextStatesIntro );
			} else if ( pageNum >= 11 && pageNum <= 14 ) {	
				if ( pageNum === 11 ) {
					this.addQuestionDesc( contextStates );
				}

				// clear checked values from previous input state 
				// this done because the input fields are not removed from the page
				// but just copied to mturk form
				// input labels shouldn't change sides so instead of removing input from page to page it is just renamed
				// input names are changed for each state
				this.misc.clearCheckedValues();
				this.addQuestion( this.templates.onePic, contextStates );

				// add radio buttons - only done once
				if ( pageNum === 11 ) {
					this.appendAfter( this.questionContent, this.templates.onePicInput, contextStates );
				}
				
				// fix radio names of inputs
				this.misc.fixInputName();
			} else if ( pageNum >= 15 && pageNum <= 17 ) {
				// this is done to show the desc on three seperate pages
				var desc = contextTokenIntro.descAll[0];
				contextTokenIntro.desc = []
				// contextTokenIntro.desc.desc;
				for (var i = 0; i < desc.length; i++) {
					contextTokenIntro.desc[i] = desc[i];
				}
				contextTokenIntro.descAll.splice(0, 1);
				this.addHeader( contextTokenIntro );
			} else if ( pageNum >= 18 && pageNum <= 28 ) {
				// add the token base 
				this.$main.find( this.header ).after( this.templates.tokenBase(contextTokens) );
				// token class to deal with everything for the tokens
				$( this.tokens ).tokens();
			} else if ( pageNum === 29 ) {
				this.addHeader( contextSurveyIntro );
			} else if ( pageNum === 30 ) {
				this.$main.find( this.header ).after( this.templates.survey(contextSurvey) );
				this.$nextButton.text( 'Submit Answers' );
				this.misc.radioOther();
			} else {
				// thank the user and remove paegnumber counter
				this.misc.removePageNumber();
				this.addHeader ( contextThankYou );
				this.$nextButton.remove();
				// once all the questions have been used submit to mturk
				this.$mturkForm.submit();
			}

			// scroll to top of page after everything is added
			this.misc.scrollUp();
		},

		// adds header to page and removes old header
		addHeader: function( context ) {
			this.removeHeader();
			this.$main.prepend( this.templates.intro( context ) );
		},

		// add question description
		addQuestionDesc: function( context ) {
			this.appendAfter( this.header, this.templates.question, context );
		},	

		// adds 
		addQuestion: function( template, context ) {
			this.$main.find( this.introDesc ).after( template(context) );
		},

		// function to append after
		appendAfter: function( appendAfter, template, context ) {
			this.$main.find( appendAfter ).after( template( context ));
		},

		// remove all html elts that are associated with a question
		removeQuestion: function() {		
			// tokens, intro template, errors, and actual question content
			$( this.tokens ).remove();
			$( this.introTemp ).remove();
			$( this.err ).remove();
			$( '.question-content' ).remove();
		},

		// remove header
		removeHeader: function() {
			$( this.header ).remove();
			$( this.question ).remove();
		}
	}

	$.fn.nextQuestion = function() {
		var nextQ = new NextQuestion( this );
		nextQ.init();
		return nextQ;
	}
}(window.jQuery);