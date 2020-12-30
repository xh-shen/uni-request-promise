/*
 * @Author: shen
 * @Date: 2020-12-28 14:09:59
 * @LastEditors: shen
 * @LastEditTime: 2020-12-29 11:08:38
 * @Description:
 */

import { RequestPromise, RequestConfig, RequestAdapter } from '../types';
import transformData from './transformData';
import defaults from '../defaults';
import { merge, forEach } from '../helpers/util';

export default function dispatchRequest(config: RequestConfig): RequestPromise {
  console.log(config);

  config.header = config.header || {};

  // Transform request data
  config.data = transformData(config.data, config.header, config.transformRequest);
  console.log('1111', config.method);
  // Flatten header
  config.header = merge(config.header.common || {}, config.header[config.method!] || {}, config.header);

  forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method: string) {
    delete config.header[method];
  });

  const adapter = (config.adapter || defaults.adapter) as RequestAdapter;

  return adapter(config).then(
    function onAdapterResolution(response) {
      // throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData(response.data, response.header, config.transformResponse);

      return response;
    },
    function onAdapterRejection(reason) {
      // if (!isCancel(reason)) {
      // throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(reason.response.data, reason.response.header, config.transformResponse);
      }
      // }

      return Promise.reject(reason);
    }
  );
}
