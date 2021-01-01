# uni-request-promise

## 安装

使用 npm:

```bash
$ npm install uni-request-promise
```

使用 yarn:

```bash
$ yarn add uni-request-promise
```

## API

```js
import request from 'uni-request-promise';
```

### request(config)

```js
request({
  method: 'post',
  url: '/api/user/1111',
  data: {},
});
```

### request(url[, config])

```js
request('/api/user/1111');
```

### 请求方法别名

为了方便起见，已为所有受支持的请求方法提供了别名。

##### request.request(config)

##### request.get(url[, config])

##### request.delete(url[, config])

##### request.head(url[, config])

##### request.options(url[, config])

##### request.post(url[, data[, config]])

##### request.put(url[, data[, config]])

##### request.patch(url[, data[, config]])

#### 注意

使用别名方法时，url、method、data 无需在 config 中配置。

### 创建一个实例

您可以使用自定义配置创建 request 的新实例。

##### request.create([config])

```js
const instance = request.create({
  baseURL: 'https://api.example.com',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'custom' },
});
```

### 实例

可用的实例方法在下面列出。指定的配置将与实例配置合并。

##### request#request(config)

##### request#get(url[, config])

##### request#delete(url[, config])

##### request#head(url[, config])

##### request#options(url[, config])

##### request#post(url[, data[, config]])

##### request#put(url[, data[, config]])

##### request#patch(url[, data[, config]])

##### request#getUri([config])

## 请求配置

请求配置除了`uni.request`的参数（不包括方法），还有其他参数，除了`url`为必须配置的参数，其他可使用默认参数，`method`默认为`get`.

```js
{
  url: '/user',
  method: 'get', // default
  baseURL: 'https://api.example.com',

  transformRequest: [function (data, headers) {
    return data;
  }],

  transformResponse: [function (data) {
    return data;
  }],

  headers: {'X-Requested-With': 'XMLHttpRequest'},

  params: {
    ID: '11111'
  },
  data: {
    firstName: 'Fred'
  },
  timeout: 60000,// default
  withCredentials: false,// default
  adapter: function (config) {
    /* ... */
  },
  responseType: 'json', // default
  cancelToken: new CancelToken(function (cancel) {
  }),
}
```

## 响应信息

```js
{
  data: {},
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
  request: {}
}
```

使用 then 方式

```js
request.get('/api/user/1111').then(function (response) {
  console.log(response.data);
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
  console.log(response.config);
});
```

## 配置默认值

您可以指定将应用于每个请求的配置默认值。

### 全局 request 默认值

```js
request.defaults.baseURL = 'https://api.example.com';
request.defaults.headers.common['Authorization'] = AUTH_TOKEN;
request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

### 自定义实例默认值

```js
const instance = request.create({
  baseURL: 'https://api.example.com',
});

instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```

### 配置优先级

```js
const instance = request.create();

instance.defaults.timeout = 2500;

instance.get('/longRequest', {
  timeout: 5000,
});
```

## 拦截器

您可以先拦截请求或响应，然后再由 then 或处理 catch。

```js
request.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
```

## 错误处理

```js
request.get('/api/user/1111').catch(function (error) {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
  console.log(error.config);
});
```

## 取消请求

您可以使用取消令牌取消请求。

```js
const CancelToken = request.CancelToken;
const source = CancelToken.source();

request
  .get('/api/user/1111', {
    cancelToken: source.token,
  })
  .catch(function (thrown) {
    if (request.isCancel(thrown)) {
      console.log('Request canceled', thrown.message);
    } else {
    }
  });

request.post(
  '/api/user/1111',
  {
    name: 'new name',
  },
  {
    cancelToken: source.token,
  }
);

source.cancel('message');
```

```js
const CancelToken = request.CancelToken;
let cancel;

request.get('/api/user/1111', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  }),
});

cancel();
```

## License

[MIT](LICENSE)
