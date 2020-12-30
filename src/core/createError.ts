/*
 * @Author: shen
 * @Date: 2020-12-29 19:22:32
 * @LastEditors: shen
 * @LastEditTime: 2020-12-29 19:26:09
 * @Description:
 */
import { RequestConfig, ResponseResult } from '../types';

export class RequestError extends Error {
  isRequestError: boolean;
  config: RequestConfig;
  code?: string | null;
  request?: any;
  response?: ResponseResult;

  /* istanbul ignore next */
  constructor(message: string, config: RequestConfig, code?: string | null, request?: any, response?: ResponseResult) {
    super(message);

    this.config = config;
    this.code = code;
    this.request = request;
    this.response = response;
    this.isRequestError = true;

    Object.setPrototypeOf(this, RequestError.prototype);
  }
}

export function createError(message: string, config: RequestConfig, code?: string | null, request?: any, response?: ResponseResult): RequestError {
  const error = new RequestError(message, config, code, request, response);

  return error;
}
