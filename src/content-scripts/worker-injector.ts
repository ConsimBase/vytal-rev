/**
 * Web Worker 注入脚本
 * 
 * 由于 Chrome Debugger API 无法注入到 Web Worker 中，
 * 我们需要在 Worker 创建之前拦截并注入修改后的代码
 */

interface SpoofConfig {
  userAgent?: string
  platform?: string
  timezone?: string
  locale?: string
  lat?: number
  lon?: number
}

// 从 storage 获取配置
let spoofConfig: SpoofConfig = {}

// 初始化配置
chrome.storage.local.get(
  ['userAgent', 'platform', 'timezone', 'locale', 'lat', 'lon'],
  (storage) => {
    spoofConfig = {
      userAgent: storage.userAgent,
      platform: storage.platform,
      timezone: storage.timezone,
      locale: storage.locale,
      lat: storage.lat ? parseFloat(storage.lat) : undefined,
      lon: storage.lon ? parseFloat(storage.lon) : undefined,
    }
  }
)

// 监听配置变化
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if (changes.userAgent) spoofConfig.userAgent = changes.userAgent.newValue
    if (changes.platform) spoofConfig.platform = changes.platform.newValue
    if (changes.timezone) spoofConfig.timezone = changes.timezone.newValue
    if (changes.locale) spoofConfig.locale = changes.locale.newValue
    if (changes.lat) spoofConfig.lat = parseFloat(changes.lat.newValue)
    if (changes.lon) spoofConfig.lon = parseFloat(changes.lon.newValue)
  }
})

/**
 * 生成 Worker 注入代码
 */
function generateWorkerInjectionCode(): string {
  const config = JSON.stringify(spoofConfig)
  
  return `
(function() {
  'use strict';
  
  const spoofConfig = ${config};
  
  // 保存原始属性
  const originalNavigator = self.navigator;
  const originalPlatform = Object.getOwnPropertyDescriptor(Navigator.prototype, 'platform');
  const originalUserAgent = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgent');
  
  // 重写 navigator.platform
  if (spoofConfig.platform) {
    try {
      Object.defineProperty(Navigator.prototype, 'platform', {
        get: function() {
          return spoofConfig.platform;
        },
        configurable: true,
        enumerable: true
      });
      console.debug('[Vytal Worker] Platform spoofed to:', spoofConfig.platform);
    } catch (e) {
      console.error('[Vytal Worker] Failed to spoof platform:', e);
    }
  }
  
  // 重写 navigator.userAgent
  if (spoofConfig.userAgent) {
    try {
      Object.defineProperty(Navigator.prototype, 'userAgent', {
        get: function() {
          return spoofConfig.userAgent;
        },
        configurable: true,
        enumerable: true
      });
      console.debug('[Vytal Worker] UserAgent spoofed to:', spoofConfig.userAgent);
    } catch (e) {
      console.error('[Vytal Worker] Failed to spoof userAgent:', e);
    }
  }
  
  // 重写 navigator.language / languages
  if (spoofConfig.locale) {
    try {
      Object.defineProperty(Navigator.prototype, 'language', {
        get: function() {
          return spoofConfig.locale;
        },
        configurable: true,
        enumerable: true
      });
      
      Object.defineProperty(Navigator.prototype, 'languages', {
        get: function() {
          return [spoofConfig.locale];
        },
        configurable: true,
        enumerable: true
      });
      console.debug('[Vytal Worker] Language spoofed to:', spoofConfig.locale);
    } catch (e) {
      console.error('[Vytal Worker] Failed to spoof language:', e);
    }
  }
  
  console.log('[Vytal Worker] Injection complete');
})();
`
}

/**
 * 拦截 Worker 构造函数
 */
function injectWorkerInterceptor() {
  const script = document.createElement('script')
  script.textContent = `
(function() {
  'use strict';
  
  // 保存原始 Worker 构造函数
  const OriginalWorker = Worker;
  const OriginalSharedWorker = SharedWorker;
  
  // 拦截 Worker
  window.Worker = class extends OriginalWorker {
    constructor(scriptURL, options) {
      console.log('[Vytal] Intercepting Worker:', scriptURL);
      
      // 获取注入代码
      window.postMessage({ type: 'VYTAL_GET_WORKER_INJECTION', url: scriptURL }, '*');
      
      // 调用原始构造函数
      super(scriptURL, options);
    }
  };
  
  // 拦截 SharedWorker
  window.SharedWorker = class extends OriginalSharedWorker {
    constructor(scriptURL, options) {
      console.log('[Vytal] Intercepting SharedWorker:', scriptURL);
      
      window.postMessage({ type: 'VYTAL_GET_WORKER_INJECTION', url: scriptURL }, '*');
      
      super(scriptURL, options);
    }
  };
  
  // 保留原型链
  Object.setPrototypeOf(window.Worker, OriginalWorker);
  Object.setPrototypeOf(window.SharedWorker, OriginalSharedWorker);
  
  console.log('[Vytal] Worker interceptor installed');
})();
`
  
  // 在页面加载之前注入
  const parent = document.head || document.documentElement
  parent.insertBefore(script, parent.firstChild)
  script.remove()
}

/**
 * 使用 Blob URL 方式注入
 */
function setupBlobInjection() {
  // 监听来自页面的消息
  window.addEventListener('message', (event) => {
    if (event.source !== window) return
    
    if (event.data.type === 'VYTAL_GET_WORKER_INJECTION') {
      console.log('[Vytal Content] Preparing injection for worker:', event.data.url)
      
      // 这里可以进一步处理，例如修改 Worker URL
      // 但由于 Worker 已经创建，我们使用更底层的方法
    }
  })
}

// 主入口
function init() {
  console.log('[Vytal Content] Initializing worker injector')
  
  // 尽早注入，在任何脚本执行之前
  injectWorkerInterceptor()
  setupBlobInjection()
}

// 立即执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// 导出供其他模块使用
export { generateWorkerInjectionCode, spoofConfig }
