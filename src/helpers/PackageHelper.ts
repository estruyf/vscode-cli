

export class PackageHelper {

  public static fetch() {
    return require(PackageHelper.location());
  }

  public static location() {
    const cwd = process.cwd();
    return `${cwd}/package.json`;
  }

  public static validate(pkg: any) {
    if (!pkg || !pkg.contributes) {
      return false;
    }
    
    return true;
  }
}