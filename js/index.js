console.log("---> edge plugin index.js")
/** 格言面板、下班倒计时，定时轮询开启、更新dom内容 */
function initPanel () {
  // 上班格言更新
  setTimeout(() => {
    doSomething(mottoFun, 10)
  }, 10 * 1000)
  // 5.30下班倒计时更新
  setTimeout(() => {
    doSomething(countdownToWorkFun, 1, '530')
  }, 1000)
  // 6下班倒计时更新
  setTimeout(() => {
    doSomething(countdownToWorkFun, 1)
  }, 1000)
  // 放假倒计时
  setTimeout(() => {
    doSomething(weekendCountdownFun(getThisWeek5(formatDate())), 60)
  }, 60 * 1000)
}
initPanel()







/* 插入http拦截脚本(后续请求拦截) */
function injectedHttpScript () {
  const interceptXhr = chrome.runtime.getURL('./js/interceptXhr.js');
  const jquery = chrome.runtime.getURL('./js/jquery.js');
  const httpIntercept = chrome.runtime.getURL('./js/httpIntercept.js');
  // 加载 jQuery
  loadScript(jquery, function () {
    console.log("jQuery loaded!");
    // 加载依赖于 jQuery 的被加载 JS 文件
    loadScript(httpIntercept)
    loadScript(interceptXhr, function () {
      console.log("interceptXhr loaded!");
    });
  });
}


// // 监听background消息
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "changeBackgroundColor") {
//     document.body.style.backgroundColor = request.color;
//     // sendResponse({ status: "success" });
//   }
// });



// ======================================================兜底操作
window.addEventListener("load", () => {
  console.log('----> edge plugin load')
  // 插入初始化后续拦截http请求脚本
  injectedHttpScript()
  // 初始化执行 页面监听
  chromeOnMessage()


})



// ======================================================页面卸载处理,清除全局定时器
window.addEventListener("beforeunload", () => {

  // console.log('All Requests:', interceptor.getAllRequests());
  window.myTimerList = []

})
