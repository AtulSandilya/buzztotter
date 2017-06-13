import * as fs from "fs-extra";

import {BuzzDirs, BuzzFilenames} from "./BuzzPath";

import runCommandAsync from "./runCommandAsync";

type Platform = "ios" | "android";
type BuildType = "dev" | "production";

class BuzzBuilder {
  private buzzDir: BuzzDirs;
  private buzzFilenames: BuzzFilenames;

  constructor(buzzDir: BuzzDirs, buzzFilenames: BuzzFilenames) {
    this.buzzDir = buzzDir;
    this.buzzFilenames = buzzFilenames;
  }

  public async buildAndroidDev() {
    await this.buildAndroid("dev");
  }

  public async buildAndroidProduction() {
    await this.prepareForProductionBuild("android");
    await this.buildAndroid("production");
    await this.cleanupAfterProductionBuild("android");
  }

  private async buildAndroid(buildType: BuildType) {
    await runCommandAsync(`./gradlew assembleRelease -Pbuild_key_type=${buildType}`, this.buzzDir.android);

    let filename;
    switch (buildType) {
      case "dev":
        filename = this.buzzFilenames.androidDevRelease;
        break;
      case "production":
        filename = this.buzzFilenames.androidProductionRelease;
        break;
    }
    fs.renameSync(this.buzzFilenames.androidDefaultBuildApk, filename);
  }

  private swapFiles(targetFileName, fileToRename, tempFilename) {
    fs.renameSync(targetFileName, tempFilename);
    fs.renameSync(fileToRename, targetFileName);
  }

  private async prepareForProductionBuild(platform: Platform) {
    this.swapFiles(
      this.buzzFilenames.publicApiKeys,
      this.buzzFilenames.productionPublicApiKeys,
      this.buzzFilenames.tempDevPublicApiKeys,
    );
    // Compile the new key files into js
    await runCommandAsync("gulp incremental-tsc");

    switch (platform) {
      case "android":
        // rename android/app/googleservices
        this.swapFiles(
          this.buzzFilenames.androidGoogleServices,
          this.buzzFilenames.androidGoogleServicesProduction,
          this.buzzFilenames.androidGoogleServicesTempDev,
        );
        // update facebook id in Android manifist
        // Handled in app/build.gradle
        break;
      case "ios":
        // Update facebook id in info.plist
        break;
    }
  }

  private async cleanupAfterProductionBuild(platform: Platform) {
    this.swapFiles(
      this.buzzFilenames.publicApiKeys,
      this.buzzFilenames.tempDevPublicApiKeys,
      this.buzzFilenames.productionPublicApiKeys,
    );
    // Compile the new key files into js
    await runCommandAsync("gulp incremental-tsc");

    switch (platform) {
      case "android":
        this.swapFiles(
          this.buzzFilenames.androidGoogleServices,
          this.buzzFilenames.androidGoogleServicesTempDev,
          this.buzzFilenames.androidGoogleServicesProduction,
        );
        break;
      case "ios":
        break;
    }
  }
}

export default BuzzBuilder;
