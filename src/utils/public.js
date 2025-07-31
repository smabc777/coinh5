// 页面公共函数
import router from '@/router/index'
import { useI18n } from 'vue-i18n'
import { useMainStore } from '@/store/index'
import dayjs from '@/plugin/dayjs/index'
import { customRef, ref } from 'vue'
import { PLATFORM_12HOURFORMAT } from '@/config'
import { i18nInstance } from "@/plugin/i18n/index";

/**
 * 获取配置
 */
export const _getConfig = (key) => {
    let value = ''
    if (key) {
        value = window.__config[key] || ''
    }
    return value
}
/**
 * 页面跳转
 * @param {*} path
 * @param {*} parmas
 */
export const _toView = (path, params = {}) => {
    if (path) {
        router.push(path)
    } else if (params.path || params.name) {
        router.push(params)
    }
}

/**
 * 页面跳转
 * @param {*} path
 */
export const _toReplace = (path) => {
    if (path) {
        router.replace(path)
    }
}
/**
 * 页面后退
 */
export const _back = (num = -1) => {
    if (window.history.length <= 1) {
        _toReplace('/')
    } else {
        router.go(num)
    }
}

/**
 * 多语言 平台定制化
 * @param {*} path
 * @param {*} parmas
 */
export const _t18 = (name, platform = [], i18n = null) => {
    if (!name) return "";
    if (platform.includes(__config._APP_ENV)) {
      return i18nInstance?.global?.t(`${__config._APP_ENV}_${name}`);
    } else {
      return i18nInstance?.global?.t(name);
    }
  };

/**
 * 千分位金额格式化
 * @param {*} val
 * @returns
 */
export const _numberWithCommas = (val, type) => {
    if (!isNaN(Number(val))) {
        let v = Math.floor(val * 100) / 100
        const parts = `${type ? v : val}`.split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return parts.join('.')
    }
    return val
}

/**
 * 时间格式化
 */
export const _timeFormat = (time, expression = '', flag = false) => {
    const mainStore = useMainStore()
    // console.log('时间', time, mainStore.timezone, mainStore.timeFormat)
    let tempExpression = mainStore.timeFormat

    if (['bydfe'].includes(_getConfig('_APP_ENV'))) {
        tempExpression = 'DD/MM/YYYY'
    }

    if (flag) {
        tempExpression = expression || tempExpression
    } else {
        tempExpression = tempExpression + ` ${expression || 'HH:mm:ss'}`
    }
    if (['bitmake'].includes(__config._APP_ENV)) {
        tempExpression = tempExpression.replace('YYYY', 'BBBB')
    }
    if (PLATFORM_12HOURFORMAT.includes(__config._APP_ENV)) {
        tempExpression = tempExpression.replace('HH:mm', 'hh:mm')
        tempExpression += ' a'
    }
    if (['cmmetrics'].includes(__config._APP_ENV)) {
        console.log(time, dayjs(time).tz().format(tempExpression), 'dayjs(time).tz().format(tempExpression)');

        return dayjs(time).tz().format(tempExpression)
    }

    // console.log('格式化前', time)
    // console.log('格式化后', dayjs(time).tz(mainStore.timezone).format(tempExpression))
    return dayjs(time).tz(mainStore.timezone).format(tempExpression)
}
/**
 * 时间格式化 KLine
 */
export const _klineTimeFormat = (time, expression = '', flag = false) => {

    const mainStore = useMainStore()
    console.log(mainStore.timezone, time, 'nnnnnnnnn');

    let tempExpression = mainStore.timeFormat
    if (flag) {
        tempExpression = expression || tempExpression
    } else {
        tempExpression = tempExpression + ` ${expression || 'HH:mm:ss'}`
    }
    return dayjs(time).tz(mainStore.timezone).format(tempExpression)
}

/**
 * 隐藏数字
 */
export const _hide = (num) => {
    return '******'
}

/**
 * 隐藏钱包地址中间部分
 */
export const _hideAddress = (str, startLength = 4, EndLength = 4, betwixtLength = 4) => {

    if (!str?.length) return ''

    //前后长度
    let temp = str.toString()
    let subtemp = temp.substring(startLength, temp.length - EndLength)

    // 星号处理
    let hide = ''
    for (let i = 0; i < betwixtLength; i++) {
        hide += '*'
    }

    return temp.replace(subtemp, hide)
}

/**
 * 股票涨跌
 * 涨幅比例 maRate
 * stock_rise 涨 stock_fall 跌 stock_draw 平
 */
export const _isStockRFD = (maRate) => {
    let tempVal = ''
    maRate = Number(maRate)
    if (maRate > 0) {
        tempVal = 'stock_rise'
    } else if (maRate < 0) {
        tempVal = 'stock_fall'
    } else if (maRate == 0) {
        tempVal = 'stock_draw'
    }
    return tempVal
}

/**
 * 买涨买跌 规则
 * @param {*} open 开盘价
 * @param {*} close 关盘价
 * @param {*} direction 方向 buy 买(默认) sell 卖
 * @param {*} default 默认
 * @returns rise 涨 fall 跌 draw 平
 */
export const _isRFD = (open, close, direction = 'buy', def = 'draw') => {
    let tempVal = ''
    open = Number(open)
    close = Number(close)
    if (isNaN(open) || isNaN(close)) {
        return 'draw'
    }
    if (open < close) {
        // buy 涨 sell 跌D
        if (direction == 'buy') {
            tempVal = 'rise'
        } else if (direction == 'sell') {
            tempVal = 'fall'
        }
    } else if (open > close) {
        // buy 跌 sell 涨
        if (direction == 'buy') {
            tempVal = 'fall'
        } else if (direction == 'sell') {
            tempVal = 'rise'
        }
    } else if (open == close) {
        // buy sell 平
        tempVal = def
    }

    return tempVal
}

/**
 * 根据配置时区  获取时间
 */
export const _getDateD = (time = new Date(), year = 0) => {
    const mainStore = useMainStore()
    mainStore.setTimeZone()
    return dayjs(time).tz(mainStore.timezone).add(year, 'year').$d
}


/**
 * 涨跌 规则
 * @param {*} price 价格
 * @param {*} direction 方向 buy 买(默认) sell 卖
 * @param {*} default 默认
 * @returns rise 涨 fall 跌 draw 平
 */
export const _isRFDE = (price, direction = 'buy', def = 'draw') => {
    let tempVal = ''
    price = Number(price)
    if (0 < price) {
        // buy 涨 sell 跌D
        if (direction == 'buy') {
            tempVal = 'rise'
        } else if (direction == 'sell') {
            tempVal = 'fall'
        }
    } else if (0 > price) {
        // buy 跌 sell 涨
        if (direction == 'buy') {
            tempVal = 'fall'
        } else if (direction == 'sell') {
            tempVal = 'rise'
        }
    } else if (0 == price) {
        // buy sell 平
        tempVal = def
    }

    return tempVal
}

/**
 * 数据处理1
 *  usdt->usdt
 *  btc->btcusdt
 */
export const filterCoin = (item) => {
    item = item.toLocaleLowerCase()
    if (item == 'usdt') {
        return item
    } else {
        return item + 'usdt'
    }
}
/**
 * 数据处理2
 *  usdt->usdt
 *  btcusdt->btc
 */
export const filterCoin2 = (item) => {
    item = item.toLocaleLowerCase()
    if (item == 'usdt') {
        return item
    } else {
        return item.replace('usdt', '').trim()
    }
}
/**
 * 充值币种处理
 * rechargeBtc->BTC
 * rechargeUsdtTrc->USDT-TRC
 */
export const filterRechargeToAddress = (item) => {
    item = item.toLocaleLowerCase()
    if (item.includes('rechargeusdt')) {
        return item.replace('rechargeusdt', 'usdt-').trim().toLocaleUpperCase()
    } else if (item.includes('recharge')) {
        return item.replace('recharge', '').trim().toLocaleUpperCase()
    } else {
        return item.toLocaleUpperCase()
    }
}

let timer = null
// 无参数节流
export const debounce = (fn, wait = 3000) => {
    if (timer === null) {
        fn()
        timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
        }, wait)
    }
}
/**
 * 防抖
 * @param {*} value
 * @param {*} duratinon
 * @returns
 */
export const debounceRef = (value, duratinon = 1000) => {
    let timer
    return customRef((track, trigger) => {
        return {
            get() {
                track()
                return value
            },
            set(val) {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    value = val
                    trigger()
                }, duratinon)
            }
        }
    })
}

/**
 * 节流
 * @param {*} value
 * @param {*} duratinon
 * @returns
 */
export const throttleRef = (value, duratinon = 300) => {
    let timer
    return duratinon == null
        ? ref(value)
        : customRef((track, trigger) => {
            return {
                get() {
                    track()
                    return value
                },
                set(val) {
                    if (timer == null) {
                        timer = setTimeout(() => {
                            // 修改数据
                            value = val
                            // 派发更新
                            trigger()
                            // 清除定时器
                            clearTimeout(timer)
                            timer = null
                        }, duratinon)
                    }
                }
            }
        })
}
// 简易钱包检测方法
export const checkWalletSupport = () => {
  // 检测以太坊钱包 (MetaMask等)
  const hasEthereum = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  
  // 检测Solana钱包 (Phantom等)
  const hasSolana = typeof window !== 'undefined' && typeof window.solana !== 'undefined';
  
  // 检测波场钱包 (TronLink等)
  const hasTron = typeof window !== 'undefined' && 
    (typeof window.tronWeb !== 'undefined' || typeof window.tronLink !== 'undefined');
  
  return hasEthereum || hasSolana || hasTron;
};