/*
 * @Date: 2024-08-06 17:27:04
 * @LastEditTime: 2024-09-09 16:14:01
 * @Description: 对原生的XMLHttpRequest及fetch对象做扩展来实现对请求和响应的捕获
 * @FilePath: /config-screen-demo/Users/sisi/Desktop/myWeb/my-plugins-project/my-browser-plugins/js/interceptXhr.js
 */


// 确保在 jQuery 加载完成后，jQuery 可用
// $(document).ready(function () {
//   console.log(6666, "jQuery is ready in yourScript.js!");
// });


let alllHttpList = []

// 初始化执行
httpProxy(XMLHttpRequest)
/*  拦截XMLHttpRequest   */
function httpProxy (xhr) {
  // console.log('2、拦截请求脚本已加载')
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
    this.addEventListener('load', function () {
      // console.log('XHR.send---this---', this)
      const { _url, _method, _requestHeaders, responseURL, response, status, } = this
      if (_url && _url.includes('/api')) {
        const { urlObj, urlParams } = getUrlParamsObj(responseURL)
        const httpData = {
          date: getDate(),
          ...urlObj,
          params: postData ? JSON.parse(postData) : urlParams,
          method: _method,
          status: status,
          response: response ? JSON.parse(response) : response,
          requestHeaders: _requestHeaders,
        }
        console.log('拦截到的参数', httpData)
        try {
          // 添加请求数据到全局list
          addList(httpData)
          const res = getXhrRequest(alllHttpList)
          console.log('拦截过滤后http结果--->', res);
          // console.table(res);
          // 插入新的dom数据
          appendTableDom(res)
          // sessionStorage.setItem('httpList', JSON.stringify(res));
        } catch (err) {
          console.log("拦截错误: try catch", err);
        }
      }
    });
    return send.apply(this, arguments);
  };
};



/* 添加数据 */
function addList (obj) {
  // 当 alllHttpList 的长度大于 4 时，清空数组
  if (alllHttpList.length > 5) {
    alllHttpList.length = 0; // 清空数组
    alllHttpList = []
  }
  // 检查新对象的日期是否已经存在于 alllHttpList 中
  const exists = alllHttpList.some(i => i.date === obj.date);
  // 如果日期不存在，则将新对象添加到数组中
  if (!exists) {
    alllHttpList.push(obj);
  }
}

/* 初始化http 拦截 */
function getXhrRequest (httpList) {
  const xhrList = getDevInterface(httpList, '/api')
  // console.log('根据 /api  过滤后的 请求', xhrList)
  return xhrList
}

function getDate () {
  const dateArray = Date().split(' ')
  const monthString = dateArray[1]
  // 将月份转换为数字
  const monthNumber = new Date(Date.parse(monthString + ' 1')).getMonth() + 1; // 加 1 因为 getMonth() 返回 0-11
  return `${monthNumber}-${dateArray[2]}【${dateArray[4]}】`
}


// 获取url参数以及 格式化url
function getUrlParamsObj (url) {
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
    urlObj: {
      origin,
      api: pathname,
      href: href.toString()
    }
  };
}



// TODO
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
