const httpBtn = document.getElementById("httpBtn");
if (httpBtn) {
  httpBtn.onclick = function () {
    // alert('显示一下。。')
    // createHttpDialog("所有http请求");


    // console.log(window);
    //  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   chrome.tabs.sendMessage(
    //    tabs[0].id,
    //    {
    //     // url: chrome.runtime.getURL("images/stars.jpeg"),
    //     imageDivId: `${guidGenerator()}`,
    //     tabId: tabs[0].id
    //    },
    //    function (response) {
    //     window.close();
    //    }
    //   );
    //   function guidGenerator () {
    //    const S4 = function () {
    //     return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    //    };
    //    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    //   }
    // });
  };
}

/* 发生消息到 ContentScript */
function sendMessageToContentScript (message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}
// 显示注入脚本拦截到的http请求
$("#httpBtn").click(function () {
  const obj = {
    form: 'popup',
    title: '我是我是popup！',
    actions: 'test'
  }
  // 参数1 发生数据，参数2 回掉函数获取返回的数据
  sendMessageToContentScript(obj, function (response) {
    console.log('来自content-script（index.js）的回复：' + response);
    if (response) {
      alert(response.msg)
    }
  });
});