import fs from "fs";
import path from "path";

export const parseFileData = (data: string) => {
  let r = null;
  eval(`r = ${data.replace(/export default/g, "")}`);
  return r;
};

export const getFile = (filePath: string) => {
  return fs.readFileSync(filePath, "utf8");
};

export const createDir = (filePath: string) => {
  fs.mkdirSync(filePath);
};

export const createFile = (filePath: string, data: string) => {
  fs.writeFileSync(filePath, data);
};

export const create = (filePath: string, data?: string) => {
  if (isFile(filePath)) {
    if (data) {
      createFile(filePath, data);
    }
  } else {
    createDir(filePath);
  }
};

export const isFile = (filePath: string) => {
  return filePath.includes(".");
};

export const hasFile = (filePath: string) => {
  return fs.existsSync(filePath);
};

export const removeFile = (filePath: string) => {
  return fs.rmSync(filePath, { recursive: true });
};

export const removeDir = (filePath: string) => {
  return fs.rmSync(filePath, { recursive: true });
};

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
