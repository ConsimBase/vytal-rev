import attachDebugger from './attachDebugger'

const attachTab = (tabId: number) => {
  if (!tabId || tabId < 0) {
    console.warn('[Vytal] Invalid tabId in attachTab:', tabId)
    return
  }

  try {
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
  } catch (error) {
    console.error('[Vytal] Error in attachTab:', error)
  }
}

// 标签创建时附加调试器
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id && tab.id > 0) {
    attachDebugger(tab.id)
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
