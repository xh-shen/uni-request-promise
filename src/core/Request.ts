/*
 * @Author: shen
 * @Date: 2020-12-28 14:11:37
 * @LastEditors: shen
 * @LastEditTime: 2021-01-01 15:16:27
 * @Description:
 */

import { RequestConfig, RequestPromise, ResponseResult, ResolvedFn, RejectedFn, Method } from '../types';

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
    console.log(chain);
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

  get(url: string, config?: RequestConfig): RequestPromise {
    return this._requestMethodWithoutData('get', url, config);
  }

  delete(url: string, config?: RequestConfig): RequestPromise {
    return this._requestMethodWithoutData('delete', url, config);
  }

  head(url: string, config?: RequestConfig): RequestPromise {
    return this._requestMethodWithoutData('head', url, config);
  }

  options(url: string, config?: RequestConfig): RequestPromise {
    return this._requestMethodWithoutData('options', url, config);
  }

  post(url: string, data?: any, config?: RequestConfig): RequestPromise {
    return this._requestMethodWithData('post', url, data, config);
  }

  put(url: string, data?: any, config?: RequestConfig): RequestPromise {
    return this._requestMethodWithData('post', url, data, config);
  }

  patch(url: string, data?: any, config?: RequestConfig): RequestPromise {
    return this._requestMethodWithData('post', url, data, config);
  }

  _requestMethodWithoutData(method: Method, url: string, config?: RequestConfig): RequestPromise {
    return this.request(mergeConfig(config || {}, { method, url, data: (config || {}).data }));
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: RequestConfig): RequestPromise {
    return this.request(mergeConfig(config || {}, { method, url, data }));
  }
}
