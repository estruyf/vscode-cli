import { writeFileSync } from "fs";
import { Packager } from "../helpers/Packager";

export class Settings {
  
  public static export(heading: number = 2) {
    const pkg = Packager.fetch();

    if (!Packager.validate(pkg)) {
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
    const pkg = Packager.fetch();

    if (!Packager.validate(pkg)) {
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

    writeFileSync(Packager.location(), JSON.stringify(clonePkg, null, 2));
  }

  public static add(name: string, type?: string | null, description?: string | null) {
    const pkg = Packager.fetch();

    if (!Packager.validate(pkg)) {
      return;
    }

    const settings = pkg.contributes.configuration?.properties;
    if (settings[name]) {
      throw new Error(`Setting "${name}" already exists`);
    }

    const newSetting = {
      type: type || 'string',
      markdownDescription: description || ""
    };

    settings[name] = newSetting;

    writeFileSync(Packager.location(), JSON.stringify(pkg, null, 2));
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