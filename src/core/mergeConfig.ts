/*
 * @Author: shen
 * @Date: 2020-12-28 14:51:39
 * @LastEditors: shen
 * @LastEditTime: 2020-12-30 13:28:32
 * @Description:
 */

import { RequestConfig } from '../types';
import { isPlainObject, merge, isUndefined, forEach } from '../helpers/util';

type RequestConfigKeys = keyof RequestConfig;

export default function mergeConfig(config1: RequestConfig, config2: RequestConfig = {}): RequestConfig {
  const config: RequestConfig = {};

  const valueFromConfig2Keys = ['url', 'method', 'data'];
  const mergeDeepPropertiesKeys = ['header', 'params'];

  const defaultToConfig2Keys = ['baseURL', 'transformRequest', 'transformResponse', 'timeout', 'withCredentials', 'responseType'];

  function getMergedValue(target: any, source: any) {
    if (isPlainObject(target) && isPlainObject(source)) {
      return merge(target, source);
    } else if (isPlainObject(source)) {
      return merge({}, source);
    } else if (Array.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop: RequestConfigKeys) {
    if (!isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  forEach(valueFromConfig2Keys, function valueFromConfig2(prop: RequestConfigKeys) {
    if (!isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  forEach(defaultToConfig2Keys, function defaultToConfig2(prop: RequestConfigKeys) {
    if (!isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  const requestKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys);

  const otherKeys = Object.keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return requestKeys.indexOf(key) === -1;
    });

  forEach(otherKeys, mergeDeepProperties);

  return config;
}
