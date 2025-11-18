const userAgents: any = [
  {
    title: 'Android',
    values: [
      {
        title: 'Android (14) Browser - Pixel 8',
        value:
          'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
        platform: 'Linux armv8l',
      },
      {
        title: 'Android (13) Browser - Samsung Galaxy S23',
        value:
          'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
        platform: 'Linux armv8l',
      },
      {
        title: 'Android (12) Browser - OnePlus 10 Pro',
        value:
          'Mozilla/5.0 (Linux; Android 12; KB2005) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
        platform: 'Linux armv8l',
      },
      {
        title: 'Android (11) Browser - Xiaomi Mi 11',
        value:
          'Mozilla/5.0 (Linux; Android 11; Mi 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
        platform: 'Linux armv8l',
      },
      {
        title: 'Android Tablet (13) - Samsung Galaxy Tab S8',
        value:
          'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        platform: 'Linux armv8l',
      },
    ],
  },
  {
    title: 'BlackBerry',
    values: [
      {
        title: 'BlackBerry - BB10',
        value:
          'Mozilla/5.0 (BB10; Touch) AppleWebKit/537.1+ (KHTML, like Gecko) Version/10.0.0.1337 Mobile Safari/537.1+',
        platform: 'BlackBerry',
      },
      {
        title: 'BlackBerry - PlayBook 2.1',
        value:
          'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML, like Gecko) Version/7.2.1.0 Safari/536.2+',
        platform: 'BlackBerry',
      },
      {
        title: 'BlackBerry - 9900',
        value:
          'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0.187 Mobile Safari/534.11+',
        platform: 'BlackBerry',
      },
    ],
  },
  {
    title: 'Chrome',
    values: [
      {
        title: 'Chrome - Android Mobile',
        value:
          'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
        platform: 'Linux armv8l',
      },
      {
        title: 'Chrome - Android Mobile (high-end)',
        value:
          'Mozilla/5.0 (Linux; Android 13; Samsung Galaxy S23) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
        platform: 'Linux armv8l',
      },
      {
        title: 'Chrome - Android Tablet',
        value:
          'Mozilla/5.0 (Linux; Android 13; Galaxy Tab S8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        platform: 'Linux armv8l',
      },
      {
        title: 'Chrome - iPhone',
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.0.0 Mobile/15E148 Safari/604.1',
        platform: 'iPhone',
      },
      {
        title: 'Chrome - iPad',
        value:
          'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.0.0 Mobile/15E148 Safari/604.1',
        platform: 'iPad',
      },
      {
        title: 'Chrome - Chrome OS',
        value:
          'Mozilla/5.0 (X11; CrOS x86_64 15393.58.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        platform: 'Linux X86_64',
      },
      {
        title: 'Chrome - Mac',
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        platform: 'MacIntel',
      },
      {
        title: 'Chrome - Windows',
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        platform: 'Win32',
      },
    ],
  },
  {
    title: 'Firefox',
    values: [
      {
        title: 'Firefox - Android Mobile',
        value:
          'Mozilla/5.0 (Android 14; Mobile; rv:125.0) Gecko/125.0 Firefox/125.0',
        platform: 'Linux armv8l',
      },
      {
        title: 'Firefox - Android Tablet',
        value:
          'Mozilla/5.0 (Android 13; Tablet; rv:125.0) Gecko/125.0 Firefox/125.0',
        platform: 'Linux armv8l',
      },
      {
        title: 'Firefox - iPhone',
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/125.0 Mobile/15E148 Safari/604.1',
        platform: 'iPhone',
      },
      {
        title: 'Firefox - iPad',
        value:
          'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/125.0 Mobile/15E148 Safari/604.1',
        platform: 'iPad',
      },
      {
        title: 'Firefox - Mac',
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0',
        platform: 'MacIntel',
      },
      {
        title: 'Firefox - Windows',
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
        platform: 'Win32',
      },
    ],
  },
  {
    title: 'Brave',
    values: [
      {
        title: 'Brave - Android Mobile',
        value:
          'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Brave/1.65.122',
        platform: 'Linux armv8l',
      },
      {
        title: 'Brave - iPhone',
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.0.0 Mobile/15E148 Safari/604.1 Brave/1.65.122',
        platform: 'iPhone',
      },
      {
        title: 'Brave - iPad',
        value:
          'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.0.0 Mobile/15E148 Safari/604.1 Brave/1.65.122',
        platform: 'iPad',
      },
      {
        title: 'Brave - Mac',
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Brave/1.65.122',
        platform: 'MacIntel',
      },
      {
        title: 'Brave - Windows',
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Brave/1.65.122',
        platform: 'Win32',
      },
    ],
  },
  {
    title: 'Googlebot',
    values: [
      {
        title: 'Googlebot',
        value:
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        platform: 'Android',
      },
      {
        title: 'Googlebot Desktop',
        value:
          'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/142.0.0.0 Safari/537.36',
        platform: 'Android',
      },
      {
        title: 'Googlebot Smartphone',
        value:
          'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        platform: 'Android',
      },
    ],
  },
  {
    title: 'Internet Explorer',
    values: [
      {
        title: 'Internet Explorer 11',
        value:
          'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
        platform: 'Win32',
      },
      {
        title: 'Internet Explorer 10',
        value:
          'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
        platform: 'Win32',
      },
      {
        title: 'Internet Explorer 9',
        value:
          'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
        platform: 'Win32',
      },
      {
        title: 'Internet Explorer 8',
        value:
          'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
        platform: 'Win32',
      },
      {
        title: 'Internet Explorer 7',
        value: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
        platform: 'Win32',
      },
    ],
  },
  {
    title: 'Microsoft Edge',
    values: [
      {
        title: 'Microsoft Edge (Chromium) - Windows',
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0',
        platform: 'Win32',
      },
      {
        title: 'Microsoft Edge (Chromium) - Mac',
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0',
        platform: 'MacIntel',
      },
      {
        title: 'Microsoft Edge - iPhone',
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 EdgiOS/125.0.2535.52 Mobile/15E148 Safari/604.1',
        platform: 'iPhone',
      },
      {
        title: 'Microsoft Edge - iPad',
        value:
          'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 EdgiOS/125.0.2535.52 Mobile/15E148 Safari/605.1.15',
        platform: 'iPad',
      },
      {
        title: 'Microsoft Edge - Android Mobile',
        value:
          'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 EdgA/142.0.0.0',
        platform: 'Linux armv8l',
      },
      {
        title: 'Microsoft Edge - Android Tablet',
        value:
          'Mozilla/5.0 (Linux; Android 13; Galaxy Tab S8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 EdgA/142.0.0.0',
        platform: 'Linux armv8l',
      },
      {
        title: 'Microsoft Edge (EdgeHTML) - Windows',
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19042',
        platform: 'Win32',
      },
      {
        title: 'Microsoft Edge (EdgeHTML) - XBox',
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19041',
        platform: 'Win32',
      },
    ],
  },
  {
    title: 'Opera',
    values: [
      {
        title: 'Opera - Android Mobile',
        value:
          'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 OPR/109.0.0.0',
        platform: 'Linux armv8l',
      },
      {
        title: 'Opera - Mac',
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 OPR/109.0.0.0',
        platform: 'MacIntel',
      },
      {
        title: 'Opera - Windows',
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 OPR/109.0.0.0',
        platform: 'Win32',
      },
      {
        title: 'Opera (Presto) - Mac',
        value:
          'Opera/9.80 (Macintosh; Intel Mac OS X 10.14.1) Presto/2.12.388 Version/12.16',
        platform: 'MacIntel',
      },
      {
        title: 'Opera (Presto) - Windows',
        value: 'Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.16',
        platform: 'Win32',
      },
      {
        title: 'Opera Mobile - Android Mobile',
        value:
          'Opera/12.02 (Android 4.1; Linux; Opera Mobi/ADR-1111101157; U; en-US) Presto/2.9.201 Version/12.02',
        platform: 'Linux armv7l',
      },
      {
        title: 'Opera Mini - iOS',
        value:
          'Opera/9.80 (iPhone; Opera Mini/8.0.0/34.2336; U; en) Presto/2.8.119 Version/11.10',
        platform: 'iPhone',
      },
    ],
  },
  {
    title: 'Safari',
    values: [
      {
        title: 'Safari - iPad iOS 17.4',
        value:
          'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
        platform: 'iPad',
      },
      {
        title: 'Safari - iPhone iOS 17.4',
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
        platform: 'iPhone',
      },
      {
        title: 'Safari - Mac',
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
        platform: 'MacIntel',
      },
    ],
  },
  {
    title: 'UC Browser',
    values: [
      {
        title: 'UC Browser - Android Mobile',
        value:
          'Mozilla/5.0 (Linux; Android 13; en-US; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/108.0.0.0 UCBrowser/13.4.2.1122 Mobile Safari/537.36',
        platform: 'Linux armv7l',
      },
      {
        title: 'UC Browser - iOS',
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X; zh-CN) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16B92 UCBrowser/13.4.0.1119 Mobile AliApp(TUnionSDK/0.1.20.3)',
        platform: 'iPhone',
      },
      {
        title: 'UC Browser - Windows Phone',
        value:
          'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920) UCBrowser/10.1.0.563 Mobile',
        platform: 'Win32',
      },
    ],
  },
  {
    title: 'Vivaldi',
    values: [
      {
        title: 'Vivaldi - Android Mobile',
        value:
          'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Vivaldi/6.7.3329.46',
        platform: 'Linux armv8l',
      },
      {
        title: 'Vivaldi - Mac',
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Vivaldi/6.7.3329.46',
        platform: 'MacIntel',
      },
      {
        title: 'Vivaldi - Windows',
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Vivaldi/6.7.3329.46',
        platform: 'Win32',
      },
    ],
  },
  {
    title: 'Samsung Internet',
    values: [
      {
        title: 'Samsung Internet - Android Mobile',
        value:
          'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 SamsungBrowser/23.0.0.6',
        platform: 'Linux armv8l',
      },
      {
        title: 'Samsung Internet - Android Tablet',
        value:
          'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 SamsungBrowser/23.0.0.6',
        platform: 'Linux armv8l',
      },
    ],
  },
]

export default userAgents
