console.log('my后台脚本已加载。');


// 右键菜单
chrome.contextMenus.create({
 title: "打开百度一下",
 onclick: function () {
  // 注意不能使用location.href，因为location是属于background的window对象
  // chrome.tabs.create({ url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText) });
  chrome.tabs.create({ url: 'https://www.baidu.com'});
 }
});
