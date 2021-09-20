import { writeFileSync } from "fs";

export interface Command {
  command: string;
  title: string;
  category: string;
  icon: {
    light: string;
    dark: string;
  }
}

export class Commands {
  
  public static export(heading: number = 2) {
    const cwd = process.cwd();
    const pkg = require(`${cwd}/package.json`);
    
    if (!this.validatePkg(pkg)) {
      return;
    }

    const commands: Command[] = pkg.contributes.commands;
    const commandsNames = commands.sort(this.sorting);    

    const headingStr = '#'.repeat(heading);
    
    for (const command of commandsNames) {
      console.log(`${headingStr ? `${headingStr} `: ''}${command.category ? `${command.category}: ` : ''}${command.title}

ID: \`${command.command}\`
`);
    }
  }

  public static order() {
    const cwd = process.cwd();
    const pkg = require(`${cwd}/package.json`);
    
    if (!this.validatePkg(pkg)) {
      return;
    }

    const commands: Command[] = pkg.contributes.commands;
    const commandsNames = commands.sort(this.sorting);
    
    pkg.contributes.commands = commandsNames;
    console.log(commandsNames)
    writeFileSync(`${cwd}/package.json`, JSON.stringify(pkg, null, 2));
  }

  private static validatePkg(pkg: any) {
    if (!pkg || !pkg.contributes) {
      console.error('package.json is not found or it does not contain "contributes" section');
      return false;
    }
    return true;
  }

  private static sorting(a: Command, b: Command) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1;
    }
    return 0;
  }
}