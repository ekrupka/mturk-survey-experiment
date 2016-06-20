# Mturk Experiment Survey
This study utilizes the Amazon Mechanical Turk HTML question structure. The website is a single page JavaScript application, uses [grunt](http://gruntjs.com/) for task management, [handlebars](http://handlebarsjs.com/) as a templating engine, and [less](http://lesscss.org/) as a CSS preprocessor. 

In order to find the different experiments that were ran on Mturk please navigate to the different branches, which contains the code for each experiment:

- [Treat Behavior](https://github.com/ekrupka/mturk-survey-experiment/tree/treat_behavior)
- [Treat Norms](https://github.com/ekrupka/mturk-survey-experiment/tree/treat_norms) Note: This is identical to the Primed + Framed + Id-Matched condition below
- [Base Behavior](https://github.com/ekrupka/mturk-survey-experiment/tree/base_behavior) Note: This has been rewritten to No Prime + Framed and is identical to the No Prime + Framed new condition below.
- [Base Norms Conditional](https://github.com/ekrupka/mturk-survey-experiment/tree/base_norms_conditional) Note: Same as the No Prime + No Frame + Id-Matched condition below.
- [Base Norms Unconditional](https://github.com/ekrupka/mturk-survey-experiment/tree/base_norms_unconditional) Note: This was rewritten over to the No Prime + Framed + Random-Matched condition and is NO LONGER the ORIGINAL baseline norms we had. The original version can be found below as No Prime + No Frame + Random-Matched
- [Treat Norms with Random Matching] (https://github.com/ekrupka/mturk-survey-experiment/tree/treat_norms_random_matched)
Note: This has since been updated to the Primed + Framed + Random-Matched condition below.

NEW CONDITIONS
- [NORMS: Primed + No Frame + Id-Matched] (https://github.com/ekrupka/mturk-survey-experiment/tree/treat_norms_no-frame_matched)
- [NORMS: Primed + No Frame + Random-Matched] (https://github.com/ekrupka/mturk-survey-experiment/tree/treat_norms_no-frame_random)
- [NORMS: Primed + Framed + Random-Matched] (https://github.com/ekrupka/mturk-survey-experiment/tree/treat_norms_framed_random)
- [NORMS: Primed + Framed + Id-Matched] (https://github.com/ekrupka/mturk-survey-experiment/tree/treat_norms_framed_matched)
- [NORMS: No Prime + Framed + Id-Matched] (https://github.com/ekrupka/mturk-survey-experiment/tree/base_norms_framed_matched)
- [NORMS: No Prime + Framed + Random-Matched] (https://github.com/ekrupka/mturk-survey-experiment/tree/base_norms_framed_random)
- [NORMS: No Prime + No Frame + Id-Matched] (https://github.com/ekrupka/mturk-survey-experiment/tree/base_norms_no-frame_matched)
- [NORMS: No Prime + No Frame + Random-Matched] (https://github.com/ekrupka/mturk-survey-experiment/tree/base_norms_no-frame_random)
- [BEHAVIOR: No Prime + Framed] (https://github.com/ekrupka/mturk-survey-experiment/tree/base_behavior_framed)


The code architecture is explained below.

## Run Locally 
In order to run the website locally you will need to run a local server. If you have python on your system (if you have a mac you do), you can run python's simple server via `python -m SimpleHTTPServer`.

## Structure
`index.html` is the html file that needs to be included in the Mturk HTML question file. It contains the mturk form and renders all the SPA.

### Grunt 
In order to see the updates you have made to the JavaScript files and the less you have to run `grunt watch`. This will tell grunt to watch all the JavaScript and less files in `js/src/*.js and css/src/*.less` and concatenate the files on each change. You can change the structure of how the builds occur via the `Gruntfile.js`.

If you do not have grunt installed, follow the [grunt installation guide](http://gruntjs.com/getting-started). If you do not have npm, you will need to install node.js on your system in order to build the JavaScript and css files. 

### JavaScript
The JavaScript on the site is located in the `/js/src` folder. Each file in `js/src` is a different component of the site and they are all concatenated together to `js/bin/mturk.js`. The mturk.js file is the JavaScript file that is rendered in `index.html`. Please look at the comments in the files of `js/src/` in order to see what each file does. 

### Less
The CSS of the site is built using LESS as a CSS Preprocessor. Similar to the JavaScript files, the less files are located in `css/src` and are separated out into different components. The Less is concatenated to one less file `css/bin/main.less` which is converted to css and concatenated with all dependent css files to `css/bin/style.css`.

### Templates
`templates/` contain all the handlebar templates that are all requested via JavaScript. 

## How to Publish
In order to run the site you need to put the content in index.html in a mturk HTML structure file and upload it to mturk. You will also need to host all the JavaScript, css, images, and templates on your own servers. 

## NOTE
Before you publish make sure to uncomment line 218 in nextQuestion.js `this.$mturkForm.submit();` or the form will not submit. If this line is active when you are developing locally it will try to submit the mturk form and error out.