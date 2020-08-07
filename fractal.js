'use strict';
const path = require('path');
const fractal = module.exports = require('@frctl/fractal').create();

/*
 * Set the project title here.
 */
fractal.set('project.title', 'Fractal Starter Project');

/*
 * Tell Fractal where to look for components, docs, and static assets.
 */
fractal.components.set('path', path.join(__dirname, 'components'));
fractal.components.set('default.status', 'wip');
fractal.docs.set('path', path.join(__dirname, 'docs'));
fractal.web.set('static.path', path.join(__dirname, 'public'));
