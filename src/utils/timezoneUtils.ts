// 时区格式转换工具

// 不同API的时区格式映射
const timezoneFormats = {
  // ip-api.com: "Asia/Shanghai"
  // ip.sb: "Asia/Shanghai" 
  // ip2location.io: "+08:00"
  // ipapi.is: "Asia/Shanghai"
};

// 根据国家代码获取可能的时区列表
const getTimezoneByCountry = (countryCode: string): string[] => {
  const countryTimezones: Record<string, string[]> = {
    // 北美洲
    'US': ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu'],
    'CA': ['America/Toronto', 'America/Vancouver', 'America/Edmonton', 'America/Winnipeg', 'America/Halifax'],
    'MX': ['America/Mexico_City'],
    
    // 南美洲
    'BR': ['America/Sao_Paulo'],
    'AR': ['America/Argentina/Buenos_Aires'],
    'CL': ['America/Santiago'],
    'CO': ['America/Bogota'],
    'PE': ['America/Lima'],
    'VE': ['America/Caracas'],
    'EC': ['America/Guayaquil'],
    'UY': ['America/Montevideo'],
    'PY': ['America/Asuncion'],
    'BO': ['America/La_Paz'],
    
    // 欧洲
    'GB': ['Europe/London'],
    'DE': ['Europe/Berlin'],
    'FR': ['Europe/Paris'],
    'IT': ['Europe/Rome'],
    'ES': ['Europe/Madrid'],
    'RU': ['Europe/Moscow', 'Asia/Yekaterinburg', 'Asia/Novosibirsk'],
    'NL': ['Europe/Amsterdam'],
    'BE': ['Europe/Brussels'],
    'CH': ['Europe/Zurich'],
    'SE': ['Europe/Stockholm'],
    'NO': ['Europe/Oslo'],
    'FI': ['Europe/Helsinki'],
    'DK': ['Europe/Copenhagen'],
    'PL': ['Europe/Warsaw'],
    'CZ': ['Europe/Prague'],
    'HU': ['Europe/Budapest'],
    'AT': ['Europe/Vienna'],
    'GR': ['Europe/Athens'],
    'PT': ['Europe/Lisbon'],
    'IE': ['Europe/Dublin'],
    'UA': ['Europe/Kiev'],
    'RO': ['Europe/Bucharest'],
    'BG': ['Europe/Sofia'],
    'HR': ['Europe/Zagreb'],
    'SK': ['Europe/Bratislava'],
    'SI': ['Europe/Ljubljana'],
    'LT': ['Europe/Vilnius'],
    'LV': ['Europe/Riga'],
    'EE': ['Europe/Tallinn'],
    
    // 亚洲
    'CN': ['Asia/Shanghai'],
    'JP': ['Asia/Tokyo'],
    'KR': ['Asia/Seoul'],
    'IN': ['Asia/Kolkata'],
    'ID': ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'],
    'TH': ['Asia/Bangkok'],
    'VN': ['Asia/Ho_Chi_Minh'],
    'PH': ['Asia/Manila'],
    'MY': ['Asia/Kuala_Lumpur'],
    'SG': ['Asia/Singapore'],
    'HK': ['Asia/Hong_Kong'],
    'TW': ['Asia/Taipei'],
    'PK': ['Asia/Karachi'],
    'BD': ['Asia/Dhaka'],
    'LK': ['Asia/Colombo'],
    'NP': ['Asia/Kathmandu'],
    'MM': ['Asia/Yangon'],
    'KH': ['Asia/Phnom_Penh'],
    'LA': ['Asia/Vientiane'],
    'MN': ['Asia/Ulaanbaatar'],
    'KZ': ['Asia/Almaty'],
    'UZ': ['Asia/Tashkent'],
    'SA': ['Asia/Riyadh'],
    'AE': ['Asia/Dubai'],
    'QA': ['Asia/Qatar'],
    'OM': ['Asia/Muscat'],
    'KW': ['Asia/Kuwait'],
    'BH': ['Asia/Bahrain'],
    'IL': ['Asia/Jerusalem'],
    'JO': ['Asia/Amman'],
    'LB': ['Asia/Beirut'],
    'TR': ['Europe/Istanbul'],
    
    // 非洲
    'ZA': ['Africa/Johannesburg'],
    'NG': ['Africa/Lagos'],
    'EG': ['Africa/Cairo'],
    'KE': ['Africa/Nairobi'],
    'MA': ['Africa/Casablanca'],
    'TN': ['Africa/Tunis'],
    'DZ': ['Africa/Algiers'],
    'GH': ['Africa/Accra'],
    'ET': ['Africa/Addis_Ababa'],
    'CI': ['Africa/Abidjan'],
    'SD': ['Africa/Khartoum'],
    'UG': ['Africa/Kampala'],
    'TZ': ['Africa/Dar_es_Salaam'],
    'MZ': ['Africa/Maputo'],
    'ZW': ['Africa/Harare'],
    'AO': ['Africa/Luanda'],
    'CM': ['Africa/Douala'],
    'SN': ['Africa/Dakar'],
    
    // 大洋洲
    'AU': ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane', 'Australia/Perth', 'Australia/Darwin'],
    'NZ': ['Pacific/Auckland'],
    'FJ': ['Pacific/Fiji'],
    'PG': ['Pacific/Port_Moresby'],
    'SB': ['Pacific/Guadalcanal'],
    
    // 中东
    'IR': ['Asia/Tehran'],
    'IQ': ['Asia/Baghdad'],
    'SY': ['Asia/Damascus'],
    'YE': ['Asia/Aden'],
    
    // 加勒比地区
    'CU': ['America/Havana'],
    'DO': ['America/Santo_Domingo'],
    'HT': ['America/Port-au-Prince'],
    'JM': ['America/Jamaica'],
    'TT': ['America/Port_of_Spain'],
    
    // 中美洲
    'CR': ['America/Costa_Rica'],
    'PA': ['America/Panama'],
    'GT': ['America/Guatemala'],
    'HN': ['America/Tegucigalpa'],
    'SV': ['America/El_Salvador'],
    'NI': ['America/Managua'],
    
    // 其他
    'IS': ['Atlantic/Reykjavik'],
    'GL': ['America/Godthab', 'America/Scoresbysund', 'America/Thule'],
    'FK': ['Atlantic/Stanley']
  };

  return countryTimezones[countryCode] || ['UTC'];
};

// 解析偏移量字符串为分钟数
const parseOffset = (offset: string): number => {
  const match = offset.match(/^([+-])(\d{1,2}):(\d{2})$/);
  if (!match) return 0;
  
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2]);
  const minutes = parseInt(match[3]);
  
  return sign * (hours * 60 + minutes);
};

// 获取时区的偏移量（分钟）
const getTimezoneOffset = (timezone: string): number => {
  const date = new Date();
  const timezoneOffset = new Date(date.toLocaleString('en-US', { timeZone: timezone })).getTimezoneOffset();
  return -timezoneOffset; // 转换为UTC+偏移量
};

// 将时区格式转换为标准的IANA时区格式
const convertToIanaTimezone = (timezone: string, countryCode?: string): string => {
  if (!timezone) return 'UTC';

  // 如果是IANA格式，直接返回
  if (timezone.includes('/')) {
    return timezone;
  }

  // 如果是偏移量格式（如+08:00），转换为IANA格式
  if (timezone.match(/^[+-]\d{1,2}:\d{2}$/)) {
    return offsetToIanaTimezone(timezone, countryCode);
  }

  // 如果是缩写格式（如CST、PST），尝试转换为IANA
  if (timezone.match(/^[A-Z]{3,4}$/)) {
    return abbreviationToIanaTimezone(timezone, countryCode);
  }

  // 默认返回UTC
  return 'UTC';
};

// 将偏移量格式转换为IANA时区
const offsetToIanaTimezone = (offset: string, countryCode?: string): string => {
  const offsetValue = parseOffset(offset);
  
  // 基于国家代码和偏移量查找最可能的时区
  if (countryCode) {
    const countryZones = getTimezoneByCountry(countryCode);
    const matchingZone = countryZones.find(zone => 
      Math.abs(getTimezoneOffset(zone) - offsetValue) < 60 // 1小时内的误差
    );
    if (matchingZone) return matchingZone;
  }

  // 基于偏移量查找通用时区
  const commonZones = getCommonTimezonesByOffset(offsetValue);
  return commonZones[0] || 'UTC';
};

// 将时区缩写转换为IANA时区
const abbreviationToIanaTimezone = (abbr: string, countryCode?: string): string => {
  const abbreviationMap: Record<string, string> = {
    'EST': 'America/New_York',
    'EDT': 'America/New_York',
    'CST': 'America/Chicago',
    'CDT': 'America/Chicago',
    'MST': 'America/Denver',
    'MDT': 'America/Denver',
    'PST': 'America/Los_Angeles',
    'PDT': 'America/Los_Angeles',
    'GMT': 'Etc/GMT',
    'UTC': 'UTC',
    'CET': 'Europe/Paris',
    'CEST': 'Europe/Paris',
    'EET': 'Europe/Bucharest',
    'EEST': 'Europe/Bucharest',
    'IST': 'Asia/Kolkata',
    'JST': 'Asia/Tokyo',
    'KST': 'Asia/Seoul',
    'HKT': 'Asia/Hong_Kong',
    'SGT': 'Asia/Singapore',
    'AWST': 'Australia/Perth',
    'ACST': 'Australia/Darwin',
    'AEST': 'Australia/Sydney',
    'NZST': 'Pacific/Auckland'
  };

  // 优先使用国家相关的时区
  if (countryCode) {
    const countrySpecific = getCountrySpecificTimezone(abbr, countryCode);
    if (countrySpecific) return countrySpecific;
  }

  return abbreviationMap[abbr.toUpperCase()] || 'UTC';
};

// 根据偏移量获取常见的时区
const getCommonTimezonesByOffset = (offsetMinutes: number): string[] => {
  const offsetHours = offsetMinutes / 60;
  
  const commonZones: Record<number, string[]> = {
    [-12]: ['Pacific/Pago_Pago'],
    [-11]: ['Pacific/Pago_Pago'],
    [-10]: ['Pacific/Honolulu'],
    [-9]: ['America/Anchorage'],
    [-8]: ['America/Los_Angeles'],
    [-7]: ['America/Denver'],
    [-6]: ['America/Chicago'],
    [-5]: ['America/New_York'],
    [-4]: ['America/Puerto_Rico'],
    [-3]: ['America/Sao_Paulo'],
    [-2]: ['America/Noronha'],
    [-1]: ['Atlantic/Azores'],
    [0]: ['UTC', 'Europe/London'],
    [1]: ['Europe/Paris', 'Europe/Berlin'],
    [2]: ['Europe/Athens', 'Europe/Bucharest'],
    [3]: ['Europe/Moscow'],
    [4]: ['Asia/Dubai'],
    [5]: ['Asia/Karachi'],
    [5.5]: ['Asia/Kolkata'],
    [6]: ['Asia/Dhaka'],
    [7]: ['Asia/Bangkok'],
    [8]: ['Asia/Shanghai', 'Asia/Singapore'],
    [9]: ['Asia/Tokyo', 'Asia/Seoul'],
    [10]: ['Australia/Sydney'],
    [11]: ['Pacific/Guadalcanal'],
    [12]: ['Pacific/Auckland'],
    [13]: ['Pacific/Apia']
  };

  // 查找最接近的偏移量
  const roundedOffset = Math.round(offsetHours * 2) / 2; // 四舍五入到0.5小时
  return commonZones[roundedOffset] || ['UTC'];
};

// 获取国家特定的时区（处理缩写冲突）
const getCountrySpecificTimezone = (abbr: string, countryCode: string): string | null => {
  const countrySpecific: Record<string, Record<string, string>> = {
    'CST': {
      'CN': 'Asia/Shanghai',
      'US': 'America/Chicago',
      'AU': 'Australia/Adelaide',
      'MX': 'America/Mexico_City',
      'CA': 'America/Regina',
      'TW': 'Asia/Taipei',
      'HK': 'Asia/Hong_Kong'
    },
    'EST': {
      'US': 'America/New_York',
      'AU': 'Australia/Brisbane',
      'CA': 'America/Toronto',
      'MX': 'America/Cancun',
      'BR': 'America/Fortaleza'
    },
    'PST': {
      'US': 'America/Los_Angeles',
      'CA': 'America/Vancouver',
      'MX': 'America/Tijuana'
    },
    'MST': {
      'US': 'America/Denver',
      'CA': 'America/Edmonton',
      'MX': 'America/Chihuahua'
    },
    'AST': {
      'US': 'America/Puerto_Rico',
      'CA': 'America/Halifax',
      'BS': 'America/Nassau',
      'DO': 'America/Santo_Domingo'
    },
    'HST': {
      'US': 'Pacific/Honolulu',
      'UM': 'Pacific/Midway'
    },
    'IST': {
      'IN': 'Asia/Kolkata',
      'IE': 'Europe/Dublin',
      'IL': 'Asia/Jerusalem'
    },
    'GMT': {
      'GB': 'Europe/London',
      'IE': 'Europe/Dublin',
      'PT': 'Europe/Lisbon',
      'IS': 'Atlantic/Reykjavik'
    },
    'CET': {
      'DE': 'Europe/Berlin',
      'FR': 'Europe/Paris',
      'IT': 'Europe/Rome',
      'ES': 'Europe/Madrid',
      'NL': 'Europe/Amsterdam'
    },
    'EET': {
      'GR': 'Europe/Athens',
      'RO': 'Europe/Bucharest',
      'BG': 'Europe/Sofia',
      'UA': 'Europe/Kiev',
      'FI': 'Europe/Helsinki'
    },
    'WET': {
      'PT': 'Europe/Lisbon',
      'MA': 'Africa/Casablanca',
      'ES': 'Europe/Las_Palmas'
    },
    'AEST': {
      'AU': 'Australia/Sydney',
      'PG': 'Pacific/Port_Moresby'
    },
    'ACST': {
      'AU': 'Australia/Adelaide' // 澳大利亚中部标准时间
    },
    'AWST': {
      'AU': 'Australia/Perth',
      'SG': 'Asia/Singapore'
    },
    'NZST': {
      'NZ': 'Pacific/Auckland',
      'FJ': 'Pacific/Fiji'
    },
    'SST': {
      'WS': 'Pacific/Apia',
      'US': 'Pacific/Pago_Pago'
    },
    'CHST': {
      'GU': 'Pacific/Guam',
      'MP': 'Pacific/Saipan'
    },
    'AKST': {
      'US': 'America/Anchorage' // 阿拉斯加标准时间
    },
    'HAST': {
      'US': 'Pacific/Honolulu',
      'UM': 'Pacific/Midway'
    }
  };

  return countrySpecific[abbr.toUpperCase()]?.[countryCode] || null;
};

// 统一的时区格式化函数，优先使用API时区，如果没有再使用算法
const formatTimezone = (timezone: string, countryCode?: string): string => {
  // 如果API提供了有效的时区数据，并且是IANA格式，直接使用
  if (timezone && timezone !== 'UTC' && timezone !== '' && timezone.includes('/')) {
    return timezone;
  }
  
  // 如果API提供了偏移量格式（如+08:00），转换为IANA格式
  if (timezone && timezone.match(/^[+-]\d{1,2}:\d{2}$/)) {
    return convertToIanaTimezone(timezone, countryCode);
  }
  
  // 如果API提供了缩写格式，转换为IANA格式
  if (timezone && timezone.match(/^[A-Z]{3,4}$/)) {
    return convertToIanaTimezone(timezone, countryCode);
  }
  
  // 如果没有时区数据，使用算法从国家代码推断
  if (countryCode) {
    const countryZones = getTimezoneByCountry(countryCode);
    if (countryZones.length > 0) {
      return countryZones[0]; // 返回该国家最常见的时区
    }
  }
  
  // 默认返回UTC
  return 'UTC';
};

// 获取时区的显示名称
const getTimezoneDisplayName = (timezone: string): string => {
  if (!timezone || timezone === 'UTC') return 'UTC';
  
  // 简化显示名称
  const parts = timezone.split('/');
  if (parts.length === 2) {
    return parts[1].replace('_', ' ');
  }
  
  return timezone;
};

export {
  convertToIanaTimezone,
  formatTimezone,
  getTimezoneDisplayName,
  parseOffset,
  getTimezoneOffset
};