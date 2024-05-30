console.log("this is index.js")

/** 格言 */
function mottoFun () {
  const mottoList = [
    '职场三连： 摸鱼、摆烂、等下班',
    '偷的浮生半日闲，明天依旧打工人',
    '人生不过三万天，打工一天又一天',
    '枯藤老树昏鸦，上班摸鱼下班回家',
    '人生得意须尽欢，周末双休不加班',
    '月薪两千五，命比咖啡苦',
    '上班的我风都吹的倒，下班的我狗都追不到',
    '虚情假意上班，真心实意下班',
    '上辈子作恶多端，这辈子早起上班',
    '磨刀不误砍柴工，玩会手机再开工',
  ]
  const txt = mottoList[Math.floor(Math.random() * 10)]
  console.log('🚀🚀 ~ mottoFun ~ txt:', txt)
  $('#my_motto').text(txt)
}

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


/** 初始化 */
function myInit () {
 // 挂载 dom
  createPage()
  // 格言初始化
  mottoFun()
  if (['日', '六'].includes(week)) {
    $('#my_ul').text('周末啦，好好休息啊！')
    return
  }
  // 周五放假倒计时
 weekendCountdownFun(getThisWeek5(formatDate()))
 // 定时轮询开启、更新dom内容
  startTime()

}



// ==================================初始化
myInit()
// ==================================初始化


/** 鼠标移入移出添加class */
$(function () {
 $("#my_body").mouseover(function () {
  $(this).addClass('my_dom_highlight')
 }).mouseout(function () {
  $(this).removeClass('my_dom_highlight');
 });
});


document.addEventListener("beforeUnload", () => {
  alert(555)
})
// ==================================页面卸载处理,清除全局定时器
document.addEventListener("unload", () => {

 window.myTimerList = []
})
