/*
 * @Author: shen
 * @Date: 2020-12-28 00:45:59
 * @LastEditors: shen
 * @LastEditTime: 2021-01-01 15:42:53
 * @Description:
 */
import { RequestConfig } from './types';
import uniAdapter from './adapters/uni';
import { isUndefined, isObject, forEach, merge } from './helpers/util';
import normalizeHeaderName from './helpers/normalizeHeaderName';

const DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/json',
};

function setContentTypeIfUnset(header: any, value: any) {
  if (!isUndefined(header) && isUndefined(header['Content-Type'])) {
    header['Content-Type'] = value;
  }
}

const defaults: RequestConfig = {
  adapter: uniAdapter,
  transformRequest: [
    function transformRequest(data: any, header: any) {
      normalizeHeaderName(header, 'Accept');
      normalizeHeaderName(header, 'Content-Type');

      if (isObject(data)) {
        setContentTypeIfUnset(header, 'application/json;charset=utf-8');
      }
      return data;
    },
  ],
  transformResponse: [function transformResponse(data) {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],
  dataType: 'json',
  responseType: 'text',
  timeout: 60000,
  sslVerify: false,
  firstIpv4: false,
};

defaults.header = {
  common: {
    Accept: 'application/json, text/plain, */*',
  },
};

forEach(['delete', 'get', 'head'], function forEachMethodNoData(method: string) {
  defaults.header[method] = {};
});

forEach(['post', 'put', 'patch'], function forEachMethodWithData(method: string) {
  defaults.header[method] = merge(DEFAULT_CONTENT_TYPE);
});

export default defaults;
