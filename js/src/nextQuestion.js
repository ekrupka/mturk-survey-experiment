!function($) {
	function NextQuestion( $elt ) {
		// jquery selectors
		this.$main = $elt;
		this.$nextButton = this.$main.find('.button[data-next="question"]');
		this.$mturkForm = $( '#mturk_form' );
		this.$select = $( 'select' );
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
				url: 'https://3ade34c61fbc14a334e363f5f6e07080f79b49cd.googledrive.com/host/0B3xp5m4ZxljjT2p0VzFxTjFlMm8/intro.html',
				dataName: 'intro'
			},
			{
				url: 'https://3ade34c61fbc14a334e363f5f6e07080f79b49cd.googledrive.com/host/0B3xp5m4ZxljjT2p0VzFxTjFlMm8/question-header.html',
				dataName: 'question'
			},
			{
				url: 'https://3ade34c61fbc14a334e363f5f6e07080f79b49cd.googledrive.com/host/0B3xp5m4ZxljjT2p0VzFxTjFlMm8/two-question.html',
				dataName: 'twoPic'
			},
			{
				url: 'https://cbb811bf83fd6a515d41c97795d4e5f50cc9d8f4.googledrive.com/host/0B3xp5m4ZxljjWE94aHpkZ2E0MUE/one-pic.html',
				dataName: 'onePic'
			},
			{
				url: 'https://505f79690e2369655a689165e2cae73b0cce0287.googledrive.com/host/0B3xp5m4ZxljjRjQ1aXAyOFBWMnM/tokens.html',
				dataName: 'tokenBase'
			},
			{
				url: 'https://3ade34c61fbc14a334e363f5f6e07080f79b49cd.googledrive.com/host/0B3xp5m4ZxljjT2p0VzFxTjFlMm8/survey.html',
				dataName: 'survey'
			}
		];

		// other classes
		this.misc = $( 'main' ).misscelanious( this.$mturkForm );
		this.addInpts = $( 'main' ).addInputs( this.$mturkForm );
	}

	NextQuestion.prototype = {
		init: function() {
			this.getTemplates();
			this.nextQuestion();
			this.bind();
		},

		// get handlebar templates from Google Drive
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
						console.log( 'error ' + e);
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

			this.$nextButton.on('click', function(){
				that.nextButtonClicked();
			});

			$(document).on('change', '.select-appropriate', function() {
				if ( this.value !== 0 ) {
					that.enableNextButton();
				} else {
					that.disableNextButton();
				}
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
				this.addHeader( contextPartOne )
			} else if ( pageNum === 3 ) {
// 				survey intro
				this.addHeader( contextSurveyIntro );
			} else if ( pageNum === 4 ) {
// 				survey
				this.$main.find( this.header ).after( this.templates.survey(contextSurvey) );
				this.misc.radioOther();
			} else if ( pageNum === 5 ) {
				this.addHeader( contextNextSteps );
			} else if ( pageNum >= 6  && pageNum <= 8 ) {
// 				intro and pol intro
				// this is done to show the desc on seperate pages

				var desc = contextExplain.descAll[0];
				contextExplain.desc = []
				// contextIntro.desc.desc;
				for (var i = 0; i < desc.length; i++) {
					contextExplain.desc[i] = desc[i];
				}
				contextExplain.descAll.splice(0, 1);

				this.addHeader( contextExplain );
				// some of the intro's require knowing whether a person is a dem or rep
				// since strings from the data file is used, can't call a handlebar function and must alter via jQuery
				this.findPolClass();
			} else if ( pageNum === 9 ) {
				this.addHeader( contextPartTwo );
			} else if ( pageNum === 10 ) {
				this.addHeader( contextPolIntro );
			} else if ( pageNum >= 11 && pageNum <= 15 ) {
				// poltician photos
				if ( pageNum === 11 ) {
					this.addQuestionDesc( contextPol );
				}
				this.addQuestion( this.templates.twoPic, contextPol );
			} else if ( pageNum === 16 ) {
				// voting line intro
				this.addHeader( contextVotingLineIntro );
			} else if ( pageNum === 17 ) {
				// voting line question
				this.addQuestionDesc( contextVotingLine );
				this.addQuestion( this.templates.twoPic, contextVotingLine );
			} else if ( pageNum === 18 ) {
				// obama, romney, state intro
				this.addHeader( contextStatesIntro );
			} else if ( pageNum >= 19 && pageNum <= 22 ) {
				// obama, romney, state dedc
				if ( pageNum === 19 ) {
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
				/*if ( pageNum === 19 ) {
					this.appendAfter( this.questionContent, this.templates.onePicInput, contextStates );
				}*/

				// fix radio names of inputs
				this.misc.fixInputName();
			} else if ( pageNum === 23 ) {
				this.addHeader( contextPartThree );
 		} else if ( pageNum === 24 ) {
				// token intro
				this.addHeader( contextTokenIntro );
				this.findPolClass();
			} else if ( pageNum >= 25 && pageNum <= 57 ) {
				// token questions
				// add the token base
				this.disableNextButton();
				this.$main.find( this.header ).after( this.templates.tokenBase(contextTokens) );
				this.findPolClass();
				// last question add submit button
				if ( pageNum === 57 ) {
					this.$nextButton.text( 'Submit Answers' );
				}
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
		},

		changeHeader: function( text ) {
			$( this.header ).text( text );
		},

		findPolClass: function() {
			this.misc.fixPolClass();
		},

		disableNextButton: function() {
			this.$nextButton.addClass( 'disable' );
		},

		enableNextButton: function() {
			$( this.err ).remove();
			this.$nextButton.removeClass( 'disable' );
		}
	}

	$.fn.nextQuestion = function() {
		var nextQ = new NextQuestion( this );
		nextQ.init();
		return nextQ;
	}
}(window.jQuery);
