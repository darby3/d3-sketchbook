'use strict';
const path = require('path');
const fractal = module.exports = require('@frctl/fractal').create();

/*
 * Set the project title here.
 */
fractal.set('project.title', 'd3 sketchbook');

/*
 * Tell Fractal where to look for components, docs, and static assets.
 */
fractal.components.set('path', path.join(__dirname, 'components'));
fractal.components.set('default.status', 'wip');
fractal.docs.set('path', path.join(__dirname, 'docs'));
fractal.web.set('static.path', path.join(__dirname, 'public'));

/**
 * Static export destination.
 */
fractal.web.set('builder.dest', __dirname + '/build');

/**
 * Theme customization.
 */
const mandelbrot = require('@frctl/mandelbrot'); // require the Mandelbrot theme module

// create a new instance with custom config options
const myCustomisedTheme = mandelbrot({
  skin: "teal"
});

// tell Fractal to use the configured theme by default
fractal.web.theme(myCustomisedTheme);
