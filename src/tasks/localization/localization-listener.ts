import { bgGreen, gray } from "kleur";
import { LocalizationTask } from "./localization-task";
import { Args } from "../../models";
import inquirer = require("inquirer");

export class LocalizationListener {
  public static async listen(options: Args) {
    const localizationTask = new LocalizationTask();

    localizationTask.process();

    console.log(bgGreen(gray(` Done! `)));
  }

  /**
   * Check if there are missing parameters
   * @param options
   * @returns
   */
  private static async promptForMissingParams(
    options: any,
    exampleSetting: string
  ) {
    const questions: inquirer.QuestionCollection[] = [];

    try {
      const answers = await inquirer.prompt(questions);

      return {
        ...options,
        name: options.name || answers.name,
        type: options.type || answers.type,
        description: options.description || answers.description,
      };
    } catch (e: any) {
      throw e.message;
    }
  }
}
