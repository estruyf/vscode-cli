

export class Packager {

  public static fetch() {
    return require(Packager.location());
  }

  public static location() {
    const cwd = process.cwd();
    return `${cwd}/package.json`;
  }

  public static validate(pkg: any) {
    if (!pkg || !pkg.contributes) {
      console.error('package.json is not found or it does not contain "contributes" section');
      return false;
    }
    return true;
  }
}