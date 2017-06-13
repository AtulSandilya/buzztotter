import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";

import * as prompt from "./prompt";

type Path = string;
type Filename = string;

export interface BuzzDirs {
  android: Path;
  androidApp: Path;
  ios: Path;
  androidRelease: Path;
  iosRelease: Path;
  src: Path;
  androidDefaultBuildDir: Path;
}

export interface BuzzFilenames {
  publicApiKeys: Filename;
  productionPublicApiKeys: Filename;
  tempDevPublicApiKeys: Filename;
  androidDevRelease: Filename;
  androidProductionRelease: Filename;
  androidDefaultBuildApk: Filename;
  androidGoogleServices: Filename;
  androidGoogleServicesProduction: Filename;
  androidGoogleServicesTempDev: Filename;
}

class BuzzPath {
  public rootDir: Path;
  public version: string;
  /* tslint:disable:object-literal-sort-keys */
  public dir: BuzzDirs;
  public releaseDir = "ReleaseBuilds";

  public filename: BuzzFilenames;

  constructor(version: string) {
    const gitRootCmd = child_process.spawnSync("git", ["rev-parse", "--show-toplevel"]);
    const gitRootDir = gitRootCmd.stdout.toString().trim();
    this.rootDir = path.join(gitRootDir);

    this.version = version;

    this.dir = this.buildDir();
  }

  public async setup() {
    this.filename = await this.buildFilename();
  }

  public buildReleaseName = (platform: "ios" | "android", releaseType: "dev" | "production") => {
    const appName = "BuzzOtter";
    const versionForFilename = this.version.replace(/\./g, "-");
    const filetype = platform === "android" ? "apk" : "ipa";

    return `${appName}-${versionForFilename}-${releaseType}.${filetype}`;
  }

  private checkPath(...paths: string[]) {
    const buzzPath = path.join.apply(null, [this.rootDir].concat(paths));
    if (fs.lstatSync(buzzPath).isDirectory()) {
      return buzzPath;
    } else {
      throw new Error(`Directory '${buzzPath}' does not exist!`);
    }
  }

  private buildDir(): BuzzDirs {
    return {
      android: this.checkPath("android"),
      androidApp: this.checkPath("android", "app"),
      ios: this.checkPath("ios"),
      androidRelease: this.checkPath(this.releaseDir, "android"),
      iosRelease: this.checkPath(this.releaseDir, "ios"),
      androidDefaultBuildDir: this.checkPath("android", "app", "build", "outputs", "apk"),
      src: this.checkPath("src"),
    };
  }

  private async checkFName(
    inputDir: Path,
    filename: string,
    throwIfExists = true,
    promptIfExists = false,
  ): Promise<Filename> {
    const buzzFilename = path.join(inputDir, filename);
    let promptCompleted = false;
    const fileExistsMessage = `File '${buzzFilename}' already exists!`;
    const throwFileExists = async (showPrompt: boolean) => {
      if (promptCompleted) { return; }

      if (showPrompt && !(await prompt.confirm(`${fileExistsMessage} Continue anyway`))) {
        throw new Error(fileExistsMessage);
      } else {
        promptCompleted = true;
      }
    };

    if (throwIfExists) {
      let isFile = false;
      try {
        isFile = fs.lstatSync(buzzFilename).isFile();
      } catch (e) {
        // Continue
      }

      if (isFile) { await throwFileExists(promptIfExists); }
    }

    return buzzFilename;
  }

  private async buildFilename(): Promise<BuzzFilenames> {
    return {
      publicApiKeys: await this.checkFName(this.dir.src, "publicApiKeys.ts"),
      tempDevPublicApiKeys: await this.checkFName(this.dir.src, "publicApiKeys-dev.ts", false),
      productionPublicApiKeys: await this.checkFName(this.dir.src, "publicApiKeys-production.ts"),
      androidProductionRelease: await this.checkFName(this.dir.androidRelease,
                                                      this.buildReleaseName("android", "production"), true, true),
      androidDevRelease: await this.checkFName(this.dir.androidRelease,
                                               this.buildReleaseName("android", "dev"), true, true),
      androidDefaultBuildApk: await this.checkFName(this.dir.androidDefaultBuildDir, "app-release.apk", false),
      androidGoogleServices: await this.checkFName(this.dir.androidApp, "google-services.json"),
      androidGoogleServicesProduction: await this.checkFName(this.dir.androidApp, "google-services-production.json"),
      androidGoogleServicesTempDev: await this.checkFName(this.dir.androidApp, "google-services-dev.json", false),
    };
  }
}

export default BuzzPath;
