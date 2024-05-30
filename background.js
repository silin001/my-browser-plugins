console.log('my后台脚本已加载。');

const menuList = [
 {
  title: '打开百度一下',
  url: 'https://www.baidu.com',
  contexts: ['page'], // 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
  id: 'my0' // 这里的id必须是字符串
 },
 {
  title: '打开百度翻译',
  url: 'https://fanyi.baidu.com',
  id: 'my1'
 },
 {
  title: '打开高德地图',
  url: 'https://ditu.gaode.com',
  id: 'my2'
 },
]


// 创建扩展右键菜单
function createExtendMenu() {
 menuList.forEach((i, index) => {
  const { id, title, url } = i
  chrome.contextMenus.create({
   title,
   id
  });

  // 右键菜单事件绑定
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
   if (info.menuItemId === id) {
    chrome.tabs.create({ url });
   }
  });
 })
}
createExtendMenu()



// chrome.contextMenus.create({
//  title: '使用度娘搜索：%s', // %s表示选中的文字
//  contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
//  onclick: function (params) {
//   // 注意不能使用location.href，因为location是属于background的window对象
//   chrome.tabs.create({ url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText) });
//  }
// });