import { writeFileSync } from "fs";

export class Settings {
  
  public static export(heading: number = 2) {
    const cwd = process.cwd();
    const pkg = require(`${cwd}/package.json`);
    
    if (!Settings.validatePkg(pkg)) {
      return;
    }

    const settings = pkg.contributes.configuration?.properties;
    const settingNames = Settings.sorting(settings);    

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

  public static order() {
    const cwd = process.cwd();
    const pkg = require(`${cwd}/package.json`);
    
    if (!Settings.validatePkg(pkg)) {
      return;
    }

    const settings = pkg.contributes.configuration?.properties;
    const settingNames = Settings.sorting(settings);

    const clonePkg = Object.assign({}, pkg);
    delete clonePkg.contributes.configuration.properties;
    clonePkg.contributes.configuration.properties = {};

    for (const name of settingNames) {
      clonePkg.contributes.configuration.properties[name] = settings[name];
    }

    writeFileSync(`${cwd}/package.json`, JSON.stringify(clonePkg, null, 2));
  }

  private static validatePkg(pkg: any) {
    if (!pkg || !pkg.contributes) {
      console.error('package.json is not found or it does not contain "contributes" section');
      return false;
    }
    return true;
  }

  private static sorting(settings: any) {
    return Object.keys(settings).sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }
}