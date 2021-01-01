/*
 * @Author: shen
 * @Date: 2020-12-28 00:45:44
 * @LastEditors: shen
 * @LastEditTime: 2021-01-01 15:58:18
 * @Description:
 */
import { RequestConfig, RequestStatic } from './types';
import Request from './core/Request';
import mergeConfig from './core/mergeConfig';
import defaults from './defaults';
import { extend } from './helpers/util';
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createInstance(defaultConfig: RequestConfig): RequestStatic {
  const context = new Request(defaultConfig);
  const instance = Request.prototype.request.bind(context);

  extend(instance, Request.prototype, context);
  extend(instance, context);

  return (instance as unknown) as RequestStatic;
}

const request = createInstance(defaults);

request.create = (config: RequestConfig) => createInstance(mergeConfig(defaults, config));

request.Request = Request;

request.CancelToken = CancelToken
request.Cancel = Cancel
request.isCancel = isCancel

request.all = function all(promises) {
  return Promise.all(promises);
};

request.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

export default request;
