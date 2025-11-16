/**
 * Content Script 入口
 * 
 * 运行在页面上下文的隔离环境中，负责：
 * 1. 注入页面脚本到主线程
 * 2. 拦截 Web Worker 创建
 * 3. 同步 navigator.platform 等属性到 Worker
 */

import './main-injector'

console.log('[Vytal Content Script] Loaded successfully')
