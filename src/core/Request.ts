/*
 * @Author: shen
 * @Date: 2020-12-28 14:11:37
 * @LastEditors: shen
 * @LastEditTime: 2020-12-29 11:09:36
 * @Description:
 */

import { RequestConfig, RequestPromise, ResponseResult, ResolvedFn, RejectedFn } from '../types';

import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import buildURL from '../helpers/buildURL';

interface Interceptors {
  request: InterceptorManager<RequestConfig>;
  response: InterceptorManager<ResponseResult>;
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: RequestConfig) => RequestPromise);
  rejected?: RejectedFn;
}

export default class Request {
  defaults: RequestConfig;
  interceptors: Interceptors;

  constructor(initConfig: RequestConfig) {
    this.defaults = initConfig;
    this.interceptors = {
      request: new InterceptorManager<RequestConfig>(),
      response: new InterceptorManager<ResponseResult>(),
    };
  }

  request(config?: any): RequestPromise {
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig(this.defaults, config);

    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined,
      },
    ];

    let promise = Promise.resolve(config);

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor);
    });

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }

    return promise;
  }

  getUri(config: RequestConfig): string {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url!, config.params).replace(/^\?/, '');
  }

  // forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  //   /*eslint func-names:0*/
  //   Axios.prototype[method] = function(url, config) {
  //     return this.request(mergeConfig(config || {}, {
  //       method: method,
  //       url: url,
  //       data: (config || {}).data
  //     }));
  //   };
  // });
}
