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





// ======================================================兜底操作
window.addEventListener("load", () => {
  console.log('----> edge plugin load')
  //  初始化获取xhr类型请求
  const list = getXhrRequest()
  onMessagePopupScript(list)
  // 插入初始化后续拦截http请求脚本
  // appendHttpScript()

})



// ======================================================页面卸载处理,清除全局定时器
window.addEventListener("beforeunload", () => {

  // console.log('All Requests:', interceptor.getAllRequests());
  window.myTimerList = []

})
