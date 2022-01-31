import { writeFileSync } from "fs";
import { Packager } from "../helpers/Packager";

export interface Command {
  command: string;
  title: string;
  category?: string;
  icon?: {
    light: string;
    dark: string;
  }
}

export class Commands {
  
  public static export(heading: number = 2) {
    const pkg = Packager.fetch();
    
    if (!Packager.validate(pkg)) {
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
    const pkg = Packager.fetch();
    
    if (!Packager.validate(pkg)) {
      return;
    }

    const commands: Command[] = pkg.contributes.commands;
    const commandsNames = commands.sort(this.sorting);
    
    pkg.contributes.commands = commandsNames;
    writeFileSync(Packager.location(), JSON.stringify(pkg, null, 2));
  }

  public static add(name: string, title?: string | null, category?: string | null) {
    const pkg = Packager.fetch();

    if (!Packager.validate(pkg)) {
      return;
    }

    const commands: Command[] = pkg.contributes.commands;
    const newCommand: Command = {
      command: name,
      title: title || 'Hello World!'
    }

    if (category) {
      newCommand.category = category;
    }

    commands.push(newCommand);

    pkg.contributes.commands = commands;

    writeFileSync(Packager.location(), JSON.stringify(pkg, null, 2));
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