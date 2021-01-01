/*
 * @Author: shen
 * @Date: 2021-01-01 15:55:11
 * @LastEditors: shen
 * @LastEditTime: 2021-01-01 15:55:21
 * @Description:
 */

export default class Cancel {
  message?: string

  constructor(message?: string) {
    this.message = message
  }
}

export function isCancel(value: any): boolean {
  return value instanceof Cancel
}
