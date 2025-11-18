const attachDebugger = (tabId: number) => {
  // 验证 tabId 有效性
  if (!tabId || tabId < 0) {
    console.warn('[Vytal] Invalid tabId:', tabId)
    return
  }

  chrome.storage.local.get(
    [
      'ipData',
      'timezone',
      'timezoneMatchIP',
      'lat',
      'latitudeMatchIP',
      'lon',
      'longitudeMatchIP',
      'locale',
      'localeMatchIP',
      'userAgent',
      'platform',
      'locationBrowserDefault',
      'userAgentBrowserDefault',
    ],
    (storage) => {
      // 检查 storage 是否有效
      if (chrome.runtime.lastError) {
        console.error('[Vytal] Storage read error:', chrome.runtime.lastError)
        return
      }

      if (
        (storage.timezone ||
          storage.lat ||
          storage.lon ||
          storage.locale ||
          storage.userAgent) &&
        ((storage.locationBrowserDefault !== undefined && !storage.locationBrowserDefault) || 
         (storage.userAgentBrowserDefault !== undefined && !storage.userAgentBrowserDefault))
      ) {
        chrome.debugger.attach({ tabId: tabId }, '1.3', () => {
          if (chrome.runtime.lastError) {
            // 忽略已附加的错误和特殊URL访问错误，记录其他错误
            if (!chrome.runtime.lastError.message?.includes('Another debugger is already attached') &&
                !chrome.runtime.lastError.message?.includes('Cannot access chrome://') &&
                !chrome.runtime.lastError.message?.includes('Cannot access edge://') &&
                !chrome.runtime.lastError.message?.includes('Cannot access opera://') &&
                !chrome.runtime.lastError.message?.includes('Cannot access brave://') &&
                !chrome.runtime.lastError.message?.includes('The extensions gallery cannot be scripted')) {
              console.error('[Vytal] Debugger attach error:', chrome.runtime.lastError.message)
            }
            return
          }

          try {
            if (!storage.locationBrowserDefault) {
              if (storage.timezone) {
                chrome.debugger.sendCommand(
                  { tabId: tabId },
                  'Emulation.setTimezoneOverride',
                  {
                    timezoneId: storage.timezone,
                  },
                  () => {
                    if (chrome.runtime.lastError) {
                      if (chrome.runtime.lastError.message?.includes('Timezone override is already in effect')) {
                        chrome.debugger.detach({ tabId }, () => {
                          // 忽略 detach 错误
                          if (chrome.runtime.lastError) {
                            console.debug('[Vytal] Detach after timezone error:', chrome.runtime.lastError.message)
                          }
                        })
                      } else {
                        console.error('[Vytal] Timezone override error:', chrome.runtime.lastError.message)
                      }
                    }
                  }
                )
              }

              if (storage.locale) {
                chrome.debugger.sendCommand(
                  { tabId: tabId },
                  'Emulation.setLocaleOverride',
                  {
                    locale: storage.locale,
                  },
                  () => {
                    if (chrome.runtime.lastError) {
                      console.error('[Vytal] Locale override error:', chrome.runtime.lastError.message)
                    }
                  }
                )
              }

              if (storage.lat || storage.lon) {
                // 验证坐标有效性
                const latitude = storage.lat ? parseFloat(storage.lat) : storage.ipData?.lat
                const longitude = storage.lon ? parseFloat(storage.lon) : storage.ipData?.lon

                if (isValidCoordinate(latitude, longitude)) {
                  chrome.debugger.sendCommand(
                    { tabId: tabId },
                    'Emulation.setGeolocationOverride',
                    {
                      latitude: latitude,
                      longitude: longitude,
                      accuracy: 1,
                    },
                    () => {
                      if (chrome.runtime.lastError) {
                        console.error('[Vytal] Geolocation override error:', chrome.runtime.lastError.message)
                      }
                    }
                  )
                } else {
                  console.warn('[Vytal] Invalid coordinates:', { latitude, longitude })
                }
              }
            }

            if (
              !storage.userAgentBrowserDefault &&
              (storage.userAgent || storage.platform)
            ) {
              chrome.debugger.sendCommand(
                { tabId: tabId },
                'Emulation.setUserAgentOverride',
                {
                  userAgent: storage.userAgent || navigator.userAgent,
                  platform: storage.platform || navigator.platform,
                },
                () => {
                  if (chrome.runtime.lastError) {
                    console.error('[Vytal] UserAgent override error:', chrome.runtime.lastError.message)
                  }
                }
              )
            }
          } catch (error) {
            console.error('[Vytal] Unexpected error in attachDebugger:', error)
            // 发生错误时尝试 detach
            chrome.debugger.detach({ tabId }, () => {
              // 忽略 detach 错误
            })
          }
        })
      }
    }
  )
}

// 辅助函数：验证坐标有效性
function isValidCoordinate(lat: number | undefined, lon: number | undefined): boolean {
  if (lat === undefined || lon === undefined) return false
  if (isNaN(lat) || isNaN(lon)) return false
  if (lat < -90 || lat > 90) return false
  if (lon < -180 || lon > 180) return false
  return true
}

export default attachDebugger
