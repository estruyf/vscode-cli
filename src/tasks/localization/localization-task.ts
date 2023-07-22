import { BaseTask } from "../base-task";
import { join } from "path";
import { existsSync, writeFileSync, readFileSync } from "fs";

interface ILocalization {
  [prop: string]: string;
}

export class LocalizationTask extends BaseTask {
  public process() {
    const crntPath = process.cwd();
    const fileName = join(crntPath, "package.nls.json");

    let localization: ILocalization = {};
    if (existsSync(fileName)) {
      const fileContent = readFileSync(fileName, "utf-8");
      localization = JSON.parse(fileContent);
    }

    const commands = this.package.contributes.commands;

    for (const command of commands) {
      const localeName = `command.${command.command}`;

      if (!command.title.startsWith(`%`) && !command.title.endsWith(`%`)) {
        localization[localeName] = command.title;
        command.title = `%${localeName}%`;
      }
    }

    const settings = this.package.contributes.configuration.properties;
    const settingsKeys = Object.keys(settings);
    this.processSettings(settings, settingsKeys, localization, `setting`);

    writeFileSync(fileName, JSON.stringify(localization, null, 2), "utf-8");

    const pkgFile = join(crntPath, "package.json");
    writeFileSync(pkgFile, JSON.stringify(this.package, null, 2), "utf-8");
  }

  private processSettings(
    mainObject: any,
    settingsKeys: string[],
    localization: ILocalization,
    prefix: string
  ) {
    for (const settingKey of settingsKeys) {
      const setting = mainObject[settingKey];

      const localeKey = `${prefix}.${settingKey}`;
      const description = `${localeKey}.description`;
      const markdownDescription = `${localeKey}.markdownDescription`;
      const deprecationMessage = `${localeKey}.deprecationMessage`;
      const markdownDeprecationMessage = `${localeKey}.markdownDeprecationMessage`;

      if (
        !localization[description] &&
        setting.description &&
        typeof setting.description === "string" &&
        !setting.description?.startsWith(`%`) &&
        !setting.description?.endsWith(`%`)
      ) {
        localization[description] = setting.description;
        setting.description = `%${description}%`;
      }

      if (
        !localization[markdownDescription] &&
        setting.markdownDescription &&
        typeof setting.markdownDescription === "string" &&
        !setting.markdownDescription?.startsWith(`%`) &&
        !setting.markdownDescription?.endsWith(`%`)
      ) {
        localization[markdownDescription] = setting.markdownDescription;
        setting.markdownDescription = `%${markdownDescription}%`;
      }

      if (
        !localization[deprecationMessage] &&
        setting.deprecationMessage &&
        typeof setting.deprecationMessage === "string" &&
        !setting.deprecationMessage?.startsWith(`%`) &&
        !setting.deprecationMessage?.endsWith(`%`)
      ) {
        localization[deprecationMessage] = setting.deprecationMessage;
        setting.deprecationMessage = `%${deprecationMessage}%`;
      }

      if (
        !localization[markdownDeprecationMessage] &&
        setting.markdownDeprecationMessage &&
        typeof setting.markdownDeprecationMessage === "string" &&
        !setting.markdownDeprecationMessage?.startsWith(`%`) &&
        !setting.markdownDeprecationMessage?.endsWith(`%`)
      ) {
        localization[markdownDeprecationMessage] =
          setting.markdownDeprecationMessage;
        setting.markdownDeprecationMessage = `%${markdownDeprecationMessage}%`;
      }

      if (setting.properties) {
        const settings = setting.properties;
        const settingsKeys = Object.keys(settings);
        this.processSettings(
          settings,
          settingsKeys,
          localization,
          `${localeKey}.properties`
        );
      }

      if (setting.items && setting.items.description) {
        const itemDescription = `${localeKey}.items.description`;
        localization[itemDescription] = setting.items.description;
        setting.items.description = `%${itemDescription}%`;
      }

      if (setting.items && setting.items.properties) {
        const settings = setting.items.properties;
        const settingsKeys = Object.keys(settings);
        this.processSettings(
          settings,
          settingsKeys,
          localization,
          `${localeKey}.items.properties`
        );
      }
    }
  }
}
