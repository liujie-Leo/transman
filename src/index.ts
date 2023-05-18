import { getFilesTree, FilesTreeItem, hasFile } from "./file.js";
import { translate } from "./translate.js";
import findup from "findup-sync";
import chalk from "chalk";

export interface config {
  source: string;
  outDir: string;
  languageFrom: string;
  languageTo: string;
  data: FilesTreeItem;
}

// 校验config
const validateConfig = (config: config) => {
  if (!config.source) {
    console.log(
      chalk.white.bgRed(" Error: ") +
        chalk.white(
          " The [ source ] configuration is not obtained. Please check in vite.config.js for translation."
        )
    );
    return false;
  } else if (!hasFile(config.source)) {
    console.log(
      chalk.white.bgRed(" Error: ") +
        chalk.white(" The file corresponding to the source path is not found.")
    );
    return false;
  }
  if (!config.outDir) {
    console.log(
      chalk.white.bgRed(" Error: ") +
        chalk.white(
          " The [ outDir ] configuration is not obtained. Please check in vite.config.js for translation."
        )
    );
    return false;
  }
  if (!config.languageFrom) {
    console.log(
      chalk.white.bgRed(" Error: ") +
        chalk.white(
          " The [ languageFrom ] configuration is not obtained. Please check in vite.config.js for translation."
        )
    );
    return false;
  }
  if (!config.languageTo) {
    console.log(
      chalk.white.bgRed(" Error: ") +
        chalk.white(
          " The [ languageTo ] configuration is not obtained. Please check in vite.config.js for translation."
        )
    );
    return false;
  }
  return config;
};

// 从vite.config.js中获取配置
const getConfigFromVite = async () => {
  const viteConfigPath = findup("vite.config.js") || "";
  if (viteConfigPath) {
    const config = await import(viteConfigPath).catch(() => {});
    if (config) {
      if (config.default.translation) {
        return validateConfig(config.default.translation);
      } else {
        console.log(
          chalk.white.bgRed(" Error: ") +
            chalk.white(
              " The [ translation ] configuration item is not obtained in vite.config.js. Please check."
            )
        );
      }
    }
  } else {
    console.log(
      chalk.white.bgRed(" Error: ") +
        chalk.white(
          " Failed to obtain the configuration file vite.config.js. Please check."
        )
    );
  }
  return false;
};

/**
 * @function createTranslate
 * @description 翻译
 * @param config { object }
 * @param config.source { string }
 * @param config.outDir { string }
 * @param config.languageFrom { string }
 * @param config.languageTo { string }
 */
const createTranslate = async () => {
  const config: config | boolean = await getConfigFromVite();
  if (config) {
    translate(getFilesTree(config.source, true), config);
  }
};

export default createTranslate;
