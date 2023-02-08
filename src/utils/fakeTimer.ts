const sleep = async (time: number, result: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, time);
  });
};


const asyncSleep = async (time: number, fn: () => void): Promise<void> => {
  setTimeout(() => {
    Promise.resolve().then(() => {
      fn();
    });
  }, time);
};


export { sleep, asyncSleep };