/*
 * @Date: 2024-08-06 16:08:26
 * @LastEditTime: 2024-08-13 17:30:45
 * @Description:  拦截http请求相关
 * @FilePath: /my-browser-plugins/js/httpIntercept.js
 */

/* 插入http拦截脚本(后续请求拦截) */
// function injectedHttpScript () {
// const s = document.createElement('script');
// s.type = "module"
// s.src = chrome.runtime.getURL('./js/interceptXhr.js');
// s.onload = function () {
//   console.log('拦截xhr脚本注入成功')
//   // this.remove();// 成功后删除
// };
// (document.head || document.documentElement).appendChild(s);
// }


/* 初始化http 拦截 */
// function getXhrRequest () {
//   const httpList = getRequestListByType('http')
//   const xhrList = getDevInterface(httpList, '/api')
//   return xhrList
// }
// ------------------------------------------

/* 创建捕获到的http表格dom */
function createXhrTable (list, domTag) {
  var html = `
          <div id="httpBody">
           <div class="h_title">
            <div>拦截到‘api’前缀的相关接口(${list.length})</div>
             <span class="h_btn">x</span>
             </div>
           <div class="h_table">
            <table id="apiTable">
                <thead class="httpHead">
                    <tr>
                      <th>api</th>
                      <th class="t2">请求参数</th>
                      <th class="t3">请求方法</th>
                      <th class="t4">请求时间</th>
                      <th>href</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map(i => `
                        <tr>
                            <td>${i.api}</td>
                            <td>
                                ${Object.entries(i.params).map(([key, value]) => `${key}: ${value}`).join(' ')}
                            </td>
                            <td>${i.method}</td>
                            <td>${i.date}</td>
                            <td>${i.href}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            </div>
          </div>
        `;
  $(domTag).append(html)
  $(".h_btn").click(function (e) {
    $('#httpBody').hide(400)
  });
}



// 根据内容设置td宽度
function adjustColumnWidths () {
  const table = document.getElementById('apiTable');
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


/* 插入dom表格 */
function appendTableDom (list) {
  if ($("#httpBody").length) {
    $("#httpBody").remove()
  }
  createXhrTable(list, 'body')
}

/*  监听其他页面发来的 chrome.tabs.sendMessage 消息 */
function chromeOnMessage () {
  // chrome.runtime.onMessage 不可以在 注入js文件中使用。
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const { form, title, action } = request
    console.log(`监听来自chrome扩展--》${title}发送的消息：`, request)
    // background.js
    if (form === 'background') {
      if (action === 'showHttpList') {
        // 显示 httplist
        $("#httpBody").show(500)
      }
    }
    // popup.js脚本
    if (form === 'popup') {
      const liststr = sessionStorage.getItem('httpList');
      const list = liststr ? JSON.parse(liststr) : []
      console.log('获取注入脚本拦截的api请求---', list)
      appendTableDom(list)
      sendResponse({ msg: 'popup, 发送的消息！' })
    }
  });
}











// -----------------------------------

/* 根据apiPrefix过滤制定http请求 */
function getDevInterface (list, apiPrefix) {
  return list.filter((item, index) => item.href.includes(apiPrefix)).map((i) => {
    return {
      ...getQueryParams(i.href),
    }
  })
}



/** 初始化-获取页面所有请求资源（植入个别接口居多的网站，数据太多容易崩溃） */
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
/** 初始化-根据类型获取不同请求列表 */
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
