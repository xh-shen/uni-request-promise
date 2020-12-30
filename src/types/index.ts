/*
 * @Author: shen
 * @Date: 2020-12-28 00:46:10
 * @LastEditors: shen
 * @LastEditTime: 2020-12-30 14:54:07
 * @Description:
 */

export interface RequestPromise<T = any> extends Promise<ResponseResult<T>> {}

export type Transformer = (data: any, header?: any) => any;

export type RequestAdapter = (config: RequestConfig) => RequestPromise<any>;

export type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';

export type ResponseType = 'arraybuffer' | 'text';

export interface RequestConfig {
  url?: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: Transformer | Transformer[];
  transformResponse?: Transformer | Transformer[];
  header?: any;
  params?: any;
  data?: any;
  dataType?: string;
  timeout?: number;
  adapter?: RequestAdapter;
  withCredentials?: boolean;
  responseType?: ResponseType;
  sslVerify?: boolean;
  firstIpv4?: boolean;
  [propName: string]: any;
}

export interface ResponseResult<T = any> {
  data: T;
  status: number;
  statusText: string;
  header: any;
  config: RequestConfig;
  request: any;
}

export type ResolvedFn<T> = (val: T) => T | Promise<T>;

export type RejectedFn = (error: any) => any;

export interface InterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;

  eject(id: number): void;
}

export interface RequestInstance {
  defaults: RequestConfig;
  interceptors: {
    request: InterceptorManager<RequestConfig>;
    response: InterceptorManager<ResponseResult>;
  };
  request<T = any>(config: RequestConfig): RequestPromise<T>;
  get<T = any>(url: string, config?: RequestConfig): RequestPromise<T>;
  delete<T = any>(url: string, config?: RequestConfig): RequestPromise<T>;
  head<T = any>(url: string, config?: RequestConfig): RequestPromise<T>;
  options<T = any>(url: string, config?: RequestConfig): RequestPromise<T>;
  post<T = any>(url: string, data?: any, config?: RequestConfig): RequestPromise<T>;
  put<T = any>(url: string, data?: any, config?: RequestConfig): RequestPromise<T>;
  patch<T = any>(url: string, data?: any, config?: RequestConfig): RequestPromise<T>;
  getUri(config?: RequestConfig): string;
}

export type RequestClassStatic = new (config: RequestConfig) => RequestInstance;

export interface RequestStatic extends RequestInstance {
  create(config?: RequestConfig): RequestInstance;
  // isCancel(value: any): boolean;
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;
  Request: RequestClassStatic;
}
