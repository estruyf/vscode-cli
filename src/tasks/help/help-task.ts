import { bgBlue, bgGreen, bgMagenta, bgYellow, blue, gray, green, yellow } from 'kleur';
const pkg = require('../../../package.json');

export class HelpTask {

  public static log() {
    console.log(`
Visual Studio Code - CLI - Version: ${pkg.version}

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
  }
}