/*
 * @Date: 2024-05-16 14:30:45
 * @LastEditTime: 2024-08-28 10:46:41
 * @Description:
 * @FilePath: /safmr/Users/sisi/Desktop/myWeb/my-plugins-project/my-browser-plugins/js/units.js
 */

/** 存放全局定时器 */
window.myTimerList = []

/** 根据当前实际获取本周五+ 18点 */
function getThisWeek5 (date) {
  const hours = ' 18:00:00'
  const data = new Date(date + hours)
  const ThisWeek5 = data.getTime() + (5 - data.getDay()) * 24 * 60 * 60 * 1000
  return new Date(ThisWeek5)
}


/** 格式化当前日期 */
function formatDate (date = new Date()) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return year + "/" + month + "/" + day;
}


/** setTimeout轮询 */
function doSomething (fun, time, closingTime) {
  // 在操作完成后，再次设置延迟时间，继续执行 doSomething 函数
  if (typeof fun === "function") {
    fun(closingTime)
  }
  let timer = setTimeout(() => {
    doSomething(fun, time, closingTime)
  }, time * 1000);
  myTimerList.push(timer)
}

/* 获取url参数 */
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

/* 插入 js*/
function loadScript (url, callback) {
  const script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}