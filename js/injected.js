/*
 * @Date: 2024-08-06 17:27:04
 * @LastEditTime: 2024-08-08 13:22:16
 * @Description: 对原生的XMLHttpRequest及fetch对象做扩展来实现对请求和响应的捕获
 * @FilePath: /my-browser-plugins/js/injected.js
 */

var alllHttpList = []


httpProxy(XMLHttpRequest)
/*  拦截XMLHttpRequest   */
function httpProxy (xhr) {
  const XHR = xhr.prototype || XMLHttpRequest.prototype;
  const open = XHR.open;
  const send = XHR.send;
  const setRequestHeader = XHR.setRequestHeader;

  XHR.open = function (method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function (header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function (postData) {
    // console.log('postParams: ', postData);
    this.addEventListener('load', function () {
      const { responseType, _url, _method, _requestHeaders, responseURL, response, status, } = this
      if (_url) {
        // console.log('send  this----', this)
        const httpData = {
          date: getDate(),
          ...getQueryParams(responseURL),
          postParams: JSON.parse(postData),
          method: _method,
          status: status,
          response: JSON.parse(response),
          requestHeaders: _requestHeaders,
        }
        this['httpData'] = httpData // 拦截添加http请求信息字段
        addList(httpData) // 添加请求数据到全局list
        if (responseType !== 'blob') {
          try {
            console.log('所有拦截结果----', alllHttpList);
            console.table(alllHttpList);
          } catch (err) {
            console.log("拦截错误：Error in responseType try catch");
            console.log(err);
          }
        }

      }
    });
    return send.apply(this, arguments);
  };
};


/* 添加数据 */
function addList (obj) {
  if (!alllHttpList.length) {
    alllHttpList.push(obj)
  } else {
    alllHttpList.forEach((i) => {
      if (i.date !== obj.date) {
        alllHttpList.push(obj)
      }
    })
  }
}
function getQueryParams (url) {
  // 使用 URL 对象解析 URL 字符串
  const parsedUrl = new URL(url);
  const { search, href, pathname, origin } = parsedUrl
  // 初始化返回的参数对象
  let urlParams = {}
  // 获取查询参数
  const urlSearchParams = new URLSearchParams(search);
  // 遍历查询参数并填充到对象中
  urlSearchParams.forEach((value, key) => {
    urlParams[key] = value;
  });

  return {
    urlParams,
    origin,
    api: pathname,
    href
  };
}

function getDate () {
  const dateArray = Date().split(' ')
  const monthString = dateArray[1]
  // 将月份转换为数字
  const monthNumber = new Date(Date.parse(monthString + ' 1')).getMonth() + 1; // 加 1 因为 getMonth() 返回 0-11
  return `${dateArray[3]}-${monthNumber}-${dateArray[2]}|${dateArray[4]}`
}



// 拦截fetch
// const originalFetch = window.fetch;
// window.fetch = function (url, options) {
//   const fch = originalFetch(url, options);

//   console.log('url: ', url);
//   console.log('options: ', options);

//   fch.then(function (data) {
//     if (data.ok && data.status == 200) {
//       return data.clone().json();
//     }
//   }).then(function (a) {
//     console.log('response', a);
//   });
//   return fch;
// }
