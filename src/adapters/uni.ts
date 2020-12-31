/*
 * @Author: shen
 * @Date: 2020-12-29 08:38:49
 * @LastEditors: shen
 * @LastEditTime: 2020-12-31 16:23:23
 * @Description:
 */

import { RequestPromise, RequestConfig, ResponseResult } from '../types';
import buildFullPath from '../core/buildFullPath';
import buildURL from '../helpers/buildURL';
import { createError } from '../core/createError';

const uniRequestFileds: string[] = ['url', 'method', 'header', 'data', 'dataType', 'timeout', 'withCredentials', 'responseType', 'sslVerify', 'firstIpv4'];

interface Options {
  [key: string]: any;
}

export default function uniAdapter(config: RequestConfig): RequestPromise {
  return new Promise((resolve, reject) => {
    const fullPath = buildFullPath(config.baseURL, config.url!);
    const options: Options = {};
    uniRequestFileds.forEach((key) => {
      options[key] = config[key];
    });
    options.url = buildURL(fullPath, config.params);
    const requestTask = uni.request({
      ...options,
      success(result: any) {
        const response: ResponseResult = {
          data: result.data,
          status: result.statusCode as number,
          statusText: result.errMsg,
          header: result.header,
          config,
          request: requestTask,
        };
        resolve(response);
      },
      fail(error: any) {
        reject(createError(`Request failed with status code ${error.statusCode}`, config, null, requestTask, error));
      },
    });
  });
}
