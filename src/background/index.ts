import attachDebugger from './attachDebugger'

// 检查URL是否可以被调试器访问
const isUrlAccessible = (url: string | undefined): boolean => {
  if (!url) return true // 允许没有URL的标签页（如新标签页）

  // 排除不能访问的特殊协议页面
  const restrictedProtocols = [
    'chrome://',           // Chrome内部页面
    'chrome-extension://',  // Chrome扩展页面
    'edge://',            // Edge内部页面
    'opera://',           // Opera内部页面
    'brave://',           // Brave内部页面
    'about:',             // 浏览器关于页面
    'data:',              // Data URI
    'blob:'               // Blob URI
  ]

  // 排除特殊的扩展商店页面
  const restrictedUrls = [
    'https://chrome.google.com/webstore',  // Chrome扩展商店
    'https://chromewebstore.google.com',   // 新版Chrome扩展商店
    'https://addons.mozilla.org',          // Firefox扩展商店
    'https://microsoftedge.microsoft.com/addons',  // Edge扩展商店
    'https://addons.opera.com'             // Opera扩展商店
  ]

  return !restrictedProtocols.some(protocol => url.startsWith(protocol)) && 
         !restrictedUrls.some(storeUrl => url.startsWith(storeUrl))
}

const attachTab = (tabId: number) => {
  if (!tabId || tabId < 0) {
    console.warn('[Vytal] Invalid tabId in attachTab:', tabId)
    return
  }

  try {
    // 先获取标签信息检查URL
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        console.error('[Vytal] get tab error:', chrome.runtime.lastError)
        return
      }

      // 检查URL是否可访问
      if (!isUrlAccessible(tab.url)) {
        console.debug(`[Vytal] Skipping debugger attach for restricted URL: ${tab.url}`)
        return
      }

      // URL可访问，继续尝试附加调试器
      chrome.debugger.getTargets((tabs) => {
        if (chrome.runtime.lastError) {
          console.error('[Vytal] getTargets error:', chrome.runtime.lastError)
          return
        }

        const currentTab = tabs.find((obj) => obj.tabId === tabId)
        if (!currentTab?.attached) {
          attachDebugger(tabId)
        }
      })
    })
  } catch (error) {
    console.error('[Vytal] Error in attachTab:', error)
  }
}

// 标签创建时附加调试器
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id && tab.id > 0) {
    // 检查URL是否可访问
    if (!isUrlAccessible(tab.url)) {
      console.debug(`[Vytal] Skipping debugger attach for new tab with restricted URL: ${tab.url}`)
      return
    }
    attachTab(tab.id)
  }
})

// 标签激活时附加调试器
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (activeInfo.tabId) {
    attachTab(activeInfo.tabId)
  }
})

// 标签更新时附加调试器
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 只在页面加载完成或 URL 变化时附加
  if (tabId && (changeInfo.status === 'loading' || changeInfo.url)) {
    // 检查URL是否可访问
    if (!isUrlAccessible(tab.url)) {
      console.debug(`[Vytal] Skipping debugger attach for updated tab with restricted URL: ${tab.url}`)
      return
    }
    attachTab(tabId)
  }
})

// 处理调试器分离事件
chrome.debugger.onDetach.addListener((source, reason) => {
  if (reason === 'target_closed') {
    // 标签关闭，正常情况
    console.debug('[Vytal] Debugger detached: target closed')
  } else if (reason === 'canceled_by_user') {
    // 用户取消，可能需要重新附加
    console.debug('[Vytal] Debugger detached by user')
  } else {
    console.warn('[Vytal] Debugger detached:', reason)
  }
})

// 扩展安装或更新时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Vytal] Extension installed')
  } else if (details.reason === 'update') {
    console.log('[Vytal] Extension updated to version', chrome.runtime.getManifest().version)
  }
})

// 扩展启动时附加所有现有标签
chrome.runtime.onStartup.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    if (chrome.runtime.lastError) {
      console.error('[Vytal] Query tabs error:', chrome.runtime.lastError)
      return
    }

    tabs.forEach((tab) => {
      if (tab.id && tab.id > 0) {
        attachTab(tab.id)
      }
    })
  })
})
