import { FilesTreeItem, hasFile, remove, create } from "./file.js";
import { config } from "./index.js";
import { LimitPromise, generateSign, appid, salt } from "./utils.js";
import axios from "axios";
import path from "path";
import ora from "ora";
import chalk from "chalk";

interface IFlattenItem {
  key: string;
  value: string;
}
interface IApiResDataItem {
  src: string;
  dst: string;
}
interface IApiResData {
  from: string;
  to: string;
  trans_result: Array<IApiResDataItem>;
}

export const flatten = (
  item: FilesTreeItem,
  flattenData: IFlattenItem[],
  config: config
) => {
  if (item.children.length > 0) {
    for (const subItem of item.children) {
      flatten(subItem, flattenData, config);
    }
  } else {
    for (const key in item.data) {
      if (!config.customTranslation[key]) {
        flattenData.push({
          key,
          value: item.data[key],
        });
      }
    }
  }
};

export const transApi = (data: IFlattenItem[]) => {
  const spinner = ora({
    text: "translating...",
    color: "green",
    spinner: "simpleDotsScrolling",
  });
  spinner.start();
  return new Promise((resolve, reject) => {
    const limitPromise = new LimitPromise(2);
    const promises = [];
    for (const item of data) {
      const value: string = item.value;
      const query: string = `?q=${value}&from=zh&to=en&&appid=${appid}&salt=${salt}&sign=${generateSign(
        value
      )}`;
      promises.push(
        limitPromise._call(() => {
          return axios.get(
            "https://fanyi-api.baidu.com/api/trans/vip/translate" + query
          );
        })
      );
    }
    Promise.all(promises).then((res) => {
      const dataList: Array<IApiResData> = res.map((i: any): IApiResData => {
        return i.data;
      });
      const returnMap: any = {};
      for (const item of dataList) {
        const keyRes = data.find((i) => {
          return i.value === item.trans_result[0].src;
        });
        if (keyRes) {
          returnMap[keyRes.key] = item.trans_result[0].dst;
        }
      }
      spinner.stop();
      resolve(returnMap);
    });
  });
};

export const mergeTranslate = (
  data: FilesTreeItem,
  translatedData: any,
  config: config
) => {
  if (data.children?.length > 0) {
    for (const item of data.children) {
      mergeTranslate(item, translatedData, config);
    }
  } else {
    data.translatedData = {};
    for (const key of Object.keys(data.data)) {
      data.translatedData[key] =
        config.customTranslation[key] ?? translatedData[key];
    }
  }
};

export const generateFile = (data: FilesTreeItem, config: config) => {
  const itemPath = path.join(config.outDir, ...data.path);

  // 目录 / dir
  if (data.isDirectory) {
    if (hasFile(itemPath)) {
      // 先移除 / first remove
      remove(itemPath);
    }
    create(itemPath);
    if (data.children.length > 0) {
      for (const item of data.children) {
        generateFile(item, config);
      }
    }
  } else {
    // 文件 / file
    create(itemPath, `export default ${JSON.stringify(data.translatedData)}`);
  }
};

/**
 * @function translate
 * @param data { object }
 * @param config { object }
 */
export const translate = async (
  data: FilesTreeItem,
  config: config
): Promise<void> => {
  // 扁平化数据 / flatten data for translate.
  const flattenData: IFlattenItem[] = [];
  flatten(data, flattenData, config);

  // 扁平化后的数据调用翻译api翻译 / after flattening data call api to translation.
  const translatedData: any = await transApi(flattenData);

  // 数据全部翻译完成后，将数据整合至data中 / translated data merge origin data after translation finished.
  mergeTranslate(data, translatedData, config);

  // 根据data生成翻译后的文件 / generate file by data.
  generateFile(data, config);

  console.log(chalk.white.bgGreen(" DONE ") + ` translation finished.`);
};
