/*
 * @Date: 2024-05-16 14:30:45
 * @LastEditTime: 2024-07-10 09:28:04
 * @Description:
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\my-browser-plugins\js\units.js
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
 console.log('🚀🚀 ~ doSomething ~ closingTime:', closingTime)
 // 在操作完成后，再次设置延迟时间，继续执行 doSomething 函数
 if (typeof fun === "function") {
  fun(closingTime)
 }
 let timer = setTimeout(() => {
  doSomething(fun, time, closingTime)
 }, time * 1000);
 myTimerList.push(timer)
}
