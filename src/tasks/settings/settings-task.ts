import { BaseTask } from "../base-task";


export class SettingsTask extends BaseTask {

  /**
   * Export all settings for documentation
   * @param heading 
   */
   public async export(heading: number) {
    const settings = this.get();
    const settingNames = this.nameSort(settings);   

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

  /**
   * Sort all the settings
   * @returns 
   */
  public order() {
    const settings = this.get();
    const settingNames = this.nameSort(settings);   

    const clonePkg = Object.assign({}, this.package);
    delete clonePkg.contributes.configuration.properties;
    clonePkg.contributes.configuration.properties = {};

    for (const name of settingNames) {
      clonePkg.contributes.configuration.properties[name] = settings[name];
    }
    this.update(clonePkg);
  }

  /**
   * Add a new setting
   * @param name 
   * @param type 
   * @param description 
   */
  public add(name: string, type?: string | string[] | null, description?: string | null) {
    const settings = this.get();

    if (settings[name]) {
      throw new Error(`Setting "${name}" already exists`);
    }

    const newSetting: any = {
      markdownDescription: description || ""
    };

    if (type) {
      if (type.length > 1) {
        newSetting["type"] = type;
      } else {
        newSetting["type"] = type[0];
      }
    } else {
      newSetting["type"] = 'string';
    }

    settings[name] = newSetting;

    this.update(this.package);
  }

  /**
   * Retrieve all settings
   * @returns 
   */
  public get() {
    return this.package?.contributes.configuration?.properties;
  }
}