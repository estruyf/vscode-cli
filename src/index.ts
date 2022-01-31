import * as inquirer from 'inquirer';
import * as arg from 'arg';
import { bgBlue, bgGreen, bgMagenta, bgYellow, blue, gray, green, red, yellow } from 'kleur';
import { Commands } from './commands';
import { Settings } from './settings';

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

async function promptForMissingArgs(options: any) {

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
			task: options.task || answers.task
		};
	} catch (e: any) {
		throw e.message;
	}
}


async function promptForMissingParams(options: any) {

	if (options.task === 'help') {
		return options;
	}

	const questions = [];

	if (options.action === 'add') {
		if (!options.name) {
			questions.push({
				type: 'input',
				name: 'name',
				message: `What is the name of the ${options.task === "commands" ? "command" : "setting"}?`,
				default: options.task === "commands" ? "extension.sayHello" : "extension.setting"
			});
		}

		if (options.task === "commands" && !options.title) {
			questions.push({
				type: 'input',
				name: 'title',
				message: `What is the title of the command?`,
				default: 'Hello World'
			});
		}

		if (options.task === "commands" && !options.category) {
			questions.push({
				type: 'input',
				name: 'category',
				message: `Do you want to specify a category for your command?`,
				default: null
			});
		}

		if (options.task === "commands" && !options.category) {
			questions.push({
				type: 'input',
				name: 'category',
				message: `Do you want to specify a category for your command?`,
				default: null
			});
		}

		if (options.task === "settings" && !options.type) {
			questions.push({
				type: 'checkbox',
				name: 'type',
				message: `What is the type of the new setting?`,
				default: 'string',
				choices: ["string", "number", "boolean", "array", "object"],
			});
		}

		if (options.task === "settings" && !options.description) {
			questions.push({
				type: 'input',
				name: 'description',
				message: `What is the description of the new setting?`,
				default: '',
			});
		}
	}

	try {
		const answers = await inquirer.prompt(questions);

		return {
			...options,
			name: options.name || answers.name
		};
	} catch (e: any) {
		throw e.message;
	}
}


/**
 * Starts the CLI
 * @param args 
 */
export async function cli(args: string[]) {
	try {
		let options = parseArguments(args);
		// Check the tasks and commands
		options = await promptForMissingArgs(options);
		// Check if parameters are passed correctly
		options = await promptForMissingParams(options);

    if (options.task === "help") {
      console.log(`
${bgGreen().black().bold(" USAGE ")}

$ ${green(`vsc`)} ${blue(`<commands>`)} ${yellow(`[options]`)}

${bgBlue().white().bold(" COMMANDS ")}	

${blue(`commands export`)} - List all available commands as Markdown output.
${blue(`settings export`)} - List all available settings as Markdown output.

${blue(`commands sort`)} - Sort all commands in the package.json file.
${blue(`settings sort`)} - Sort all settings in the package.json file.

${blue(`commands add`)} - Adds a new command.
${blue(`settings add`)} - Adds a new setting.

${bgYellow().black().bold(" OPTIONS ")}	

${yellow(`--heading, -h`)} -  Specify a heading level for the output. ${gray(`DEFAULT: 2`)}

${bgMagenta().white().bold(" EXAMPLES ")}	

$ ${green(`vsc`)} ${blue(`commands export`)}

## Command category: title

- ID: \`command id\`

$ ${green(`vsc`)} ${blue(`settings export`)} ${yellow(`--heading 2`)}

## Setting

Markdown description || description

- Type: \`type\`
- Default: \`default\`

$ ${green(`vsc`)} ${blue(`commands add`)} ${yellow(`--name <id of the command> --title <title of the command>`)}

$ ${green(`vsc`)} ${blue(`settings add`)} ${yellow(`--name <id of the setting>`)}
`);
    } else if (options.task === "settings") {
      if (options.action === "export") {
				Settings.export(options.heading);
			} else if (options.action === "sort") {
				Settings.order();
			} else if (options.action === "add") {
				if (options.name) {
					Settings.add(options.name, options.type, options.description);
				} else {
					throw "Missing parameter 'name'";
				}
			}
    } else if (options.task === "commands") {
      if (options.action === "export") {
				Commands.export(options.heading);
			} else if (options.action === "sort") {
				Commands.order();
			} else if (options.action === "add") {
				if (options.name) {
					Commands.add(options.name, options.title, options.category);
				} else {
					throw "Missing parameter 'name'";
				}
			}
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