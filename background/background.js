console.log('--- background.js 后台脚本已加载');
const menuList = [
  {
    title: '显示拦截的http请求',
    url: '',
    id: 'my3'
  },
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

// 创建右键按钮
createExtendMenu()
// 创建扩展右键菜单
function createExtendMenu () {
  menuList.forEach((i, index) => {
    const { id, title, url } = i
    // 创建右键菜单
    chrome.contextMenus.create({
      title,
      id
    });

    // 右键菜单事件绑定
    chrome.contextMenus.onClicked.addListener(function (info, tab) {
      if (info.menuItemId === id && id == 'my3') {
        console.log(tab)
        // 打开拦截http请求列表
        sendMessageToContentScript(tab.id, 'show_httplist')
      } else if (info.menuItemId === id) {
        chrome.tabs.create({ url });
      }

    });
  })
}






// 快捷键事件监听
chrome.commands.onCommand.addListener((command) => {
  console.log('🚀🚀 ~ chrome.commands.onCommand.addListener ~ command:', command)
  switch (command) {
    case "show_httplist":
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const activeTab = tabs[0];
          sendMessageToContentScript(activeTab.id, 'show_httplist')
        }
      });
      break;
    case "hide_httplist":
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const activeTab = tabs[0];
          sendMessageToContentScript(activeTab.id, 'hide_httplist')
        }
      });
      break;
    default:
      console.log('Unknown command:', command);
      break;
  }
});

/* 发送消息到其他脚本 */
function sendMessageToContentScript (tabId, actionstr) {
  const obj = {
    form: 'background',
    title: '我是我是background！',
    action: actionstr
  }
  // 因为当前文件和主页面文件不在同一上下文环境，所以在这里：发送消息、在content_scripts文件中监听
  chrome.tabs.sendMessage(tabId, obj);
}

