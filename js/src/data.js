/* DATA OPTIONS FOR DIFFERENT TEMPLATES */	
var contextIntro = {
	header: 'Overview of tasks',

	desc: [
		'This is a study in decision making that has three parts.  You will earn a 50 cent base pay for completing the study.',
		'In the first part, we will ask you to tell us what you think about various images.',
		'In the second part, you will have a chance to earn a bonus.  Your earnings for the second part will be in tokens, which will be converted to money.  Every 10 tokens you earn is worth $1 to you.  Your earnings will depend on the decisions you make and on the decisions that the other worker you are paired with will make.',
		'In the final third part, we will ask you to tell us about yourself.',
		'You will be paid the base plus the bonus within 3 days after you complete this task.',
		'<h2 class="error display heavy">Note: If you are using Internet Explorer you will not be able to complete the survey. Please try using Safari, Firefox, or Chrome.</h2>'
	]
}

var contextPolIntro = {
	header: 'Tell us what you think',

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
		'You will now be shown several states.  For each state, please answer the following question: Which presidential candidate, Barack Obama or Mitt Romney, won this state’s electoral votes in the 2012 presidential election?',
	]
}

var contextStates = {
	validateType: 'radio',

	question: 'Which presidential candidate, Barack Obama or Mitt Romney, won this state’s electoral votes in the 2012 presidential election?',

	errorText: 'Please select one of the presdential candidates above',

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

var contextTokenIntro = {
	header: "Bonus Task",

	descAll: [
		[
			'For the following task, you will be randomly paired with another person, whom we will call your match.  The match will be randomly selected from the other workers.',
		],
		[
			'Some times people earn lots in our economy and sometimes people earn little in our economy.',
			'Taxes are a way to redistribute money between citizens.',
			'You can determine the tax transfer between you and another participant in this study with whom you have been matched.',
			'You will be shown a situation.  In the situation one or more of you will be holding some number of tokens.  You will then decide what you want the tax transfer to be between you and your match.'
		],
		[
			'When you and your match have entered all of your decisions, we will then randomly pick one of the decisions from the set that you and your match made.  The selected decision will determine the final token split between you and your match and will be paid out to you as a bonus for this task.'
		]
	]
}

var contextTokens = [
	[10,9,8,7,6,5,4,3,2,1,0],
	[0,1,2,3,4,5,6,7,8,9,10],
	[5,10,9,8,7,6,4,3,2,1,0],
	[5,0,1,2,3,4,6,7,8,9,10]
];

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

var contextThankYou = {
	header: 'Thank You',

	desc: [
		'Thank you for participating in our study.' 
	]
}