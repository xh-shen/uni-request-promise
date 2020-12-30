/*
 * @Author: shen
 * @Date: 2020-12-28 14:52:17
 * @LastEditors: shen
 * @LastEditTime: 2020-12-30 13:52:15
 * @Description:
 */
const toString = Object.prototype.toString;

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]';
}

export function isObject(val: any) {
  return val !== null && typeof val === 'object';
}

export function isPlainObject(val: any) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }
  const prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData;
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams;
}

export function isUndefined(val: any) {
  return typeof val === 'undefined';
}

export function forEach(obj: any, fn: any) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (Array.isArray(obj)) {
    // Iterate over array values
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

export function merge(...argvs: any[]) {
  const result: any = {};
  function assignValue(val: any, key: string) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (Array.isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (let i = 0, l = argvs.length; i < l; i++) {
    forEach(argvs[i], assignValue);
  }
  return result;
}

export function extend(a: any, b: any, thisArg?: any) {
  forEach(b, function assignValue(val: any, key: string) {
    if (thisArg && typeof val === 'function') {
      a[key] = val.bind(thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
