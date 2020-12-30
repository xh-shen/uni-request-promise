/*
 * @Author: shen
 * @Date: 2020-12-29 08:46:59
 * @LastEditors: shen
 * @LastEditTime: 2020-12-29 13:28:17
 * @Description:
 */
import { Transformer } from '../types';
import { forEach } from '../helpers/util';

export default function transformData(data: any, header: any, fns?: Transformer | Transformer[]) {
  if (!fns) {
    return data;
  }
  if (!Array.isArray(fns)) {
    fns = [fns];
  }
  forEach(fns, function transform(fn: Transformer) {
    data = fn(data, header);
  });

  return data;
}
