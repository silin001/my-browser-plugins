/*
 * @Date: 2024-05-29 15:32:23
 * @LastEditTime: 2024-05-30 09:26:14
 * @Description: 下班倒计时、放假倒计时
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\my-browser-plugins\js\countdown.js
 */


const week = "日一二三四五六".charAt(new Date().getDay());
/** 创建基础dom */
function createPage (title) {
  const page = $('<div id="my_body"></div>')
  const tit = $(`<div id="my_title">${title}</div>`)
  const motto = $(`<div id="my_motto" class="text-center"></div>`)
  const con = $('<ul id="my_ul"></ul>')
  page.append(tit)
  page.append(motto)
  page.append(con)
  $('body').append(page)
  setTitle()
  createConcentDom()
}

/** 创建内容dom */
function createConcentDom () {
  const dom = $(`
        <li class="countdownToWork">
        距离下班时间：
         <span class="time hour"></span>小时
         <span class="time min"></span>分
         <span class="time seconds"></span>秒
         </li>
        <li class="weekendCountdown">
         距离周五放假：
         <span class="time day"></span>天
         <span class="time hour"></span>小时
         <span class="time min"></span>分
         </li>
       `)
  $('#my_ul').append(dom)
}

function setTitle () {
  $('#my_title').text(`今天是星期${week}、摸鱼办提醒您：`);
}

/** 根据当前时间计算 下班倒计时 */
function calculateTimeUntilClosing (start = 9, end = 17) {
  // 获取当前时间
  let currentTime = new Date();
  // 设置上班时间为早上9点
  let openingTime = new Date();
  openingTime.setHours(start, 0, 0);
  // 设置下班时间为晚上5点50分
  let closingTime = new Date();
  closingTime.setHours(end, 50, 0);

  const anHour = 1000 * 60 * 60; // 1小时

  // 如果当前时间早于上班时间，则返回距离上班时间还有多少小时和分钟
  // if (currentTime < openingTime) {
  //  let timeRemaining = openingTime - currentTime; // 上班时间9 - 当前时间 = 差值
  //  let hours = Math.floor(timeRemaining / anHour); // 看当前时间是多少小时
  //  let minutes = Math.floor((timeRemaining % anHour) / (1000 * 60)); // 看当前时间是多少分钟
  //  return `距离上班还有${hours}小时${minutes}分钟`;
  // }

  // 默认没下班
  let state = false
  // 如果当前时间晚于下班时间，已经下班
  if (currentTime >= closingTime) {
    state = true
  }

  // 如果当前时间在上班时间和下班时间之间，则返回距离下班时间还有多少小时和分钟
  let timeRemaining = closingTime - currentTime; // 下班时间18 - 当前时间 = 差值
  let hours = Math.floor(timeRemaining / anHour); // 剩余小时
  let minutes = Math.floor((timeRemaining % anHour) / (1000 * 60)); // 剩余分钟
  let seconds = Math.floor((timeRemaining % anHour) % (1000 * 60) / 1000); // 剩余秒
  return { state, hours, minutes, seconds }
}



/** 下班时间倒计时 */
function countdownToWorkFun () {
  const { state, hours, minutes, seconds } = calculateTimeUntilClosing()
  if (state) {
    $('.countdownToWork').text('兄弟，下班时间到了！准备下班，记得打卡！')
    return
  }
  $('.countdownToWork .hour').text(hours);
  $('.countdownToWork .min').text(minutes);
  $('.countdownToWork .seconds').text(seconds);
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
  //计算分钟的余数秒
  // let shengyuS = parseInt(zhuanHS % 60)
  $('.weekendCountdown .day').text(shengyuD)
  $('.weekendCountdown .hour').text(shengyuH)
  $('.weekendCountdown .min').text(shengyuM)
}
