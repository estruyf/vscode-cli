import { Command } from "../../models";
import { BaseTask } from "../base-task";


export class CommandsTask extends BaseTask {

  /**
   * Export all commands for documentation
   * @param heading 
   */
  public async export(heading: number) {
    const commands: Command[] = this.get();
    const commandsNames = commands.sort(this.alphabetically('title'));    

    const headingStr = '#'.repeat(heading);
    
    for (const command of commandsNames) {
      console.log(`${headingStr ? `${headingStr} `: ''}${command.category ? `${command.category}: ` : ''}${command.title}

ID: \`${command.command}\`
`);
    }
  }

  /**
   * Sort all the commands
   * @returns 
   */
  public order() {
    const commands: Command[] = this.get();
    const commandsNames = commands.sort(this.alphabetically('title')); 
    
    this.package.contributes.commands = commandsNames;
    this.update(this.package);
  }

  /**
   * Add a new command
   * @param name 
   * @param title 
   * @param category 
   */
  public add(name: string, title?: string | null, category?: string | null) {
    const commands: Command[] = this.get();

    const newCommand: Command = {
      command: name,
      title: title || 'Hello World!'
    }

    if (category) {
      newCommand.category = category;
    }

    commands.push(newCommand);

    this.package.contributes.commands = commands;
    this.update(this.package);
  }

  /**
   * Retrieve all commands
   * @returns 
   */
  public get() {
    return this.package?.contributes.commands;
  }
}