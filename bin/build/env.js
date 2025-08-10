const envList = {
  cmmetrics: {
    // 当前平台
    VITE_APP_ENV: 'cmmetrics',
    // 默认主题 light dark
    VITE_APP_PLEATFORM_THEME: 'light',
    // API
    VITE_APP_BASE_API: 'www.hyperliquid-us.com/h5-api',
    // 平台编号
    // VITE_APP_TENANT_ID: '201',
    // 完整标题
    VITE_APP_META_TITLE: 'Hyperliquid',
    // 交易所名称
    VITE_APP_EXCHANGE_NAME: 'Hyperliquid',
    // 缩写标题
    VITE_APP_META_TITLE_SUB: 'Hyperliquid',
    // 关键字
    VITE_APP_META_KEYWORDS: 'Hyperliquid',
    // 描述
    VITE_APP_META_DESCRIPTION: 'Hyperliquid',
    VITE_APP_BASE_WSS: 'wss://www.hyperliquid-us.com/h5-api',
    VITE_APP_META_BUILlD: 'cmmetrics-h5',
  },

}

module.exports = { envList }
