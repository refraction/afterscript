const { join } = require('path');
const { copy } = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const exists = require('command-exists');

const cwd = process.cwd();
const hasYarn = exists.sync('yarnpkg');
const initMessage = `
${chalk.magenta('To begin working, do the following:')}

    ${chalk.grey(`${chalk.white(`${chalk.magenta('❯')} ${hasYarn ? 'yarn' : 'npm install'}`)} # install dependencies`)}
    ${chalk.grey(`${chalk.white(`${chalk.magenta('❯')} ${hasYarn ? 'yarn build' : 'npm run build'}`)} # build the script`)}
    ${chalk.grey(`${chalk.white(`${chalk.magenta('❯')} ${hasYarn ? 'yarn build-production' : 'npm run build-production'}`)} # build and minify`)}

${chalk.magenta('Happy coding!')}`;

async function init() {
	// Show the spinner
	const spinner = ora(chalk.magenta.bold('Setting up new project...'));
	spinner.color = 'magenta';
	spinner.start();

	try {
		// Copy files
		await copy(join(__dirname, '../init'), cwd);
		spinner.succeed(chalk.green.bold('Project setup complete!'));

		// Show message
		console.log(initMessage);
	} catch (e) {
		spinner.stop();
		console.error(chalk.bgRed.black(' ERROR '), chalk.red.bold('Build failed with the following error:'));
		console.error(e.toString());
		if (e.codeFrame) {
			console.log(e.codeFrame);
		}
	}
}

init();
