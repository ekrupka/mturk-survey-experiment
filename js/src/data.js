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
				'<h2 class="col-md-12 italic center"><span class="border-bottom">"consistent with what most <span class="pol-class"></span>s would think that worker A OUGHT to do".</span></h2>',
			'That sounds simple, but it is only half the story!',
			'Specifically, you will only earn the bonus if your "social appropriateness" rating MATCHES the rating of another Mturker working on this HIT previously who is a <span class="border-bottom"><span class="pol-class"></span> playing this matching game with other <span class="pol-class"></span>s</span>. We will call this Mturker "your match."',
			'To increase the chances that you earn the bonus, you should try to imagine what <span class="border-bottom">your match</span>, who is a <span class="pol-class"></span> guessing what other <span class="pol-class">s</span> believe, would say.',
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
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/BillClinton.jpg',
					alt: 'Bill Clinton photo',
					id: 'bill-clinton',
					label: 'Bill Clinton',
					name: 'ex-presidents',
					value: '0'
				},
				{
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/RonaldReagan.jpg',
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
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/MitchMcConnell.jpg',
					alt: 'Mitch McConnell photo',
					id: 'mitch-mcconnell',
					label: 'Mitch McConnell',
					name: 'senators',
					value: '1'
				},
				{
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/HarryReid.jpg',
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
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/JanBrewer.jpg',
					alt: 'Jan Brewer photo',
					id: 'jan-brewer',
					label: 'Jan Brewer',
					name: 'governors',
					value: '1'
				},
				{
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/KathleenSebelius.jpg',
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
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/MicheleBachmann.jpg',
					alt: 'Michelle Bachmann photo',
					id: 'michelle-bachmann',
					label: 'Michelle Bachmann',
					name: 'house-reps',
					value: '1'
				},
				{
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/NancyPelosi.jpg',
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
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/JoeBiden.jpg',
					alt: 'Joe Biden photo',
					id: 'joe-biden',
					label: 'Joe Biden',
					name: 'vice-presidents',
					value: '0'
				},
				{
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/DickCheney.jpg',
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
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/VotingLine1.jpg',
					alt: 'Voting line photo',
					id: 'voting-line-1',
					label: 'I think this voting line is longest',
					name: 'voting-line',
					value: 0
				},
				{
					src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/VotingLine2.jpg',
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
			src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/NorthCarolina.png',
			alt: 'North Carolina photo',
			name: 'north-carolina',
			state: 'North Carolina'
		},
		{
			src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/Georgia.png',
			alt: 'Georgia photo',
			name: 'georgia',
			state: 'Georgia'
		},
		{
			src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/Florida.png',
			alt: 'Florida photo',
			name: 'florida',
			state: 'Florida'
		},
		{
			src: 'https://rawgit.com/ekrupka/mturk-survey-experiment/NEP_treat_cross_ID/images/Ohio.png',
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
		'On the next screens you will read about decisions that worker A, an MTurker from another HIT, made. The description will include possible actions available to worker A.',
		'Your task is to rate worker A\'s wealth redistribution decision based on your guess of whether your MATCH, who is a <span class="pol-class"></span> playing this matching game with other <span class="pol-class"></span>s, would think the decision was "socially appropriate" and "consistent with what a <span class="pol-class"></span> would think worker A OUGHT to do".',
		'Remember that you will only earn the bonus if your "social appropriateness" rating is the same as your MATCH\'s rating. For each rating that is the same, you will earn 10 cents.',
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