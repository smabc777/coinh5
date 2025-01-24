const envList = {
  dev: {
    // 当前平台
    VITE_APP_ENV: 'dev',
    // 默认主题 light dark
    VITE_APP_PLEATFORM_THEME: 'light',

    // STATIC API
    VITE_APP_STATIC_API: 'https://static.huashuo168.net',

    // API
    VITE_APP_BASE_API: "https://admin-api.alalei.xyz",
    // WSS
    VITE_APP_BASE_WSS: "wss://admin-api.alalei.xyz",
    // 完整标题
    VITE_APP_META_TITLE: 'DEV_TITLE',
    // 交易所名称
    VITE_APP_EXCHANGE_NAME: 'DEV',
    // 缩写标题
    VITE_APP_META_TITLE_SUB: 'DEV_TITLE_SUB',
    // 关键字
    VITE_APP_META_KEYWORDS: 'DEV_KEYWORDS',
    // 描述
    VITE_APP_META_DESCRIPTION: 'DEV_DESCRIPTION'

    // H5 URL
    // VITE_APP_PLANFORM_H5: 'https://h5-20-dark.hezong.cc/#/',
    // PC URL
    // VITE_APP_PLANFORM_PC: 'https://pc-20-dark.hezong.cc/#/'
  },
  dev_dark: {
    VITE_APP_ENV: 'dev_dark',
    VITE_APP_PLEATFORM_THEME: 'dark',

    // API
    VITE_APP_BASE_API: "https://admin-api.alalei.xyz",
    // WSS
    VITE_APP_BASE_WSS: "wss://admin-api.alalei.xyz",

    VITE_APP_META_TITLE: 'DEV_Dark',
    VITE_APP_EXCHANGE_NAME: 'DEV_Dark',
    VITE_APP_META_TITLE_SUB: 'DEV_Dark',
    VITE_APP_META_KEYWORDS: 'DEV_Dark_KEYWORDS',
    VITE_APP_META_DESCRIPTION: 'DEV_Dark_DESCRIPTION'
  },
  zhilian_dark: {
    VITE_APP_ENV: 'zhilian_dark',
    VITE_APP_PLEATFORM_THEME: 'dark',
    // API
    VITE_APP_BASE_API: "https://admin-api.alalei.xyz",
    // WSS
    VITE_APP_BASE_WSS: "wss://admin-api.alalei.xyz",
    VITE_APP_META_TITLE: 'ZHILIAN_Dark',
    VITE_APP_EXCHANGE_NAME: 'ZHILIAN_Dark',
    VITE_APP_META_TITLE_SUB: 'ZHILIAN_Dark',
    VITE_APP_META_KEYWORDS: 'ZHILIAN_Dark_KEYWORDS',
    VITE_APP_META_DESCRIPTION: 'ZHILIAN_Dark_DESCRIPTION'
  },
  zhilian_light: {
    VITE_APP_ENV: 'zhilian_light',
    VITE_APP_PLEATFORM_THEME: 'light',
    // API
    VITE_APP_BASE_API: "https://admin-api.alalei.xyz",
    // WSS
    VITE_APP_BASE_WSS: "wss://admin-api.alalei.xyz",
    VITE_APP_META_TITLE: 'ZHILIAN_Light',
    VITE_APP_EXCHANGE_NAME: 'ZHILIAN_Light',
    VITE_APP_META_TITLE_SUB: 'ZHILIAN_Light',
    VITE_APP_META_KEYWORDS: 'ZHILIAN_Light_KEYWORDS',
    VITE_APP_META_DESCRIPTION: 'ZHILIAN_Light_DESCRIPTION'
  },
  test_light: {
    VITE_APP_ENV: 'test_light',
    VITE_APP_PLEATFORM_THEME: 'light',

    // API
    VITE_APP_BASE_API: "https://admin-api.alalei.xyz",
    // WSS
    VITE_APP_BASE_WSS: "wss://admin-api.alalei.xyz",

    VITE_APP_META_TITLE: 'DEV_Light',
    VITE_APP_EXCHANGE_NAME: 'DEV_Light',
    VITE_APP_META_TITLE_SUB: 'DEV_Light',
    VITE_APP_META_KEYWORDS: 'DEV_Light_KEYWORDS',
    VITE_APP_META_DESCRIPTION: 'DEV_Light_DESCRIPTION'
  },
  test_dark: {
    VITE_APP_ENV: 'test_dark',
    VITE_APP_PLEATFORM_THEME: 'dark',

    // API
    VITE_APP_BASE_API: "https://admin-api.alalei.xyz",
    // WSS
    VITE_APP_BASE_WSS: "wss://admin-api.alalei.xyz",

    VITE_APP_META_TITLE: 'DEV_Dark',
    VITE_APP_EXCHANGE_NAME: 'DEV_Dark',
    VITE_APP_META_TITLE_SUB: 'DEV_Dark',
    VITE_APP_META_KEYWORDS: 'DEV_Dark',
    VITE_APP_META_DESCRIPTION: 'DEV_Dark_DESCRIPTION'
  },
  cmmetrics: {
    VITE_APP_ENV: 'cmmetrics',
    VITE_APP_PLEATFORM_THEME: 'dark',

    VITE_APP_META_TITLE: 'CMMetrics',
    VITE_APP_EXCHANGE_NAME: 'CoinMetrics',
    VITE_APP_META_TITLE_SUB: 'CMMetrics',
    VITE_APP_META_KEYWORDS: 'CMMetrics',
    VITE_APP_META_DESCRIPTION: 'CMMetrics',
    // API
    VITE_APP_BASE_API: "https://app-api.coinonomy1.com",
    // WSS
    VITE_APP_BASE_WSS: "wss://app-api.coinonomy1.com",

    VITE_APP_STATIC_API: "https://static.huashuo168.net"
  }
}

module.exports = { envList }
