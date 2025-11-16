/**
 * 主页面注入脚本
 * 
 * 在主线程中注入代码，拦截 Worker 创建并注入修改
 */

interface SpoofConfig {
  userAgent?: string
  platform?: string
  timezone?: string
  locale?: string
  lat?: number
  lon?: number
}

let config: SpoofConfig = {}

// 获取配置
function loadConfig(): Promise<SpoofConfig> {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      ['userAgent', 'platform', 'timezone', 'locale', 'lat', 'lon', 'userAgentBrowserDefault'],
      (storage) => {
        if (chrome.runtime.lastError) {
          console.error('[Vytal] Failed to load config:', chrome.runtime.lastError)
          resolve({})
          return
        }
        
        // 只在非默认模式下才注入
        if (storage.userAgentBrowserDefault === false) {
          config = {
            userAgent: storage.userAgent,
            platform: storage.platform,
            timezone: storage.timezone,
            locale: storage.locale,
            lat: storage.lat ? parseFloat(storage.lat) : undefined,
            lon: storage.lon ? parseFloat(storage.lon) : undefined,
          }
        }
        
        resolve(config)
      }
    )
  })
}

/**
 * 注入到页面的脚本（在页面上下文中运行）
 * 立即注入，不等待配置加载
 */
function injectPageScript() {
  // 立即加载外部页面脚本，不等待配置
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('page-script.bundle.js')
  script.onload = () => {
    script.remove()
    console.log('[Vytal Content] Page script loaded')
  }
  script.onerror = (error) => {
    console.error('[Vytal Content] Failed to load page script:', error)
    script.remove()
  }
  
  // 在文档开始时注入
  const parent = document.head || document.documentElement
  if (parent) {
    parent.insertBefore(script, parent.firstChild)
    console.log('[Vytal Content] Page script injected immediately')
  }
}

/**
 * 通过自定义事件发送配置到页面上下文
 */
function sendConfigToPage(config: SpoofConfig) {
  // 创建隐藏的 DOM 元素传递配置
  const configElement = document.createElement('div')
  configElement.id = 'vytal-config-data'
  configElement.style.display = 'none'
  configElement.setAttribute('data-config', JSON.stringify(config))
  document.documentElement.appendChild(configElement)
  
  // 触发自定义事件通知配置已就绪
  window.dispatchEvent(new CustomEvent('vytal-config-ready'))
  
  // 清理
  setTimeout(() => configElement.remove(), 1000)
  console.log('[Vytal Content] Config sent to page context:', config)
}

// 立即注入页面脚本（同步，尽可能早）
injectPageScript()

// 初始化 - 异步加载配置并发送
async function init() {
  console.log('[Vytal Content] Initializing main injector')
  
  // 加载配置
  const cfg = await loadConfig()
  
  // 如果有配置，发送到页面上下文
  if (cfg.platform || cfg.userAgent) {
    sendConfigToPage(cfg)
  } else {
    console.log('[Vytal Content] No config to inject, skipping')
  }
}

// 尽早执行，在页面脚本之前
init()

// 监听配置变化
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    const hasRelevantChanges = 
      changes.userAgent || 
      changes.platform || 
      changes.userAgentBrowserDefault
    
    if (hasRelevantChanges) {
      console.log('[Vytal Content] Config changed, reloading page...')
      // 配置变化时重新加载页面以应用新配置
      window.location.reload()
    }
  }
})

export { loadConfig }
