
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
    
    if (!pkg || !pkg.contributes) {
      console.error('package.json is not found or it does not contain "contributes" section');
      return;
    } 

    const commands: Command[] = pkg.contributes.commands;
    const commandsNames = commands.sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
      return 0;
    });    

    const headingStr = '#'.repeat(heading);
    
    for (const command of commandsNames) {
      console.log(`${headingStr ? `${headingStr} `: ''}${command.category ? `${command.title}: ` : ''}${command.title}

- ID: \`${command.command}\`
`);
    }
  }
}