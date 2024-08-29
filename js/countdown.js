/*
 * @Date: 2024-05-29 15:32:23
 * @LastEditTime: 2024-08-29 09:53:50
 * @Description: 下班倒计时、放假倒计时
 * @FilePath: /safmr/Users/sisi/Desktop/myWeb/my-plugins-project/my-browser-plugins/js/countdown.js
 */

const week = "日一二三四五六".charAt(new Date().getDay());
/** 创建基础dom */
function createPage (title) {
  const page = $myjq('<div id="my_body" title="双击可隐藏哦"></div>')
  const box = $myjq('<div id="my_box"></div>')
  const icon = $myjq('<div id="my_icon" class="hide" title="单击显示"></div>')
  const tit = $myjq(`<div id="my_title">${title}</div>`)
  const motto = $myjq(`<div id="my_motto" class="text-center"></div>`)
  const con = $myjq('<div id="my_ul"></div>')
  box.append(tit)
  box.append(motto)
  box.append(con)
  page.append(box)
  page.append(icon)
  $myjq('body').append(page)
  setTitle()
  createConcentDom()
}

/** 创建内容dom */
function createConcentDom () {
  const dom = $myjq(`<li class="weekendCountdown">
         距离周五放假：
         <span class="time day"></span>天
         <span class="time hour"></span>小时
         <span class="time min"></span>分
         </li>
        <li class="countdownToWork">
        距离17:30下班：
         <span class="time hour"></span>小时
         <span class="time min"></span>分
         <span class="time seconds"></span>秒
         </li>
        <li class="countdownToWork2">
        距离18:00下班：
         <span class="time hour"></span>小时
         <span class="time min"></span>分
         <span class="time seconds"></span>秒
         </li>
       `)
  $myjq('#my_ul').append(dom)
}

function setTitle () {
  $myjq('#my_title').text(`今天是星期${week}、摸鱼办提醒您：`);
}

/** 根据当前时间计算 下班倒计时 */
function calculateTimeUntilClosing (endh = 18, endm = 0, start = 9) {
  // 获取当前时间
  let currentTime = new Date();
  // 设置上班时间为早上9点
  let openingTime = new Date();
  // 开始时间都是9点整
  openingTime.setHours(start, 0, 0);
  // 设置下班时间为晚上5点30分、6点两个时间段
  let closingTime = new Date();
  closingTime.setHours(endh, endm, 0);
  // console.log('时间---', closingTime)
  const anHour = 1000 * 60 * 60; // 1小时

  // 如果当前时间早于上班时间，则返回距离上班时间还有多少小时和分钟
  // if (currentTime < openingTime) {
  //  let timeRemaining = openingTime - currentTime; // 上班时间9 - 当前时间 = 差值
  //  let hours = Math.floor(timeRemaining / anHour); // 看当前时间是多少小时
  //  let minutes = Math.floor((timeRemaining % anHour) / (1000 * 60)); // 看当前时间是多少分钟
  //  return `距离上班还有${hours}小时${minutes}分钟`;
  // }
  if (currentTime >= closingTime && closingTime.toString().includes('17:30')) {
    $myjq('.countdownToWork').text('5.30下班时间，可以下班啦！记得打卡！')
  }
  if (currentTime >= closingTime && closingTime.toString().includes('18:00')) {
    $myjq('.countdownToWork2').text('18点下班时间，可以下班啦！记得打卡！')
  }

  // 如果当前时间在上班时间和下班时间之间，则返回距离下班时间还有多少小时和分钟
  let timeRemaining = closingTime - currentTime; // 下班时间18 - 当前时间 = 差值
  let hours = Math.floor(timeRemaining / anHour); // 剩余小时
  let minutes = Math.floor((timeRemaining % anHour) / (1000 * 60)); // 剩余分钟
  let seconds = Math.floor((timeRemaining % anHour) % (1000 * 60) / 1000); // 剩余秒
  return { hours, minutes, seconds }
}

/** 下班时间倒计时 */
function countdownToWorkFun (five30) {
  const { hours, minutes, seconds } = five30 ? calculateTimeUntilClosing(17, 30) : calculateTimeUntilClosing()
  const targetClass = five30 ? '.countdownToWork' : '.countdownToWork2';
  $myjq(`${targetClass} .hour`).text(hours);
  $myjq(`${targetClass} .min`).text(minutes);
  $myjq(`${targetClass} .seconds`).text(seconds);
}

/** 周五放假倒计时 */
function weekendCountdownFun (weekTime) {

  const time = weekTime// 周五时间的18点
  // 当前时间
  const today = new Date();
  //添加结束时间
  const stopTime = new Date(time);
  //获取时间戳（毫秒）
  const shenyu = stopTime.getTime() - today.getTime();
  //转化为秒
  const zhuanHS = shenyu / 1000;
  //转换为天
  const shengyuD = parseInt(zhuanHS / (60 * 60 * 24));
  //计算天的余数为小时
  const shengyuH = parseInt(zhuanHS / (60 * 60) % 24);
  //计算小时的余数为分钟
  const shengyuM = parseInt(zhuanHS / (60) % 60);
  //计算分钟的剩余秒
  // let shengyuS = parseInt(zhuanHS % 60)
  $myjq('.weekendCountdown .day').text(shengyuD)
  $myjq('.weekendCountdown .hour').text(shengyuH)
  $myjq('.weekendCountdown .min').text(shengyuM)
}
/** 格言 */
function mottoFun () {
  const mottoList = [
    '职场三连： 摸鱼、摆烂、等下班',
    '偷的浮生半日闲，明天依旧打工人',
    '人生不过三万天，打工一天又一天',
    '枯藤老树昏鸦，上班摸鱼下班回家',
    '人生得意须尽欢，周末双休不加班',
    '虚情假意上班，真心实意下班',
    '上辈子作恶多端，这辈子早起上班',
    '磨刀不误砍柴工，玩会手机再开工',
  ]
  const txt = mottoList[Math.floor(Math.random() * 8)]
  $myjq('#my_motto').text(txt)
}
/** 边界情况处理 */
function initBoundary () {
  if (['日', '六'].includes(week)) {
    // 清空时间dom内容
    $myjq('#my_ul').text('已经是周末啦，要好好休息啊！')
    return
  }
}


/** 初始化 */
function myInit () {
  // 挂载 dom
  createPage()
  // 格言初始化
  mottoFun()
  // 边界情况处理
  initBoundary()
  // 周五放假倒计时
  weekendCountdownFun(getThisWeek5(formatDate()))
}
// ======================================================初始化
myInit()


// ===================================================点击事件
/** 鼠标移入移出弹框dom添加class */
$myjq(function () {
  // const meat = '<meta name="referrer" content="no-referrer" />'
  // $myjq('head').append(meat)
  $myjq("#my_body").mouseover(function () {
    $myjq(this).addClass('my_dom_highlight')
  }).mouseout(function () {
    $myjq(this).removeClass('my_dom_highlight');
  });
});




/** 双击事件隐藏dom、显示icon */
$myjq("#my_body").dblclick(function (e) {
  e.stopPropagation()
  $myjq("#my_box").hide(300)
  // 这里要使用chrome.extension.getURL('本地路径') 生成一个可识别的url
  // 如果manifest_version是v3版本， 则应该用 chrome.runtime.getURL
  const imgUrl = chrome.runtime.getURL("/images/icon1.png");
  // const bennerImage = "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0cca2ddb9e34394a45a5e5d17f6209f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=373&h=348&s=57889&e=png&b=fcfcfc";
  $myjq("#my_icon").css("background-image", "url(" + imgUrl + ")").show(600)
},);
/** 点击icon,隐藏icon、显示dom  */
$myjq("#my_icon").click(function (e) {
  e.stopPropagation()
  $myjq("#my_icon").hide(400)
  $myjq("#my_box").show(600)
});
