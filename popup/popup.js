/* 发生消息到 ContentScript */
function sendMessageToContentScript (message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}

// $("#httpBtn").click(function () {
//   const obj = {
//     form: 'popup',
//     title: '我是我是popup！',
//     actions: 'test'
//   }
//   // 参数1 发生数据，参数2 回掉函数获取返回的数据
//   sendMessageToContentScript(obj, function (response) {
//     console.log('来自content-script（index.js）的回复：' + response);
//     if (response) {
//       alert(response.msg)
//     }
//   });
// });