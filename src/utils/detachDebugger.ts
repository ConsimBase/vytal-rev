const detachDebugger = () => {
  try {
    chrome.debugger.getTargets((tabs) => {
      if (chrome.runtime.lastError) {
        console.error('[Vytal] getTargets error in detach:', chrome.runtime.lastError)
        return
      }

      if (!tabs || tabs.length === 0) {
        console.debug('[Vytal] No tabs to detach')
        return
      }

      let detachedCount = 0
      tabs.forEach((tab) => {
        if (tab.attached && tab.tabId && tab.tabId > 0) {
          chrome.debugger.detach({ tabId: tab.tabId }, () => {
            if (chrome.runtime.lastError) {
              // 忽略"未附加"的错误
              if (!chrome.runtime.lastError.message?.includes('not attached')) {
                console.error(`[Vytal] Detach error for tab ${tab.tabId}:`, chrome.runtime.lastError.message)
              }
            } else {
              detachedCount++
              console.debug(`[Vytal] Detached debugger from tab ${tab.tabId}`)
            }
          })
        }
      })

      if (detachedCount > 0) {
        console.log(`[Vytal] Detached debugger from ${detachedCount} tabs`)
      }
    })
  } catch (error) {
    console.error('[Vytal] Unexpected error in detachDebugger:', error)
  }
}

export default detachDebugger
