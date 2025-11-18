import { formatTimezone } from './timezoneUtils'

// IP查询接口列表，按优先级排序
export const ipApis = [
  {
    name: 'ip-api',
    displayName: 'ip-api.com',
    url: 'http://ip-api.com/json?fields=status,message,country,countryCode,zip,lat,lon,timezone,isp,org,proxy,query',
    parser: (data: any) => {
      const countryCode = data.countryCode
      const timezone = formatTimezone(data.timezone, countryCode)
      return {
        status: data.status,
        country: data.country,
        countryCode: countryCode,
        zip: data.zip,
        lat: data.lat,
        lon: data.lon,
        timezone: timezone,
        isp: data.isp,
        org: data.org,
        proxy: data.proxy,
        query: data.query
      }
    }
  },
  {
    name: 'ip-sb',
    displayName: 'ip.sb',
    url: 'https://api.ip.sb/geoip/',
    parser: (data: any) => {
      const countryCode = data.country_code
      const timezone = formatTimezone(data.timezone, countryCode)
      return {
        status: 'success',
        country: data.country,
        countryCode: countryCode,
        zip: '',
        lat: data.latitude,
        lon: data.longitude,
        timezone: timezone,
        isp: data.isp,
        org: data.organization,
        proxy: data.asn_type === 'hosting' || data.asn_type === 'isp',
        query: data.ip
      }
    }
  },
  {
    name: 'ip2location',
    displayName: 'ip2location.io',
    url: 'https://api.ip2location.io/',
    parser: (data: any) => {
      const countryCode = data.country_code
      const timezone = formatTimezone(data.time_zone, countryCode)
      return {
        status: 'success',
        country: data.country_name,
        countryCode: countryCode,
        zip: data.zip_code || '',
        lat: data.latitude,
        lon: data.longitude,
        timezone: timezone,
        isp: data.as || '',
        org: data.as || '',
        proxy: data.is_proxy || false,
        query: data.ip
      }
    }
  },
  {
    name: 'ipapi-is',
    displayName: 'ipapi.is',
    url: 'https://api.ipapi.is',
    parser: (data: any) => {
      const countryCode = data.location?.country_code
      const timezone = formatTimezone(data.location?.timezone, countryCode)
      return {
        status: data.status || 'success',
        country: data.location?.country || '',
        countryCode: countryCode,
        zip: data.location?.zip || '',
        lat: data.location?.latitude || 0,
        lon: data.location?.longitude || 0,
        timezone: timezone,
        isp: data.company?.name || data.asn?.org || '',
        org: data.asn?.org || '',
        proxy: data.is_datacenter || data.is_proxy || data.is_vpn || false,
        query: data.ip
      }
    }
  }
]

// 统一的IP查询函数
const getIp = async (apiName?: string) => {
  const errors = []

  // 获取存储的API配置
  let selectedApiName = apiName
  if (!selectedApiName) {
    const storage = await chrome.storage.local.get(['ipApi'])
    selectedApiName = storage.ipApi
  }

  // 根据选择决定API列表
  let apiList = ipApis
  if (selectedApiName) {
    const selectedApi = ipApis.find(api => api.name === selectedApiName)
    if (selectedApi) {
      apiList = [selectedApi]
    }
  }

  for (const api of apiList) {
    try {
      console.log(`[Vytal] Trying IP API: ${api.name}`)

      const response = await fetch(api.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // 检查数据有效性
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format')
      }

      // 解析数据
      const ipData = api.parser(data)

      // 验证必要字段
      if (!ipData.query || !ipData.countryCode || !ipData.lat || !ipData.lon) {
        throw new Error('Missing required fields')
      }

      // 保存到存储
      chrome.storage.local.set({ ipData, ipApi: api.name })
      console.log(`[Vytal] Successfully got IP data from ${api.name}`)

      return ipData

    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? `${api.name}: ${error.message}` : `${api.name}: Unknown error`
      console.warn(`[Vytal] ${errorMsg}`)
      errors.push(errorMsg)

      // 继续尝试下一个API
      continue
    }
  }

  // 所有API都失败
  const errorMessage = `All IP APIs failed: ${errors.join('; ')}`
  console.error(`[Vytal] ${errorMessage}`)

  // 返回空的错误数据
  const errorData = {
    status: 'fail',
    message: errorMessage,
    query: 'Unknown',
    country: 'Unknown',
    countryCode: 'XX',
    zip: 'Unknown',
    lat: 0,
    lon: 0,
    timezone: 'UTC',
    isp: 'Unknown',
    org: 'Unknown',
    proxy: false
  }

  chrome.storage.local.set({ ipData: errorData })
  return errorData
}

export default getIp
