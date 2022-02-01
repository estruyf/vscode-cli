import * as inquirer from 'inquirer';
import * as arg from 'arg';
import { red } from 'kleur';
import { CommandsListner, HelpTask, SettingsListener } from './tasks';
import { Args } from './models';

/**
 * Starts the CLI
 * @param args 
 */
 export async function cli(args: string[]) {
	try {
		let options = parseArguments(args);
		// Check the tasks and commands
		options = await promptMissingTask(options);
		options = await promptMissingAction(options);

    if (options.task === "help") {
      HelpTask.log();
    } else if (options.task === "settings") {
      await SettingsListener.listen(options as Args);
    } else if (options.task === "commands") {
      await CommandsListner.listen(options as Args);
		}

    process.exit(0);
  } catch (e: any | Error) {
		if (e.message || e) {
			console.log(red(e.message || e));
		} else {
			console.log(red(`Sorry, but this is not going to work.`));
		}
    process.exit(1);
  }
}

/**
 * Validate all the arguments
 * @param options 
 * @returns 
 */
function parseArguments(options: any) {
	try {
		const args = arg({
			'--heading': Number,
			'--name': String,
			'--title': String,
			'--category': String,
			'--type': String,
			'--description': String,
			'-h': '--heading',
			'-n': '--name',
			'-t': '--title',
			'-c': '--category',
		}, { argv: options.slice(2) });
		
		return {
			task: args._[0] ? args._[0].startsWith('--help') ? 'help' : args._[0] : null,
			action: args._[1] ? args._[1].startsWith('--help') ? 'help' : args._[1] : null,
			heading: typeof args['--heading'] === 'number' ? args['--heading'] : 2, // Default: 2
			name: typeof args['--name'] === 'string' ? args['--name'] : null,
			title: typeof args['--title'] === 'string' ? args['--title'] : null,
			category: typeof args['--category'] === 'string' ? args['--category'] : null,
			type: typeof args['--type'] === 'string' ? args['--type'] : null,
			description: typeof args['--description'] === 'string' ? args['--description'] : null,
		};
	} catch (e: any) {
		if (e.code === 'ARG_MISSING_REQUIRED_LONGARG' && e.message.includes('--heading')) {
			throw "Option '--heading' requires number argument.";
		}

		throw e.message;
	}
}

/**
 * Prompts the user for missing task
 */
async function promptMissingTask(options: any) {
	if (options.task === 'help') {
		return options;
	}

	const questions = [];

	if (!options.task) {
		questions.push({
			type: 'list',
			name: 'task',
			message: 'For which task type do you want to execute?',
			choices: ["settings", "commands", "help"]
		});
	}

	try {
		const answers = await inquirer.prompt(questions);

		return {
			...options,
			task: options.task || answers.task
		};
	} catch (e: any) {
		throw e.message;
	}
}

/**
 * Prompts the user for missing action
 */
async function promptMissingAction(options: any) {
	if (options.task === 'help') {
		return options;
	}

	const questions = [];

	if (!options.action) {
		questions.push({
			type: 'list',
			name: 'action',
			message: 'Which action do you want to perform?',
			choices: ["export", "sort", "add"]
		});
	}

	try {
		const answers = await inquirer.prompt(questions);

		return {
			...options,
			action: options.action || answers.action
		};
	} catch (e: any) {
		throw e.message;
	}
}
