import { CommandsTask } from './commands-task';
import inquirer = require("inquirer");
import { Args, Command } from "../../models";
import { bgGreen, gray } from 'kleur';
export class CommandsListner {

  public static async listen(options: Args) {
    const commandTask = new CommandsTask();

    const commands = commandTask.get();
    const commandNames = commands.map((c: Command) => c.command);
    let exampleCommand = "extension.sayHello";
    if (commandNames.length > 0) {
      const settingId = commandNames[0].split('.').shift();
      exampleCommand = `${settingId}.sayHello`;
    }

		// Check if parameters are passed correctly
		options = await this.promptForMissingParams(options, exampleCommand);

    if (options.action === "export") {
      commandTask.export(options.heading);
    } else if (options.action === "sort") {
      commandTask.order();
    } else if (options.action === "add") {
      if (options.name) {
        commandTask.add(options.name, options.title, options.category);
      } else {
        throw "Missing parameter 'name'";
      }
    }

    console.log(bgGreen(gray(` Done! `)));
  }

  /**
   * Check if there are missing parameters
   * @param options 
   * @returns 
   */
  private static async promptForMissingParams(options: any, exampleCommand: string) {
    const questions = [];
  
    if (options.action === 'add') {
      if (!options.name) {
        questions.push({
          type: 'input',
          name: 'name',
          message: `What is the identifier of the command to add?`,
          default: exampleCommand
        });
      }
  
      if (!options.title) {
        questions.push({
          type: 'input',
          name: 'title',
          message: `What is the tile by which the command is represented in the UI?`,
          default: 'Hello World'
        });
      }
  
      if (!options.category) {
        questions.push({
          type: 'input',
          name: 'category',
          message: `What is the category by which the command is grouped in the UI (optional)?`,
          default: null
        });
      } 
    }
  
    try {
      const answers = await inquirer.prompt(questions);
  
      return {
        ...options,
        name: options.name || answers.name,
        title: options.title || answers.title,
        category: options.category || answers.category
      };
    } catch (e: any) {
      throw e.message;
    }
  }
}