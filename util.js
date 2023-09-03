/**
 * 让异步函数吐出[err,data]
 * @param promise 异步请求
 * @returns [err,data]
 */
 const to =(
  promise,
) => {
  if (!promise) {
    return Promise.reject(new Error('requires promises as the param')).catch(
      (err) => [err, null],
    );
  }
  return promise
    .then((...args) => [null, ...args])
    .catch((err) => [err, null]);
};


export default to