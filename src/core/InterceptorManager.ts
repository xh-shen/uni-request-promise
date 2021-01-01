/*
 * @Author: shen
 * @Date: 2020-12-29 09:23:43
 * @LastEditors: shen
 * @LastEditTime: 2021-01-01 15:11:15
 * @Description:
 */

import { ResolvedFn, RejectedFn } from '../types';

interface Handler<T> {
  resolved: ResolvedFn<T>;
  rejected?: RejectedFn;
}

export default class InterceptorManager<T> {
  private handlers: (Handler<T> | null)[];

  constructor() {
    this.handlers = [];
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.handlers.push({
      resolved,
      rejected,
    });
    return this.handlers.length - 1;
  }

  forEach(fn: (handler: Handler<T>) => void): void {
    this.handlers.forEach((handler) => {
      if (handler !== null) {
        fn(handler);
      }
    });
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
}
