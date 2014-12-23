# Mturk Experiment Survey

This study utilizes the Amazon Mechanical Turk HTML question stucture. The website is a single page JavaScript applicathttp://handlebarsjs.com/ion, uses [grunt](http://gruntjs.com/) for task management, [handlebars]() as a templating engine, and [less](http://lesscss.org/) as a CSS preprocessor. 

## Run Locally 
In order to run the website locally you will need to run a local server. If you have python on your system (if you have a mac you do), you can run python's simple server via `python -m SimpleHTTPServer`.

## Structure
`index.html` is the html file that needs to be included in the Mturk HTML question file. It contains the mturk form and renders all the SPA.

### Grunt 
In order to see the updates you have made to the javascript files and the less you have to run `grunt watch`. This will tell grunt to wath all the javascript and less files in `js/src/*.js and css/src/*.less` and concatenate the files on each change. You can change the structure of how the builds occur via the `Gruntfile.js`.

If you do not have grunt installed, follow the [grunt installation guide](http://gruntjs.com/getting-started). If you do not have npm, you will need to install node.js on your system in order to build the javascript and css files. 

### JavaScript
The JavaScript on the site is located in the `/js/src` folder. Each file in `js/src` is a different component of the site and they are all concatenated together to `js/bin/mturk.js`. The mturk.js file is the javascript file that is rendered in `index.html`. Please look at the comments in the files of `js/src/` in order to see what each file does. 

### Less
The CSS of the site is built using LESS as a CSS Preprocessor. Similar to the JavaScript files, the less files are located in `css/src` and are seperated out into different components. The Less is concatanated to one less file `css/bin/main.less` which is converted to css and concatanted with all dependent css files to `css/bin/style.css`.

### Templates
`templates/` contain all the handlebar templates that are all requested via javascript. 

## How to Publish
In order to run the site you need to put the content in index.html in a mturk HTML structure file and upload it to mturk. You will also need to host all the javascript, css, images, and templates on your own servers. 
