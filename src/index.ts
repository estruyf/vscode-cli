import * as inquirer from 'inquirer';
import * as arg from 'arg';
import { bgBlue, bgGreen, bgMagenta, bgYellow, blue, gray, green, red, yellow } from 'kleur';
import { Commands } from './commands';
import { Settings } from './settings';

function parseArguments(options: any) {
	try {
		const args = arg({
			'--heading': Number,
			'-h': '--heading'
		}, { argv: options.slice(2) });
		
		return {
			task: args._[0] ? args._[0].startsWith('--help') ? 'help' : args._[0] : null,
			action: args._[1] ? args._[1].startsWith('--help') ? 'help' : args._[1] : null,
			heading: typeof args['--heading'] === 'number' ? args['--heading'] : 2, // Default: 2
		};
	} catch (e: any) {
		if (e.code === 'ARG_MISSING_REQUIRED_LONGARG' && e.message.includes('--heading')) {
			throw "Option '--heading' requires number argument.";
		}

		throw e.message;
	}
}

async function promptForMissingArgs(options: any) {
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
			choices: ["export", "sort"]
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

export async function cli(args: string[]) {
	try {
		let options = parseArguments(args);
		options = await promptForMissingArgs(options);

    if (options.task === "help") {
      console.log(`
${bgGreen().black().bold(" USAGE ")}

$ ${green(`vsc`)} ${blue(`<commands>`)} ${yellow(`[options]`)}

${bgBlue().white().bold(" COMMANDS ")}	

${blue(`commands export`)} - List all available commands as Markdown output.
${blue(`settings export`)} - List all available settings as Markdown output.

${blue(`commands sort`)} - Sort all commands in the package.json file.
${blue(`settings sort`)} - Sort all settings in the package.json file.

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
`);
    } else if (options.task === "settings") {
      if (options.action === "export") {
				Settings.export(options.heading);
			} else if (options.action === "sort") {
				Settings.order();
			}
    } else if (options.task === "commands") {
			console.log(options)
      if (options.action === "export") {
				Commands.export(options.heading);
			} else if (options.action === "sort") {
				Commands.order();
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