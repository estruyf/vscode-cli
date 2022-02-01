import { bgGreen, gray } from 'kleur';
import { SettingsTask } from './settings-task';
import { Args } from "../../models";
import inquirer = require('inquirer');

export class SettingsListener {

  public static async listen(options: Args) {
    const settingsTask = new SettingsTask();

    const settings = settingsTask.get();
    const settingsKeys = Object.keys(settings);
    let exampleSetting = "extension.setting";
    if (settingsKeys.length > 0) {
      const settingId = settingsKeys[0].split('.').shift();
      exampleSetting = `${settingId}.newSetting`;
    }

		// Check if parameters are passed correctly
		options = await this.promptForMissingParams(options, exampleSetting);

    if (options.action === "export") {
      settingsTask.export(options.heading);
    } else if (options.action === "sort") {
      settingsTask.order();
    } else if (options.action === "add") {
      if (options.name) {
        settingsTask.add(options.name, options.type, options.description);
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
   private static async promptForMissingParams(options: any, exampleSetting: string) {
    const questions = [];
  
    if (options.action === 'add') {
      if (!options.name) {
        questions.push({
          type: 'input',
          name: 'name',
          message: `What is the name of your new setting to add?`,
          default: exampleSetting
        });
      }
  
      if (!options.type) {
        questions.push({
          type: 'checkbox',
          name: 'type',
          message: `What is the type of the new setting?`,
          choices: ["string", "number", "boolean", "array", "object"],
        });
      }
  
      if (!options.description) {
        questions.push({
          type: 'input',
          name: 'description',
          message: `What is the description of your setting (markdown format)?`,
          default: '',
        });
      }
    }
  
    try {
      const answers = await inquirer.prompt(questions);
  
      return {
        ...options,
        name: options.name || answers.name,
        type: options.type || answers.type,
        description: options.description || answers.description
      };
    } catch (e: any) {
      throw e.message;
    }
  }
}