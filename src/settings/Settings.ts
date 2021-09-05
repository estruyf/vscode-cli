

export class Settings {
  
  public static export(heading: number = 2) {
    const cwd = process.cwd();
    const pkg = require(`${cwd}/package.json`);
    
    if (!pkg || !pkg.contributes) {
      console.error('package.json is not found or it does not contain "contributes" section');
      return;
    } 

    const settings = pkg.contributes.configuration?.properties;
    const settingNames = Object.keys(settings).sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
      return 0;
    });    

    const headingStr = '#'.repeat(heading);
    
    for (const name of settingNames) {
      const setting = settings[name];
      console.log(`${headingStr ? `${headingStr} `: ''}${name}

${setting.markdownDescription || setting.description || ''}

- Type: ${typeof setting.type === "object" ? `\`${setting.type.join(', ')}\`` : `\`${setting.type}\`` || '`unknown`'} ${setting.default ? `
- Default: \`${setting.default}\`` : ''}
`);
    }
  }
}