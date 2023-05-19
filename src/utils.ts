import md5 from "js-md5";

export const secret: string = "2WTtIhe6BGnl97HD_tPM";
export const appid: string = "20230315001601253";
export const salt: string = "213jliajfiljsdfl";

export class LimitPromise {
  max: number = 5;
  taskQueue: Array<Function> = [];
  penddingCount: number = 0;
  constructor(max: number) {
    this.max = max ?? 5;
  }

  _call(caller: Function, ...args: any) {
    return new Promise((resolve, reject) => {
      const task = this._createTask(caller, args, resolve, reject);
      if (this.penddingCount >= this.max) {
        this.taskQueue.push(task);
      } else {
        task();
      }
    });
  }

  _createTask(
    caller: Function,
    args: Array<any>,
    resolve: Function,
    reject: Function
  ) {
    return () => {
      caller(...args)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        })
        .finally(() => {
          this.penddingCount--;
          if (this.taskQueue.length > 0) {
            this.taskQueue.shift()!();
          }
        });
      this.penddingCount++;
    };
  }
}

interface InoRepeatOptions {
  key: string;
}
export const noRepeat = (data: Array<any>, options?: InoRepeatOptions) => {
  if (options?.key) {
    return data.reduce((prev, cur) => {
      const r = prev.some((i: any) => {
        return i[options.key] === cur[options.key];
      });
      if (!r) {
        prev.push(cur);
      }
      return prev;
    }, []);
  } else {
    return [...new Set(data)].filter((i) => {
      return isNotEmpty(i);
    });
  }
};

export const isNotEmpty = (str: any) => {
  return ![null, undefined, ""].includes(str);
};

export const generateSign = (q: string): string => {
  return md5(appid + q + salt + secret);
};
