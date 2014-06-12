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
/* DATA OPTIONS FOR DIFFERENT TEMPLATES */
var contextIntro = {
	header: 'Overview of tasks',

	desc: [
			'This is a study in decision making that has three parts.  You will earn a 50 cent base pay for completing the study.',
			'In the first part, we will ask you to tell us about yourself.',
			'In the second part, we will ask you to tell us what you think about various images.',
			'In the third part, you will have a chance to earn a bonus. Your earnings for this part will depend on the decisions you make and on the decisions that the other worker you are paired with makes. You can earn up to $3.30 in bonus pay.',
			'You will be paid the base plus the bonus within 3 days after you complete this task.',
			'<h2 class="error display heavy">Note: If you are using Internet Explorer you will not be able to complete the survey. Please try using Safari, Firefox, or Chrome.</h2>'
	]
}

var contextPartOne = {
	header: 'Ready to start part one!',

	desc: [
		'We are ready to start the first part: This is where you tell us about yourself.'
	]
}

var contextSurveyIntro = {
	header: 'Tell us about yourself',

	desc: [
		'Please complete the following demographic survey.  Your responses will not be connected to your worker ID.'
	]
}

var contextSurvey = {
	politics: {
		question: 'In politics, as of today, do you consider yourself:',
		name: 'pol-classification',
		error: 'political classifications',
		inputs: [
			{
				id: 'republican',
				label: 'a Republican'
			},
			{
				id: 'democrat',
				label: 'a Democrat'
			},
			{
				id: 'democratish',
				label: 'leaning more towards the Democratic party'
			},
			{
				id: 'republicanish',
				label: 'leaning more towards the Republican party'
			}
		]
	},

	age: {
		error: 'age'
	},

	gender: {
		question: 'What is your gender?',
		name: 'gender',
		inputs: [
			{
				id: 'male',
				label: 'male'
			},
			{
				id: 'female',
				label: 'female'
			}
		],
		error: 'genders'
	},

	race: {
		question: 'Which of the following best describes your racial or ethnic background?',
		name: 'race',
		inputs: [
			{
				id: 'asian',
				label: 'Asian/Pacific Islander'
			},
			{
				id: 'black',
				label: 'Black'
			},
			{
				id: 'latino',
				label: 'Hispanic/Latino'
			},
			{
				id: 'white',
				label: 'white'
			}
		],
		other: {
			id: 'other',
			label: 'other',
			use: {},
			idText: 'other-text'
		},
		error: 'ethnicities'
	},

	voted: {
		question: 'Have you ever voted in a government election?',
		name: 'voted',
		inputs: [
			{
				id: 'yes',
				label: 'yes'
			},
			{
				id: 'no',
				label: 'no'
			}
		],
		error: 'selections'
	}
}

var contextNextSteps = {
	header: 'Next Steps',

	desc: [
		'You have completed the first part!',
		'For the second part of the study, we will ask you to tell us what you think about various images.',
		'For the third part of the study, you have a chance to earn a bonus.  We will describe the bonus task and how you get paid and then you will complete parts two and three.',
	]
}

var contextExplain = {
	header: 'Explaining how you will earn money in the bonus task',

	descAll: [
		[
			'On the next screens you will read about decisions that another Mturker made in a previous Hit.  We will call this Mturker "worker A".  Worker A is NOT participating today, but made choices in a previous Hit.  You will read about the decisions worker A faced and what actions worker A had to choose between.',
		],
		[
			'In our economy one way the government uses taxes is to generate revenue from its citizens\' earnings to redistribute wealth. The government\'s role in redistributing this wealth can be large or small. Sometimes people have a lot of wealth in our economy and sometimes people have little wealth in our economy.',
			'Worker A was randomly paired with another Mturker, called worker B. Worker A faced several different situations in which he or she had the opportunity to tell the government if it should get involved in wealth redistribution between them and worker B and, if so, how large or small the redistribution should be. Their wealth was represented by tokens, where every 10 tokens was worth $1.'
		],
		[
			'Your job is to rate worker A\'s wealth redistribution decision based on whether you think the decision was',
				'<h2 class="col-md-12 italic center"><span class="border-bottom">"socially appropriate"</span></h2>',
				'<h2 class="col-md-12 heavy center">and</h2>',
				'<h2 class="col-md-12 italic center"><span class="border-bottom">"consistent with what most people who are like you think that worker A OUGHT to do".</span></h2>',
			'That sounds simple, but it is only half the story!',
			'Specifically, you will only earn the bonus if your "social appropriateness" rating MATCHES the rating of another Mturker working on this HIT today <span class="border-bottom">who is like you</span>. We will call this Mturker “your match."',
			'To pick a match who is like you, we will match you with another Mturker who is also another <span class="pol-class"></span>. To increase the chances that you earn the bonus, you should try to imagine what <span class="border-bottom">your match</span>, who is a <span class="pol-class"></span>, would say.',
		]
	]
}

var contextPartTwo = {
	header: 'Ready to start part two!',

	desc: [
		'We are ready to start the second part of the study where we will ask you to tell us what you think about various images.'
	]
}

var contextPolIntro = {
	header: 'tell us what you think',

	desc: [
		'You will now be shown several pairs of pictures of politicians.  Please indicate which politician in each pair you find more attractive.'
	]
}

var contextPol = {
	question: 'Please indicate which politician in each pair you find more attractive',

	errorText: 'Please select one of the politicians above',

	photos: [
		{
			images: [
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/BillClinton.jpg',
					alt: 'Bill Clinton photo',
					id: 'bill-clinton',
					label: 'Bill Clinton',
					name: 'ex-presidents',
					value: '0'
				},
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/RonaldReagan.jpg',
					alt: 'Ronald Reagan Photo',
					id: 'ronald-reagan',
					label: 'Ronald Reagan',
					name: 'ex-presidents',
					value: '1'
				}
			]
		},
		{
			images: [
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/MitchMcConnell.jpg',
					alt: 'Mitch McConnell photo',
					id: 'mitch-mcconnell',
					label: 'Mitch McConnell',
					name: 'senators',
					value: '1'
				},
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/HarryReid.jpg',
					alt: 'Harry Reid Photo',
					id: 'harry-reid',
					label: 'Harry Reid',
					name: 'senators',
					value: '0'
				}
			]
		},
		{
			images: [
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/JanBrewer.jpg',
					alt: 'Jan Brewer photo',
					id: 'jan-brewer',
					label: 'Jan Brewer',
					name: 'governors',
					value: '1'
				},
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/KathleenSebelius.jpg',
					alt: 'Kathleen Sebelius Photo',
					id: 'kathleen-sebelius',
					label: 'Kathleen Sebelius',
					name: 'governors',
					value: '0'
				}
			]
		},
		{
			images: [
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/MicheleBachmann.jpg',
					alt: 'Michelle Bachmann photo',
					id: 'michelle-bachmann',
					label: 'Michelle Bachmann',
					name: 'house-reps',
					value: '1'
				},
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/NancyPelosi.jpg',
					alt: 'Nancy Pelosi  Photo',
					id: 'nancy-pelosi',
					label: ' Nancy Pelosi',
					name: 'house-reps',
					value: '0'
				}
			]
		},
		{
			images: [
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/JoeBiden.jpg',
					alt: 'Joe Biden photo',
					id: 'joe-biden',
					label: 'Joe Biden',
					name: 'vice-presidents',
					value: '0'
				},
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/DickCheney.jpg',
					alt: 'Dick Cheney Photo',
					id: 'Dick-Cheney',
					label: 'Dick Cheney',
					name: 'vice-presidents',
					value: '1'
				}
			]
		}
	]
}

var contextVotingLineIntro = {
	header: 'Tell us what you think',

	desc: [
		'On the next screen you will see two images of voting lines.  Please indicate which voting line you think is the longest.'
	]
}

var contextVotingLine = {
	validateType: 'radio',

	question: 'Please indicate which voting line you think is longest.',

	errorText: 'Please select one of the voting lines above',

	photos: [
		{
			images: [
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/VotingLine1.jpg',
					alt: 'Voting line photo',
					id: 'voting-line-1',
					label: 'I think this voting line is longest',
					name: 'voting-line',
					value: 0
				},
				{
					src: 'http://www-personal.umich.edu/~shondal/mturk/images/VotingLine2.jpg',
					alt: 'Voting Line Photo',
					id: 'voting-line-2',
					label: 'I think this voting line is longest',
					name: 'voting-line',
					value: 1
				}
			]
		}
	]
}

var contextStatesIntro = {
	header: 'Tell us what you think',

	desc: [
		'You will now be shown several states.  For each state, please answer the following question: Which presidential candidate, Barack Obama or Mitt Romney, won this state\'s electoral votes in the 2012 presidential election?',
	]
}

var contextStates = {
	validateType: 'radio',

	question: 'Which presidential candidate, Barack Obama or Mitt Romney, won this state\'s electoral votes in the 2012 presidential election?',

	errorText: 'Please select one of the presidential candidates above',

	states: [
		{
			src: 'http://www-personal.umich.edu/~shondal/mturk/images/NorthCarolina.png',
			alt: 'North Carolina photo',
			name: 'north-carolina',
			state: 'North Carolina'
		},
		{
			src: 'http://www-personal.umich.edu/~shondal/mturk/images/Georgia.png',
			alt: 'Georgia photo',
			name: 'georgia',
			state: 'Georgia'
		},
		{
			src: 'http://www-personal.umich.edu/~shondal/mturk/images/Florida.png',
			alt: 'Florida photo',
			name: 'florida',
			state: 'Florida'
		},
		{
			src: 'http://www-personal.umich.edu/~shondal/mturk/images/Ohio.png',
			alt: 'Ohio photo',
			name: 'ohio',
			state: 'Ohio'
		}
	],

	options: [
		{
			name: 'obama',
			id: 'obama',
			text: 'Barack Obama',
			value: 0
		},
		{
			name: 'obama',
			id: 'Romney',
			text: 'Mitt Romney',
			value: 1
		}
	]
}

var contextPartThree = {
	header: 'Ready to start part three- the Bonus Task!',

	desc: [
		'We are ready to start part three: This is where you can earn a bonus!'
	]
}

var contextTokenIntro = {
	header: "Bonus Task",

	desc: [
		'On the next screens you will read about decisions that worker A, an Mturker from another HIT, made. The description will include possible actions available to worker A.',
		'Your task is to rate worker A\'s wealth redistribution decision based on your guess of whether your MATCH, who is like you, would think the decision was "socially appropriate" and "consistent with what a <span class="pol-class"></span> would think worker A OUGHT to do".',
		'Remember that you will only earn the bonus if your "social appropriateness" rating is that same as your MATCH\'s rating.  For each rating that is the same, you will earn 10 cents.',
	]
}

var contextTokens = {
	tokensEarned: [10,5,0],

	tokens: {
		10: [0,1,2,3,4,5,6,7,8,9,10],
		5: [5,4,3,2,1,0,1,2,3,4,5],
		0: [10,9,8,7,6,5,4,3,2,1,0]
	},

	tokenLabel: [
		{
			text: 'make a decision',
			val: ''
		},
		{
			text: 'very socially appropriate',
			val: '6'
		},
		{
			text: 'socially appropriate',
			val: '5'
		},
		{
			text: 'somewhat socially appropriate',
			val: '4'
		},
		{
			text: 'somewhat socially inappropriate',
			val: '3'
		},
		{
			text: 'socially inappropriate',
			val: '2'
		},
		{
			text: 'very socially inappropriate',
			val: '1'
		},
	]
}

var contextThankYou = {
	header: 'Thank You',

	desc: [
		'Thank you for participating in our study.'
	]
}
function randomInt( min, max ) {
	return Math.floor( Math.random() * ( max - min ) + min );
}

// get a random item from the context list and delete it from the list
function randomItem( context ) {
	var contextRan = randomInt( 0, context.length ), // get random item
		contextItem = context[contextRan];

	context.splice( contextRan, 1);
	return contextItem;
}

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

// set random token value and function to token value and corresponding text
(function() {
	var yourTokenVal = null,
		otherTokenVal = null,
		tokenList = null,
		order = null,
		take = 'take ',
		make = 'make ',

		// transform text
		spanBold = '<span class="heavy taking-tokens">',
		govtInvolved = 'got the government involved',
		govtNotInvolved = 'did not want the government involved',
		choseText = ' and chose to ',
		taxTrans = ' a tax transfer of '
		takeTrans = choseText + spanBold + take + taxTrans,
		makeTrans = choseText + spanBold + make + taxTrans,
		transEnd = ' worker B.',
		spanUL = '<span class="border-bottom">',
		spanEnd = '</span>',

		count = 0,
		curToken = null;// keep track of where we are in 5 list

	Handlebars.registerHelper('setRandomToken', function( context ) {
		if ( !tokenList || tokenList.length === 0 ) {
			yourTokenVal = randomItem( context.tokensEarned );
			otherTokenVal = Math.abs( yourTokenVal - 10 ); // assign other token
			tokenList = context.tokens[yourTokenVal];
		}

		return yourTokenVal;
	});

	Handlebars.registerHelper('getYourToken', function() {
		return yourTokenVal;
	});

	Handlebars.registerHelper('getOtherToken', function() {
		return otherTokenVal;
	});

	Handlebars.registerHelper('getYourPostTax', function() {
		if ( yourTokenVal === 5 && count < 5 ) {
			return yourTokenVal + curToken;
		}
		return Math.abs( yourTokenVal - curToken );
	});

	Handlebars.registerHelper('getOtherPostTax', function() {
		if ( yourTokenVal === 10 || (yourTokenVal === 5 && count > 5 ) ) {
			return otherTokenVal + curToken;
		} else if ( yourTokenVal === 0 || ( yourTokenVal === 5 && count <= 5 ) ) {
			return otherTokenVal - curToken;
		}

	});

	Handlebars.registerHelper('transferText', function() {
		var out = 'Worker A ';
		curToken = tokenList[0];

		if ( curToken === 0 ) {
			out += govtNotInvolved;
		} else {
			out += govtInvolved;
		}

		if ( yourTokenVal === 10 ) {
			out += makeTrans + spanUL + curToken + spanEnd + ' tokens' +spanEnd + ' to ';
		} else if ( yourTokenVal === 0 ) {
			out += takeTrans + spanUL + curToken + spanEnd + ' tokens' + spanEnd + ' from ';
		} else {
			if ( count >= 5 ) {
				out += makeTrans + spanUL + curToken + spanEnd + ' tokens' + spanEnd + ' to ';
			} else {
				out += takeTrans + spanUL + curToken + spanEnd + ' tokens' + spanEnd + ' from ';
			}
		}

		out += transEnd;
		tokenList.splice(0, 1);
		return out;
	});

	Handlebars.registerHelper('selectName', function() {
		var name = '';
		if ( yourTokenVal === 5 ) {
			name = yourTokenVal + '_norm_' + (10 - count);
			count++;
		} else {
			name = yourTokenVal + '_norm_' + curToken;
		}

		return name;
	});
})();
$(function() {
	$('main').nextQuestion();
});
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
				url: 'https://3ade34c61fbc14a334e363f5f6e07080f79b49cd.googledrive.com/host/0B3xp5m4ZxljjT2p0VzFxTjFlMm8/one-pic.html',
				dataName: 'onePic'
			},
			{
				url: 'https://3ade34c61fbc14a334e363f5f6e07080f79b49cd.googledrive.com/host/0B3xp5m4ZxljjT2p0VzFxTjFlMm8/one-pic-radio-opts.html',
				dataName: 'onePicInput'
			},
			{
				url: 'https://4d96b0e0ede6270b1a617478b01710bdbc20d3b8.googledrive.com/host/0B3xp5m4ZxljjVENJTmo2aXI4aVk/tokens.html',
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
				this.findPolClass( pageNum );
			} else if ( pageNum === 9 ) {
				this.addHeader( contextPartTwo );
			} else if ( pageNum === 10 ) {
				this.addHeader( contextPolIntro)
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
				if ( pageNum === 19 ) {
					this.appendAfter( this.questionContent, this.templates.onePicInput, contextStates );
				}

				// fix radio names of inputs
				this.misc.fixInputName();
			} else if ( pageNum === 23 ) {
				this.addHeader( contextPartThree );
 		} else if ( pageNum === 24 ) {
				// token intro
				this.addHeader( contextTokenIntro );
				this.findPolClass( pageNum );
			} else if ( pageNum >= 25 && pageNum <= 57 ) {
				// token questions
				// add the token base
				this.disableNextButton();
				this.$main.find( this.header ).after( this.templates.tokenBase(contextTokens) );
				this.findPolClass( pageNum );

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

		findPolClass: function( pageNum ) {
			// if ( pageNum === 8 || pageNum === 21 ) {
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
!(function($) {
	var ValidateForm = function( $elt ) {
		this.$validate = $elt;
		this.$question = $( '.question' );
		this.$survey = $( '.survey' );
		this.$questionContent = $( '.question-content' );
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
		this.$select = $( 'select' );
		this.$err = $( '.error' );

		this.tokenErrorString = ' <h3 class="error display col-xs-12 col-sm-12 col-md-12 center">Please use the dropdown above to make a decision</h3>';

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
			if ( this.$select.length > 0 ) {
				if ( this.$select.val() === '' ) {
					this.invalid = false;
					this.tokenError();
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
				// console.log(dataText);
				$err.text( dataText );
				$err.show();
			}
		},

		// adds the token error to the slider
		tokenError: function() {
			if ( this.$err.length === 0 ) {
				this.$questionContent.append( this.tokenErrorString );
			}
		}
	}

	$.fn.validateForm = function() {
		var isValidForm = new ValidateForm( this );
		return isValidForm.validate();
	}

})(window.jQuery);