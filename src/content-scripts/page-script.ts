/**
 * 页面脚本 - 在页面上下文中运行
 * 
 * 这个脚本会被注入到页面的主线程中,拦截 Worker 创建
 */

interface VytalConfig {
  userAgent?: string
  platform?: string
  timezone?: string
  locale?: string
  lat?: number
  lon?: number
}

(function() {
  'use strict';
  
  let VYTAL_CONFIG: VytalConfig = {};
  let configLoaded = false;
  
  console.log('[Vytal Page] Script loaded, waiting for config...');
  
  // ========== 隐藏自动化特征 ==========
  // 必须在最开始就执行,防止被检测
  
  // 1. 隐藏 navigator.webdriver
  try {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    // 无法修改,忽略
    console.warn('[Vytal] Failed to hide navigator.webdriver:', e);
  }
  
  // 2. 隐藏 Chrome 自动化特征
  // 删除 window.cdc_ 开头的属性 (ChromeDriver)
  Object.keys(window).forEach(key => {
    if (key.startsWith('cdc_') || key.startsWith('$cdc_') || key.startsWith('__webdriver')) {
      try {
        (window as any)[key] = undefined;
        delete (window as any)[key];
      } catch (e) {
        // Ignore
      }
    }
  });
  
  // 3. 隐藏 __webdriver_script_fn
  try {
    (window as any)['__webdriver_script_fn'] = undefined;
    delete (window as any)['__webdriver_script_fn'];
  } catch (e) {}
  
  // 4. 隐藏 chrome.runtime (可选 - 某些检测会查找这个)
  // 注意: chrome.runtime 的存在对于普通扩展是正常的
  // 大多数检测工具不会仅因为这个就判定为自动化
  // 所以这一步可以跳过,避免破坏功能
  
  // 5. 隐藏 __nightmare (Nightmare.js)
  try {
    (window as any)['__nightmare'] = undefined;
    delete (window as any)['__nightmare'];
  } catch (e) {}
  
  // 6. 隐藏 _phantom / callPhantom (PhantomJS)
  try {
    (window as any)['_phantom'] = undefined;
    (window as any)['callPhantom'] = undefined;
    delete (window as any)['_phantom'];
    delete (window as any)['callPhantom'];
  } catch (e) {}
  
  // 7. 隐藏 Buffer (Node.js 环境)
  if (typeof (window as any).Buffer !== 'undefined') {
    try {
      (window as any)['Buffer'] = undefined;
      delete (window as any)['Buffer'];
    } catch (e) {}
  }
  
  console.log('[Vytal Page] Automation features hidden');
  
  // ========== 原有的 Worker 拦截代码 ==========
  
  // 保存原始构造函数(在最外层)
  const OriginalWorker = window.Worker;
  const OriginalSharedWorker = window.SharedWorker;
  
  // 生成注入代码(在外层定义,这样可以在任何地方使用)
  function generateInjectionCode() {
    // 使用字符串字面量避免 JSON.stringify 的问题
    const configStr = JSON.stringify(VYTAL_CONFIG);
    return `
// Vytal Worker Injection - MUST run first
(function() {
  'use strict';
  console.log('[Vytal Worker] === Injection Starting ===');
  
  const config = ${configStr};
  console.log('[Vytal Worker] Config received:', config);
  
  // ========== 隐藏自动化特征 (Worker 环境) ==========
  
  // 1. 隐藏 navigator.webdriver
  try {
    const navProto = Object.getPrototypeOf(navigator);
    Object.defineProperty(navProto, 'webdriver', {
      get: () => undefined,
      configurable: true,
      enumerable: true
    });
  } catch (e) {}
  
  // 2. 删除 cdc_ 等自动化标识
  try {
    Object.keys(self).forEach(key => {
      if (key.startsWith('cdc_') || key.startsWith('$cdc_') || key.startsWith('__webdriver')) {
        delete self[key];
      }
    });
  } catch (e) {}
  
  // ========== 欺骗 Navigator 属性 ==========
  
  // 立即检查当前值
  console.log('[Vytal Worker] BEFORE - navigator.platform:', navigator.platform);
  console.log('[Vytal Worker] BEFORE - navigator.userAgent:', navigator.userAgent);
  console.log('[Vytal Worker] BEFORE - navigator.webdriver:', navigator.webdriver);
  
  // Worker 环境中没有 Navigator 构造函数,需要直接修改 navigator 对象
  // 获取 navigator 的原型
  const navigatorProto = Object.getPrototypeOf(navigator);
  
  if (config.platform) {
    try {
      // 删除原有的描述符(如果存在)
      delete navigatorProto.platform;
      
      // 安装新的 getter,使用箭头函数确保始终返回配置值
      Object.defineProperty(navigatorProto, 'platform', {
        get: () => config.platform,
        set: () => {}, // 防止被覆盖
        configurable: false, // 防止被删除
        enumerable: true
      });
      console.log('[Vytal Worker] ✓ Platform descriptor installed');
    } catch (e) {
      console.error('[Vytal Worker] ✗ Failed to install platform:', e);
      // 如果 configurable: false 失败,尝试 configurable: true
      try {
        Object.defineProperty(navigatorProto, 'platform', {
          get: () => config.platform,
          configurable: true,
          enumerable: true
        });
        console.log('[Vytal Worker] ✓ Platform descriptor installed (fallback)');
      } catch (e2) {
        console.error('[Vytal Worker] ✗ Fallback also failed:', e2);
      }
    }
  }
  
  if (config.userAgent) {
    try {
      delete navigatorProto.userAgent;
      
      Object.defineProperty(navigatorProto, 'userAgent', {
        get: () => config.userAgent,
        set: () => {},
        configurable: false,
        enumerable: true
      });
      console.log('[Vytal Worker] ✓ UserAgent descriptor installed');
    } catch (e) {
      console.error('[Vytal Worker] ✗ Failed to install userAgent:', e);
      try {
        Object.defineProperty(navigatorProto, 'userAgent', {
          get: () => config.userAgent,
          configurable: true,
          enumerable: true
        });
        console.log('[Vytal Worker] ✓ UserAgent descriptor installed (fallback)');
      } catch (e2) {
        console.error('[Vytal Worker] ✗ Fallback also failed:', e2);
      }
    }
  }
  
  if (config.locale) {
    try {
      delete navigatorProto.language;
      delete navigatorProto.languages;
      
      Object.defineProperty(navigatorProto, 'language', {
        get: () => config.locale,
        set: () => {},
        configurable: false,
        enumerable: true
      });
      Object.defineProperty(navigatorProto, 'languages', {
        get: () => [config.locale],
        set: () => {},
        configurable: false,
        enumerable: true
      });
      console.log('[Vytal Worker] ✓ Locale descriptors installed');
    } catch (e) {
      console.error('[Vytal Worker] ✗ Failed to install locale:', e);
      try {
        Object.defineProperty(navigatorProto, 'language', {
          get: () => config.locale,
          configurable: true,
          enumerable: true
        });
        Object.defineProperty(navigatorProto, 'languages', {
          get: () => [config.locale],
          configurable: true,
          enumerable: true
        });
        console.log('[Vytal Worker] ✓ Locale descriptors installed (fallback)');
      } catch (e2) {
        console.error('[Vytal Worker] ✗ Fallback also failed:', e2);
      }
    }
  }
  
  // 验证修改是否生效
  console.log('[Vytal Worker] AFTER - navigator.platform:', navigator.platform);
  console.log('[Vytal Worker] AFTER - navigator.userAgent:', navigator.userAgent);
  console.log('[Vytal Worker] AFTER - navigator.language:', navigator.language);
  console.log('[Vytal Worker] === Injection Complete ===');
})();

`;
  }
  
  // 创建修改后的 Worker (尝试 fetch 原始内容)
  function createModifiedWorker(scriptURL: string | URL, options?: WorkerOptions): Promise<string> {
    const injectionCode = generateInjectionCode();
    const url = typeof scriptURL === 'string' ? scriptURL : scriptURL.toString();
    
    console.log('[Vytal] Creating modified worker for URL:', url);
    
    // 尝试 fetch 原始脚本内容
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      })
      .then(originalCode => {
        console.log('[Vytal] Fetched original worker code, length:', originalCode.length);
        // 注入代码 + 原始代码
        const fullCode = injectionCode + '\n\n// === Original Worker Code ===\n' + originalCode;
        const blob = new Blob([fullCode], { type: 'application/javascript' });
        const blobURL = URL.createObjectURL(blob);
        console.log('[Vytal] Created blob URL with injected code');
        return blobURL;
      })
      .catch(error => {
        // Fallback: 使用 importScripts
        console.warn('[Vytal] Failed to fetch worker script, falling back to importScripts:', error);
        const fallbackCode = injectionCode + '\n\nimportScripts("' + url + '");';
        const blob = new Blob([fallbackCode], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
      });
  }
  
  // 尝试立即读取配置(如果已经存在)
  function tryLoadConfig() {
    const configElement = document.getElementById('vytal-config-data');
    if (configElement) {
      VYTAL_CONFIG = JSON.parse(configElement.getAttribute('data-config') || '{}');
      configLoaded = true;
      console.log('[Vytal Page] Config loaded:', VYTAL_CONFIG);
      return true;
    }
    return false;
  }
  
  // 安装拦截器 - 可以多次调用以更新配置
  function installInterceptors() {
    console.log('[Vytal Page] Installing interceptors with config:', VYTAL_CONFIG);
    
    // 即使没有配置也安装拦截器,这样可以占位
    // 当配置到达时会重新安装
    const VytalWorker = class VytalWorker extends OriginalWorker {
      constructor(scriptURL: string | URL, options?: WorkerOptions) {
        // 检查当前是否有配置
        if (!VYTAL_CONFIG.platform && !VYTAL_CONFIG.userAgent) {
          // 没有配置,直接使用原始 Worker
          console.log('[Vytal] No config yet, using original Worker');
          super(scriptURL, options);
          return;
        }
        
        // 有配置,创建修改后的 Worker
        console.log('[Vytal] Intercepting Worker creation for:', scriptURL);
        
        // 将相对 URL 转换为绝对 URL
        const absoluteURL = typeof scriptURL === 'string' 
          ? new URL(scriptURL, window.location.href).href 
          : scriptURL.toString();
        
        const loaderCode = `
          const injectionCode = ${JSON.stringify(generateInjectionCode())};
          const originalURL = ${JSON.stringify(absoluteURL)};
          
          console.log('[Vytal Worker Loader] Starting with URL:', originalURL);
          
          // 先执行注入代码
          eval(injectionCode);
          
          // 然后加载原始脚本
          try {
            importScripts(originalURL);
            console.log('[Vytal Worker Loader] Original script loaded successfully');
          } catch (e) {
            console.error('[Vytal Worker Loader] Failed to import original script:', e);
          }
        `;
        
        const blob = new Blob([loaderCode], { type: 'application/javascript' });
        const blobURL = URL.createObjectURL(blob);
        
        super(blobURL, options);
      }
    };
    
    // === 关键修复: 隐藏 Worker 被替换的痕迹 ===
    
    // 1. 设置正确的函数名
    Object.defineProperty(VytalWorker, 'name', {
      value: 'Worker',
      configurable: true
    });
    
    // 2. 复制原型链
    Object.setPrototypeOf(VytalWorker, OriginalWorker);
    Object.setPrototypeOf(VytalWorker.prototype, OriginalWorker.prototype);
    
    // 3. 复制所有原始属性
    Object.getOwnPropertyNames(OriginalWorker).forEach(prop => {
      if (prop !== 'prototype' && prop !== 'length' && prop !== 'name') {
        try {
          const descriptor = Object.getOwnPropertyDescriptor(OriginalWorker, prop);
          if (descriptor) {
            Object.defineProperty(VytalWorker, prop, descriptor);
          }
        } catch (e) {
          // Ignore
        }
      }
    });
    
    // 4. 修改 toString 使其看起来像原生代码
    VytalWorker.toString = function() {
      return 'function Worker() { [native code] }';
    };
    
    VytalWorker.prototype.constructor.toString = function() {
      return 'function Worker() { [native code] }';
    };
    
    // 使用 defineProperty 来替换 window.Worker
    Object.defineProperty(window, 'Worker', {
      value: VytalWorker,
      writable: true,
      configurable: true,
      enumerable: false  // 原生的 Worker 是不可枚举的
    });
    
    // === SharedWorker 同样处理 ===
    const VytalSharedWorker = class VytalSharedWorker extends OriginalSharedWorker {
      constructor(scriptURL: string | URL, options?: string | WorkerOptions) {
        if (!VYTAL_CONFIG.platform && !VYTAL_CONFIG.userAgent) {
          console.log('[Vytal] No config yet, using original SharedWorker');
          super(scriptURL, options);
          return;
        }
        
        console.log('[Vytal] Intercepting SharedWorker creation for:', scriptURL);
        
        const absoluteURL = typeof scriptURL === 'string' 
          ? new URL(scriptURL, window.location.href).href 
          : scriptURL.toString();
        
        const loaderCode = `
          const injectionCode = ${JSON.stringify(generateInjectionCode())};
          const originalURL = ${JSON.stringify(absoluteURL)};
          
          console.log('[Vytal SharedWorker Loader] Starting with URL:', originalURL);
          
          eval(injectionCode);
          
          try {
            importScripts(originalURL);
            console.log('[Vytal SharedWorker Loader] Original script loaded successfully');
          } catch (e) {
            console.error('[Vytal SharedWorker Loader] Failed to import original script:', e);
          }
        `;
        
        const blob = new Blob([loaderCode], { type: 'application/javascript' });
        const blobURL = URL.createObjectURL(blob);
        
        super(blobURL, options);
      }
    };
    
    // 隐藏 SharedWorker 被替换的痕迹
    Object.defineProperty(VytalSharedWorker, 'name', {
      value: 'SharedWorker',
      configurable: true
    });
    
    Object.setPrototypeOf(VytalSharedWorker, OriginalSharedWorker);
    Object.setPrototypeOf(VytalSharedWorker.prototype, OriginalSharedWorker.prototype);
    
    Object.getOwnPropertyNames(OriginalSharedWorker).forEach(prop => {
      if (prop !== 'prototype' && prop !== 'length' && prop !== 'name') {
        try {
          const descriptor = Object.getOwnPropertyDescriptor(OriginalSharedWorker, prop);
          if (descriptor) {
            Object.defineProperty(VytalSharedWorker, prop, descriptor);
          }
        } catch (e) {}
      }
    });
    
    VytalSharedWorker.toString = function() {
      return 'function SharedWorker() { [native code] }';
    };
    
    VytalSharedWorker.prototype.constructor.toString = function() {
      return 'function SharedWorker() { [native code] }';
    };
    
    Object.defineProperty(window, 'SharedWorker', {
      value: VytalSharedWorker,
      writable: true,
      configurable: true,
      enumerable: false
    });
    
    console.log('[Vytal Page] Worker interceptors installed/updated');
  }
  
  // ===  关键修复: 立即安装拦截器,不等待配置 ===
  // 即使配置还没加载,也先安装拦截器(使用空配置)
  // 这样可以确保在页面创建 Worker 之前就已经准备好了
  installInterceptors();
  console.log('[Vytal Page] Interceptors installed immediately (before config)');
  
  // 监听配置就绪事件 - 重新安装拦截器以使用新配置
  window.addEventListener('vytal-config-ready', () => {
    if (tryLoadConfig()) {
      // 配置到达后,重新安装拦截器
      // 之前创建的 Worker 已经使用了旧配置,但新创建的会使用新配置
      installInterceptors();
      console.log('[Vytal Page] Interceptors re-installed with config');
    }
  });
  
  // 也尝试立即加载配置(以防事件已经触发)
  if (tryLoadConfig()) {
    installInterceptors();
    console.log('[Vytal Page] Interceptors re-installed with immediate config');
  }
})();
