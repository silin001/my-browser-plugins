/*
 * @Date: 2024-08-06 16:08:26
 * @LastEditTime: 2024-08-08 22:25:59
 * @Description: 
 * @FilePath: /my-browser-plugins/js/getHttp.js
 */

class HttpRequestInterceptor {
  constructor() {
    this.requests = [];
    // fetch
    this.initFetchInterceptor();
    // http
    this.initXhrInterceptor();
  }

  initFetchInterceptor () {
    console.log('fetch---')
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch.apply(this, args);
      const clonedResponse = response.clone();
      const responseBody = await clonedResponse.text();
      const requestInfo = {
        method: args[1]?.method || 'GET',
        url: args[0],
        headers: args[1]?.headers || {},
        body: args[1]?.body || null,
        response: responseBody,
        status: response.status,
        statusText: response.statusText
      };
      this.requests.push(requestInfo);
      return response;
    };
  }

  initXhrInterceptor () {
    console.log('xhr---')
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    console.log('🚀🚀 ~ HttpRequestInterceptor ~ initXhrInterceptor ~ originalXhrOpen:', originalXhrOpen)
    const originalXhrSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      this._method = method;
      this._url = url;
      this._headers = {};
      return originalXhrOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      this._headers[header] = value;
      return XMLHttpRequest.prototype.setRequestHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
      this._body = body;

      const onLoad = () => {
        const responseHeaders = this.getAllResponseHeaders();
        const response = this.responseText;
        const status = this.status;
        const statusText = this.statusText;
        const requestInfo = {
          method: this._method,
          url: this._url,
          headers: this._headers,
          body: this._body,
          response: response,
          status: status,
          statusText: statusText
        };
        this._interceptor.requests.push(requestInfo);
      };

      this.addEventListener('load', onLoad);
      this.addEventListener('error', onLoad);
      this.addEventListener('abort', onLoad);

      return originalXhrSend.apply(this, arguments);
    };

    const xhrProxyHandler = {
      construct (target, args) {
        const xhrInstance = new target(...args);
        xhrInstance._interceptor = this;
        return xhrInstance;
      }
    };

    window.XMLHttpRequest = new Proxy(XMLHttpRequest, xhrProxyHandler);
  }

  getAllRequests () {
    return this.requests;
  }
}

/** 获取页面所有请求资源 */
function getAllEntries () {
  console.log(window.performance)
  const result = []
  window.performance.getEntries().forEach((item) => {
    result.push(
      {
        'url': item.name,
        'entryType': item.entryType,
        'initiatorType': item.initiatorType || '无initiatorType属性',
        'duration': item.duration.toFixed(1) + 'ms'
      });
  });
  console.table(result)
  return result
}
/** 根据类型获取不同请求列表 */
function getRequestListByType (type) {
  const result = []
  const typeMapping = {
    http: 'xmlhttprequest',
    img: 'img',
    icon: 'icon',
  }
  window.performance.getEntries().forEach((item) => {
    if (item.initiatorType === typeMapping[type]) {
      // console.log(`${typeMapping[type]}---`, item)
      result.push(
        {
          'url': item.name,
          'entryType': item.entryType,
          'initiatorType': item.initiatorType,
          'duration': item.duration.toFixed(1) + 'ms'
        });
    }
  });
  // console.table(result)
  return result
}

/* 根据apiPrefix过滤制定http请求 */
function getDevInterface (list, apiPrefix) {
  return list.filter((item, index) => item.url.includes(apiPrefix)).map((i) => {
    return {
      ...getQueryParams(i.url),
    }
  })
}


/* 插入http拦截脚本(后续请求拦截) */
function appendHttpScript () {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('js/injected.js');
  s.onload = function () {
    console.log('---- http 拦截脚本插入成功')
    // this.remove();// 成功后删除
  };
  (document.head || document.documentElement).appendChild(s);
}
/* 初始化http 拦截 */
function getXhrRequest () {
  const httpList = getRequestListByType('http')
  const xhrList = getDevInterface(httpList, '/api')
  return xhrList
}
// ------------------------------------------
function createXhrTable (list, domTag) {
  var html = `
          <div id="httpBody">
           <div class="h_title">
            <div>api相关接口</div>
             <span class="h_btn">x</span>
           </div>
           <div class="h_table">
            <table id="apiTable">
                <thead class="httpHead">
                    <tr >
                        <th>origin</th>
                        <th>api</th>
                        <th>urlParams</th>
                        <th>href</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map(i => `
                        <tr>
                            <td>${i.origin}</td>
                            <td>${i.api}</td>
                            <td>
                                ${Object.entries(i.urlParams).map(([key, value]) => `${key}: ${value}`).join(' ')}
                            </td>
                            <td>${i.href}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            </div>
          </div>
        `;
  $(domTag).append(html).show(1500)


  // 调用函数调整列宽
  // adjustColumnWidths();
  $(".h_btn").click(function (e) {
    $('#httpBody').hide(400)
  });
}



// 根据内容设置td宽度
function adjustColumnWidths () {
  const table = document.getElementById('apiTable');
  console.log('🚀🚀 ~ adjustColumnWidths ~ table:', table)
  const rows = table.rows;
  const columnCount = rows[0].cells.length; // 获取列数

  for (let i = 0; i < columnCount; i++) {
    let maxWidth = 0; // 每列的最大宽度
    for (let j = 0; j < rows.length; j++) {
      const cell = rows[j].cells[i];
      const cellWidth = cell.offsetWidth; // 获取单元格的宽度
      maxWidth = Math.max(maxWidth, cellWidth); // 更新最大宽度
    }
    // 设置列宽
    for (let j = 0; j < rows.length; j++) {
      rows[j].cells[i].style.width = maxWidth + 'px'; // 根据最大宽度设置宽度
    }
  }
}


/*  监听popup的消息 */
function onMessagePopupScript (data) {
  console.log('🚀🚀 ~ onMessagePopupScript ~ data:', data)
  // 接受popup的消息
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('监听popup发来的数据:', request)
    const { showHttpList } = request
    if (showHttpList) {


      if ($("#httpBody").length) {
        $("#httpBody").remove()
      }
      createXhrTable(data, 'body')
      // 发生消息到 popup消息
      sendResponse({
        num: data.length
      })
    }
  });

}





