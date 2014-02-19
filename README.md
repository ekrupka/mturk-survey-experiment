Mturk Experiment Survey
================================

This site is used for a study on Amazon Mechanical Turk, and utilizes the Mturk HTML Question structure. The website is a single-page JavaScript and utilizes Handlebar templates. The project employs Grunt for task management of LESS and JS files, and utilizes Google Drive as a means to serve the JS, CSS, and images for the site. 

The survey has five categories of questions. The study follows these five categories in order, but within each category, the order of the questions are randomized. Additionally, only one question is displayed to the user at a time, except for the survey questions at the conclusion of the study.

The first category asks the user to identify which of two politicians they find more attractive. The politicians are grouped into two groups, Republicans and Democrats, and the side of the page in which the Republicans and Democrats appear is randomized. The order in which the politicians appear is randomized, as well.

The second category asks the user to identify which voting line they think is longer between two different voting lines, which appear in images on the site. Again, the voting line images are randomly displayed on either side.

The third category asks the user to identify which presidential candidate won a state's election in 2012. The side in which the radio input for Obama or Romney is displayed is randomly chosen when a user first reaches this category. These radio inputs stay on their respective side for the duration of this category.

The fourth category asks the user to distribute tokens. This category uses the [jQuery NoUiSlider plugin](https://github.com/leongersen/noUiSlider) as a way to allow users to distribute tokens. The token order is randomly chosen from four possible token orders.

The fifth category is a survey questionnaire. 

When a user advances to the next question their answers to the current question are grabbed and appended to the Mturk form for submission to Amazon. There are also input validations throughout the survey.

Feel free to check out the [site](http://sdalezman.github.io/mturk-survey-expirment/).