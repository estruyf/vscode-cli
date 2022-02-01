import { PackageHelper } from "../helpers/PackageHelper";
import { writeFileSync } from "fs";

export abstract class BaseTask {
  public package: any = null;

  constructor() {
    this.package = PackageHelper.fetch();
    if (!this.package || !PackageHelper.validate(this.package)) {
      throw new Error('package.json is not found or it does not contain "contributes" section');
    }
  }

  protected update(pkg: any) {
    writeFileSync(PackageHelper.location(), JSON.stringify(pkg, null, 2));
  }

  protected alphabetically = (property: string) => {
    return (a: any, b: any) => {
      if (a[property].toLowerCase() < b[property].toLowerCase()) {
        return -1;
      }
      if (a[property].toLowerCase() > b[property].toLowerCase()) {
        return 1;
      }
      return 0;
    };
  };

  protected nameSort = (obj: any) => {
    return Object.keys(obj).sort((a, b) => {
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