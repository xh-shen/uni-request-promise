/*
 * @Author: shen
 * @Date: 2020-12-28 16:36:04
 * @LastEditors: shen
 * @LastEditTime: 2020-12-29 13:28:05
 * @Description:
 */

import { forEach } from './util';

export default function normalizeHeaderName(header: any, normalizedName: string) {
  forEach(header, function processHeader(value: any, name: string) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      header[normalizedName] = value;
      delete header[name];
    }
  });
}
