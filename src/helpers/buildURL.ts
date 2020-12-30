/*
 * @Author: shen
 * @Date: 2020-12-28 15:51:55
 * @LastEditors: shen
 * @LastEditTime: 2020-12-30 13:30:00
 * @Description:
 */

import { forEach, isDate, isObject } from './util';

function encode(val: string) {
  return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

export default function buildURL(url: string, params: any) {
  if (!params) {
    return url;
  }

  const parts: string[] = [];

  forEach(params, function serialize(val: any, key: string) {
    if (val === null || typeof val === 'undefined') {
      return;
    }

    if (Array.isArray(val)) {
      key = key + '[]';
    } else {
      val = [val];
    }

    forEach(val, function parseValue(v: any) {
      if (isDate(v)) {
        v = v.toISOString();
      } else if (isObject(v)) {
        v = JSON.stringify(v);
      }
      parts.push(encode(key) + '=' + encode(v));
    });
  });

  const serializedParams = parts.join('&');

  if (serializedParams) {
    const hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}
