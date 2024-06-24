console.log("this is index.js")


/** 所有定时任务 */
function startTime () {
  // 上班格言更新
  setTimeout(() => {
    doSomething(mottoFun, 10)
  }, 10 * 1000)
  // 下班倒计时更新
  setTimeout(() => {
    doSomething(countdownToWorkFun)
  }, 1000)
  // 放假倒计时
  setTimeout(() => {
    doSomething(weekendCountdownFun(getThisWeek5(formatDate())), 60)
  }, 60 * 1000)
}


// ===================定时轮询开启、更新dom内容
startTime()















// ======================================================兜底操作
document.addEventListener("beforeUnload", () => {
  alert(555)
})
// ==================================页面卸载处理,清除全局定时器
document.addEventListener("unload", () => {
  window.myTimerList = []
})
