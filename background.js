console.log('my后台脚本已加载。');


// 右键菜单
chrome.contextMenus.create({
 title: "打开百度一下",
 onclick: function () {
  console.log(11111)
  // 注意不能使用location.href，因为location是属于background的window对象
  // chrome.tabs.create({ url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText) });
  chrome.tabs.create({ url: 'https://www.baidu.com' });
  chrome.tabs.executeScript(null, {
   code: `
                var kw = document.querySelector('#kw');
                kw.value = 'java';
                var but = document.querySelector('#su');
                but.click()
            `
  })
 }
});

chrome.runtime.onInstalled.addListener(function () {
 chrome.contextMenus.create({
  id: "openBaidu",
  title: "打开百度一下",
  contexts: ["selection"]
 });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
 if (info.menuItemId === "openBaidu") {
  chrome.tabs.create({ url: "https://www.baidu.com" });
 }
});