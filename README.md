Mturk Experiment Survey
================================

This site uses Handlebar templates and is a JavaScript single page app. It is used in an Amazon Mechanical Turk Survey via the Mturk HTML Question structure. The HTML Question is hosted on Amazon and therefore Google Drive is used to serve the JS, CSS, and Handlebar templates in order to not have a distinct server for this project.

The survey has 5 categories of questions. The study follows these 5 categorizes in order, but within each category the order of the questions are randomized. Only one question is displayed to the user at a time - except for the survey question at the conclusion of the study.

The first category asks the user to identify whom of two politicians that they find more attractive. The politicians are grouped into Republicans and Democrats and the side of the page in which the Republican or Democrat appears is randomized. 

The second category asks the user to identify which voting line they think is longer between two different voting lines. Again, the voting line images are randomly displayed on either side.

The third category asks the user to identify who won the election of a State in 2012 Obama or Romney. The side on which the radio input for the Obama or Romney is displayed is randomly chosen when a user first reaches this section and stays on that respective side for the duration of these questions.

The fourth category asks the user to distribute tokens. This category uses the [jQuery NoUiSlider plugin]('https://github.com/leongersen/noUiSlider') as a way to allow users to distribute tokens. The token order is randomly chosen from four possible token orders.

The fifth category is a survey questionnaire. 

Throughout the study when a user clicks to see the next question, the inputs they entered are grabbed and append to the Mturk form that is used by Amazon Mechanical Turk. There are input validations throughout the survey.

Feel free to check out the [site]('http://sdalezman.github.io/mturk-survey-expirment/').