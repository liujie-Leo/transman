import { getFile, getFilesTree, FilesTreeItem } from "./file.js";
import { translate } from "./translate.js";

export interface config {
  source: string;
  outDir: string;
  languageFrom: string;
  languageTo: string;
  data: FilesTreeItem;
}
/**
 * @function createTranslate
 * @description 翻译
 * @param config { object }
 * @param config.source { string }
 * @param config.outDir { string }
 * @param config.languageFrom { string }
 * @param config.languageTo { string }
 */
const createTranslate = (config: config) => {
  translate(getFilesTree(config.source,true), config);
};
export default createTranslate;
