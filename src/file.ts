import fs from "fs";
import path from "path";

/**
 * @function parseFileData
 * @description 解析文件内容字符串，返回esmodule导出的对象
 * @param data { boolean } 文件字符串
 */
export const parseFileData = (data: string) => {
  let r = null;
  eval(`r = ${data.replace(/export default/g, "")}`);
  return r;
};

/**
 * @function getFile
 * @description 解析文件内容字符串
 * @param path { string } 路径
 */
export const getFile = (filePath: string) => {
  return fs.readFileSync(filePath, "utf8");
};

/**
 * @function createDir
 * @description 创建目录
 * @param filePath { string } 路径
 */
export const createDir = (filePath: string) => {
  fs.mkdirSync(filePath);
};

/**
 * @function createFile
 * @description 创建文件
 * @param filePath { string } 路径
 * @param data { string } 数据
 */
export const createFile = (filePath: string, data: string) => {
  fs.writeFileSync(filePath, data);
};

/**
 * @function create
 * @description 创建目录或文件
 * @param filePath { string } 路径
 */
export const create = (filePath: string, data?: string) => {
  if (isFile(filePath)) {
    if (data) {
      createFile(filePath, data);
    }
  } else {
    createDir(filePath);
  }
};

/**
 * @function isDir
 * @description 判断为文件还是文件夹
 * @param filePath { string } 路径
 */
export const isFile = (filePath: string) => {
  return filePath.includes(".");
};

/**
 * @function hasFile
 * @description 判断目标路径的文件是否存在
 * @param filePath { string } 路径
 */
export const hasFile = (filePath: string) => {
  return fs.existsSync(filePath);
};

/**
 * @function removeFile
 * @description 移除文件
 * @param filePath { string } 路径
 */
export const removeFile = (filePath: string) => {
  return fs.rmSync(filePath, { recursive: true });
};

/**
 * @function removeDir
 * @description 移除文件夹
 * @param filePath { string } 路径
 */
export const removeDir = (filePath: string) => {
  return fs.rmSync(filePath, { recursive: true });
};

/**
 * @function remove
 * @description 移除文件夹或路径
 * @param filePath { string } 路径
 */
export const remove = (filePath: string) => {
  if (isFile(filePath)) {
    removeFile(filePath);
  } else {
    removeDir(filePath);
  }
};

export interface FilesTreeItem {
  path: string[];
  isDirectory: boolean;
  children: FilesTreeItem[];
  data: any;
  translatedData?: any;
}

/**
 * @function getFilesTree
 * @description 根据entry获取路径树
 * @param entry { string } 语言文件路径
 * @param deep { boolean } 是否深度查找
 */
export const getFilesTree = (entry: string, deep?: boolean): FilesTreeItem => {
  const result = {
    path: ["en"],
    isDirectory: true,
    children: [],
    data: {},
  };
  const readDir = (entry: string, item: FilesTreeItem) => {
    const dirs = fs.readdirSync(entry);
    for (const dir of dirs) {
      const location = path.join(entry, dir);
      const info = fs.statSync(location);
      const pushItem = {
        path: [...item.path, dir],
        isDirectory: info.isDirectory(),
        children: [],
        data: info.isDirectory() ? "" : parseFileData(getFile(location)),
      };
      item.children?.push(pushItem);
      if (pushItem.isDirectory) {
        deep && readDir(location, pushItem);
      }
    }
  };
  readDir(entry, result);
  return result;
};
