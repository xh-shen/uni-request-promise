/*
 * @Author: shen
 * @Date: 2020-12-29 13:15:27
 * @LastEditors: shen
 * @LastEditTime: 2020-12-29 13:20:08
 * @Description:
 */

function combineURLs(baseURL: string, relativeURL: string) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}

export default function buildFullPath(baseURL: string | undefined, requestedURL: string): string {
  if (baseURL) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
