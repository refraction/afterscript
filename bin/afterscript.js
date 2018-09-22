#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program
	.version(pkg.version)
	.description('AfterScript CLI tool')
	.usage('[command] [-options]');

program.command('build', 'Bundle the assets and build the script');
program.command('init', 'Initialize a new project in a current folder');

program.parse(process.argv);
