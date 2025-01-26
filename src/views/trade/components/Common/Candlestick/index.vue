<template>
  <div>
    <div class="third">
      <div class="list">
        <div class="thirdLeft">
          <div :class="{
            'hightItem item ff-num': item.interval === currentInterval.interval,
            'item ff-num': true
          }" v-for="(item, index) in headIntervalList" :key="index" @click="checkedInterval(item)">
            {{ item.value }}
          </div>
        </div>

        <!-- 更多 -->
        <!-- <div
          class="thirdRight"
          v-show="currentCoinInfo.market != 'mt5'"
          @click="showMenu = !showMenu"
        >

          <div>{{ _t18(`exchange_more`) }}</div>
          <svg-load v-if="!showMenu" name="jiantou-x" class="thirdRightImg"></svg-load>
          <svg-load v-if="showMenu" name="jiantou-s" class="thirdRightImg"></svg-load>
        </div> -->
      </div>
    </div>
    <div class="selectTimes" v-if="showMenu" @touchmove.prevent @mousewheel.prevent @click="showMenu = false">
      <div class="times">
        <div v-for="(item, index) in menuIntervalList" :key="index"
          :class="{ hightItem: item.interval === currentInterval.interval, 'item ff-num': true }"
          @click="checkedInterval(item, 'menu')">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
  <div :id="klineId" class="candlestick"></div>
  <div class="studyList">
    <div :class="item.name === currentStudy ? 'hightItem studyItem' : 'studyItem'" v-for="(item, index) in studyList"
      :key="index" @click="setStudy(item.name)">
      {{ item.label }}
    </div>
  </div>
</template>
<script setup>
import { getKlineHistory } from '@/api/common/kline.js'
import Datafees from '@/config/kline/datafees.js'
import { getConfig, getIntervalList, getStudyList } from '@/config/kline/index.js'
import { _coinWebSocket } from '@/plugin/socket/index'
import { _t18, _klineTimeFormat, _timeFormat } from '@/utils/public'
import { socketDict } from '@/config/dict'
import PubSub from 'pubsub-js'
import { _add, _div, _mul, _sub, priceFormat } from '@/utils/decimal'
import _ from 'lodash'
import { computed, ref } from 'vue'
import { useMainStore } from '@/store'
import { useTradeStore } from '@/store/trade'
import { debounce, throttle } from 'lodash'
import dayjs from '@/plugin/dayjs/index'

//当前币种信息
const coinInfo = inject('coinInfo')


console.log(coinInfo.value,'coinInfocoinInfocoinInfocoinInfo');


const props = defineProps({
  /**
   * 类型
   * secondContract：秒合约
   * detail：详情
   */
  type: {
    type: String,
    default: 'detail'
  }
})
/**
 * 分辨率(k线图右侧刻度)
 */
const priceScale = computed(() => {
  let tempPricescale = 10000
  if (coinInfo.value?.amount > 100) {
    tempPricescale = 100
  } else if (coinInfo.value?.amount < 10) {
    tempPricescale = 1000000
  } else if (coinInfo.value?.amount < 100) {
    tempPricescale = 10000
  }
  return tempPricescale
})
/**
 * 临时交易(打开页面币种初始信息)
 */
const tempTrade = {
  time: '',
  amount: '',
  open: '',
  high: '',
  low: '',
  close: '',
  volume: '',
  lastClose: '',
  intervention: false
}
/**
 * 分辨率差
 */
const intervalDiff = ref('')
/**
 * 总分辨率列表
 */
const intervalList = getIntervalList()
/**
 * 指标列表
 */
const studyList = getStudyList()

const headIntervalList = reactive([])
const menuIntervalList = intervalList.filter((elem) => elem?.isMore)
const isActivated = ref(false) //是否第一次加载
const isDeactivated = ref(false) //是否第一次加载离开
/**
 * K线使用 分辨率列表
 */
let supportedResolutions = []
/**
 * 数据sdk实例
 */
let datafeeds = null
// 指标
let studies = reactive([])

/**
 * 当前symbol 切换时过渡
 */
let currentCoinInfo = reactive({})
/**
 * 当前interval 切换时过渡
 */
let currentInterval = reactive({})

/**
 * KLine
 */
const klineId = computed(() => `kline_${props.type}`)



let widget = null
const mainStore = useMainStore()
const tradeStore = useTradeStore()

/**
 * 交易对监听
 */
const eventTradeSymbolChange = debounce((e) => {
  //先销毁
  initRemove()
  //再初始化
  initialize()

  // 监听币种切换
  let symbol = e.detail.symbol
  let tempCoinInfo = e.detail.coinInfo
  // 分辨率改变
  let tempHeadIntervalList = getHeadIntervalList(tempCoinInfo)

  if (
    tempHeadIntervalList.map((elem) => elem.value).join() !=
    headIntervalList.map((elem) => elem.value).join()
  ) {
    // 判断分辨率是否一致
    supportedResolutions = getSupportedResolutions()
    headIntervalList.splice(0, headIntervalList.length, ...tempHeadIntervalList)
    Object.assign(currentInterval, headIntervalList[0])
  }

  showMenu.value = false


  // 设置币种
  setSymbol(symbol, currentInterval.interval, () => {
    tradeStore.setCurrentCoinList(currentCoinInfo.coin, 'remove')
    Object.assign(currentCoinInfo, coinInfo.value)
    tradeStore.setCurrentCoinList(currentCoinInfo.coin)
  })


}, 200)
/**
 * 获取分辨率
 */
const getSupportedResolutions = (tempCoinInfo = currentCoinInfo) => {
  let tempList = intervalList.map((elem) => elem.interval)
  if (tempCoinInfo?.market == 'mt5') {
    tempList = intervalList.filter((elem) => elem.market == 'mt5').map((elem) => elem.interval)
  }
  return tempList
}
/**
 * 获取分辨率显示菜单
 */

import { useRouter, useRoute } from "vue-router";

const router = useRouter()
const route = useRoute()
const getHeadIntervalList = (tempCoinInfo = currentCoinInfo) => {
  /* let tempList = intervalList.filter((elem) => !elem?.isMore)
  if (tempCoinInfo?.market == 'mt5' || tempCoinInfo?.coinType === 3) {
    tempList = intervalList.filter((elem) => elem.market == 'mt5')
  } else if (tempCoinInfo?.coinType === 5) {
    tempList = intervalList.filter((elem) => elem.marketnsdk == 'nsdk')
  } */
  let tempList = []
  tempList = intervalList.filter((elem) => {
    if (['smartfund'].includes(__config._APP_ENV)) {
      if (localStorage.getItem('tradeKey') == 'Ustandard') {
        return elem?.platform?.includes('smartfundU')
      } else if (localStorage.getItem('tradeKey') == 'BBTrading') {
        return elem?.platform?.includes('smartfundBB')
      }
    } else {
      return elem?.platform?.includes(__config._APP_ENV)
    }
  })
  if (tempList.length == 0) {
    tempList = intervalList.filter((elem) => elem?.default)
  }
  if (tempCoinInfo?.market == 'mt5' || tempCoinInfo?.coinType === 3) {
    tempList = intervalList.filter((elem) => elem.market == 'mt5')
  } else if (tempCoinInfo?.coinType === 5) {
    // 纳斯达克指数
    tempList = intervalList.filter((elem) => elem.marketnsdk == 'nsdk')
  }
  return tempList
}

const initialize = async () => {
  isActivated.value = true
  Object.assign(currentCoinInfo, coinInfo.value)
  tradeStore.setCurrentCoinList(currentCoinInfo.coin)
  supportedResolutions = getSupportedResolutions()
  headIntervalList.splice(0, headIntervalList.length, ...getHeadIntervalList())
  Object.assign(currentInterval, headIntervalList[0])
  if (['smartfund'].includes(__config._APP_ENV)) {
    headIntervalList.forEach((item, index) => {
      if (item.value == '1d') {
        Object.assign(currentInterval, headIntervalList[index])
      }
    })

  }

  document.addEventListener('event_tradeSymbolChange', eventTradeSymbolChange)
  nextTick(() => {
    initWidget()
  })
}
const initRemove = () => {
  isDeactivated.value = true
  tradeStore.setCurrentCoinList(currentCoinInfo.coin, 'remove')
  document.removeEventListener('event_tradeSymbolChange', eventTradeSymbolChange)
  unsubscribeTrades(true)
  widget.remove()
}

onMounted(async () => {
  //初始化
  initialize()
})

onBeforeUnmount(() => {
  //清除数据
  initRemove()
})

//每次进入缓存页面获取数据
onActivated(() => {

  if (isDeactivated.value) {
    console.log('初始化数据')
    //初始化
    initialize()
  }

})

//每次离开缓存页面获取数据
onDeactivated(() => {

  if (isDeactivated.value) {
    console.log('离开删除数据')
    //清除数据
    initRemove()
  }
})

/**
 * 设置币种、周期
 */
const setSymbol = async (symbol, interval, callBack) => {
  // console.log('----设置时----', symbol, interval)
  // console.log('----设置时----', (currentCoinInfo.symbol != symbol || interval != currentInterval.interval))

  if (currentCoinInfo.symbol != symbol || interval != currentInterval.interval) {

    widget?.setSymbol(symbol, interval, async () => {
      // console.log('------setSymbol---------', coinInfo.value.symbol, symbol, interval)
      // console.log('------setSymbol---------', intervalList.find((elem) => elem.interval == interval))
      Object.assign(
        currentInterval,
        intervalList.find((elem) => elem.interval == interval)
      )

      callBack && callBack()
    })
  }
}

// 数据实例
const dataFeedInstance = {}
/**
 * 获取配置
 */
dataFeedInstance.getConfig = async (callback) => {
  setTimeout(() => {
    callback({
      // 分辨率
      supported_resolutions: supportedResolutions,
      supports_marks: false,
      supports_timescale_marks: true,
      supports_time: true
    })
  }, 0)
}
/**
 * 获取服务器时间
 */
dataFeedInstance.getServerTime = async (callback) => {
  let time = +new Date()
  callback && callback(time)
}
const dateToMs = (date) => {
  let result = new Date(date).getTime();
  return result;
}
/**
 * 获取历史KLine数据
 */
dataFeedInstance.getBars = async ({ symbolInfo: coinInfo, resolution, from, firstDataRequest }) => {
  console.log(mainStore.timezone, '12121212121mainStore.timezone');

  let tempInterval = intervalList.find((elem) => elem.interval == resolution)
  try {
    if (tempInterval && (from == '' || from > 0)) {
      let params = {
        symbol: coinInfo.coinUpperCase,
        interval: tempInterval.key,
        // stockType: coinInfo.stockType || '',
        limit: 1000
      }
      if (from) {
        params.end = from
      }
      // let barList = await client.candles(params)

      const { data } = await getKlineHistory({
        ...params,
        interval: tempInterval.key,
        symbol: coinInfo.coinUpperCase,
        market: coinInfo.market,
        // stockType: 'US',
        tme: new Date().getTime()
      })
      // console.log(data.ticker.symbol,55555555)
      /* tradeStore.setKlineTicker(data.ticker)
      let barList = data.historyKline */
      let barList = []
      if (data) {
        tradeStore.setKlineTicker(data.ticker)
        barList = data.historyKline || []
      }

      barList = barList
        .map((elem) => {
          return {
            open: parseFloat(elem.o),
            high: parseFloat(elem.h),
            low: parseFloat(elem.l),
            close: parseFloat(priceFormat(elem.c)),
            amount: parseFloat(priceFormat(elem.c)),
            volume: parseFloat(elem.v),
            time: elem.T
          }
        })
        .sort((a, b) => a.time - b.time)
      if (firstDataRequest) {
        let tempObj = barList.slice(-1)[0]

        tempTrade.amount = tempObj.amount
        tempTrade.open = tempObj.open
        tempTrade.close = tempObj.close
        tempTrade.high = tempObj.high
        tempTrade.low = tempObj.low
        tempTrade.volume = tempObj.volume
        tempTrade.time = tempObj.time
        tempTrade.lastClose = tempObj.close
        tempTrade.intervention = false

        intervalDiff.value = Math.abs(_sub(tempTrade?.time || 0, barList.slice(-2, -1)[0]?.time || 0))
        updateDataKline(tempTrade)
        subscribeTrades({
          coin: coinInfo.coin,
          symbol: coinInfo.symbol,
          interval: tempInterval.key,
          firstDataRequest: firstDataRequest
        })
      }
      return barList
    }
  } catch (error) {
    unsubscribeTrades(true)
    return []
  }
  return []
}

/**
 * 加载商品配置
 */
dataFeedInstance.resolveSymbol = async () => {
  return {
    // 商品名称
    name: coinInfo.value.symbolUpperCase,
    // 自定义携带参数
    coin: coinInfo.value.coin,
    coinUpperCase: coinInfo.value.coin,
    symbol: coinInfo.value.symbol,
    symbolUpperCase: coinInfo.value.symbolUpperCase,
    market: coinInfo.value.market,
    // resolution: '1m',
    fractional: false,
    //设置周期
    session: '24x7',
    // 显示商品是否具有历史数据
    has_intraday: true,
    //设置是否支持周月线
    has_weekly_and_monthly: true,
    // 布尔值显示商品是否具有以日为单位的历史数据
    // has_daily: true,
    // 交易所名称
    exchange: __config._APP_EXCHANGE_NAME,
    //设置是否支持周月线
    description: coinInfo.value.symbolUpperCase,
    //设置价格精度  100表示保留两位小数   1000三位   10000四位
    pricescale: priceScale.value,
    // 最小波动
    minmov: 1,
    // 分辨率数组
    supported_resolutions: supportedResolutions
  }
}

/**
 * 初始化图表
 */
const initWidget = () => {
  datafeeds = new Datafees(dataFeedInstance)
  // 主题
  let theme = window.__theme.includes('light') ? 'light' : 'dark'
  widget = new TradingView.widget({
    symbol: coinInfo.value.symbolUpperCase,
    theme,
    debug: false,
    autosize: true,
    // 默认分辨率
    interval: currentInterval.interval,
    container_id: klineId.value,
    datafeed: datafeeds,
    library_path: '/charting_library/',
    custom_css_url: `../tradingview_${theme}.css`,
    locale: 'en',

    timezone: 'America/Sao_Paulo',
    // 自定义日期格式化
    // customFormatters: {
    //   dateFormatter: {
    //     format(date) {
    //       return _klineTimeFormat(date.getTime(), 'DD/MM/YYYY', true)
    //     }
    //   },
    //   timeFormatter: {
    //     format(date) {
    //       return _klineTimeFormat(date.getTime(), 'HH:mm:ss', true)
    //     }
    //   }
    // },
    customFormatters: {
      timeFormatter: {
        format: function (date) { var _format_str = '%h:%m'; return _format_str.replace('%h', date.getUTCHours(), 2).replace('%m', date.getUTCMinutes(), 2).replace('%s', date.getUTCSeconds(), 2); }
      },
      dateFormatter: {
        format: function (date) { return _klineTimeFormat(date.getTime(), 'DD/MM/YYYY', true) }
      }
    },

    preset: 'mobile',
    ...getConfig(theme)
  })
  widget.onChartReady(() => {
    createStudy()
  })
}

/**
 * 创建指标
 */
const createStudy = () => {
  // let id = widget.chart().createStudy('volume', false, false, [5], null)
  // studies.push(id)
  let id = setStudy(studyList[0].name)
  studies.push(id)
}
/**
 * 订阅客户端列表
 */
const subscribeClientList = []
/**
 * 取消订阅
 * @param {*} firstDataRequest
 */
const unsubscribeTrades = (firstDataRequest = false) => {
  if (currentCoinInfo.coin) {
    _coinWebSocket.send({
      op: socketDict.unsubscribe,
      type: socketDict.KLINE,
      symbol: currentCoinInfo.coin,
      interval: currentInterval.key
    })
    if (firstDataRequest) {
      subscribeClientList.forEach((subKey) => {
        subKey && PubSub.unsubscribe(subKey)
      })
      subscribeClientList.length = 0
      _coinWebSocket.send({
        op: socketDict.unsubscribe,
        type: socketDict.TRADE,
        symbol: currentCoinInfo.coin
      })
    }
  }
}

/**
 * 订阅实时成交
 */
const subscribeTrades = async (params) => {
  // 先取消订阅
  unsubscribeTrades(params.firstDataRequest)

  _coinWebSocket.send({
    op: socketDict.subscribe,
    type: socketDict.KLINE,
    symbol: params.coin,
    interval: params.interval
  })

  if (params.firstDataRequest) {
    _coinWebSocket.send({
      op: socketDict.subscribe,
      type: socketDict.TRADE,
      symbol: params.coin
    })
  }
  // let marketTradeKey = PubSub.subscribe(socketDict.TRADE, (key, data) => {
  // // 实时成交
  // if (data.symbol == params.coin) {
  //   let tempData = data.data.tick.data[0]
  //   // console.log('实时成交', data.symbol, tempData)
  //   if (
  //     tempTrade.time <= tempData.ts &&
  //     priceFormat(tempTrade.close) != priceFormat(tempData.price)
  //   ) {
  //     if (tempTrade.high < tempData.price) {
  //       tempTrade.high = tempData.price
  //     } else if (tempTrade.low > tempData.price) {
  //       tempTrade.low = tempData.price
  //     }
  //     tempTrade.close = Number(priceFormat(tempData.price))
  //     // updateDataKlineThrottle(tempTrade)
  //     updateDataKline(tempTrade)
  //   }
  // }
  // })
  // subscribeClientList.push(marketTradeKey)
  let candlestickKey = PubSub.subscribe(socketDict.KLINE, (key, data) => {
    // console.log('----------', data)
    // K线数据
    // console.log('K线数据', tempTrade.lastClose, intervalDiff.value, data.data.tick)
    let tempData = data.data.tick
    if (data.symbol == params.coin?.toLocaleLowerCase()) {
      if (tempTrade.intervention != tempData?.intervention) {
        console.log('干预', tempTrade.intervention, tempData?.intervention, tempTrade.lastClose)
        tempData.open = tempTrade.lastClose
        tempTrade.intervention = tempData?.intervention
      }
      // 本次时间
      // let tempTime = parseInt(tempData.id / intervalDiff.value) * intervalDiff.value
      let tempTime = _mul(_div(tempData.id || 0, intervalDiff.value || 0), intervalDiff.value || 0)

      if (currentCoinInfo.market == 'metal') {
        // 期货数据
        if (tempTrade.time != tempTime) {
          // 最新分时
          // console.log('最新分时', tempTime, tempData, tempTrade)

          // tempData.open = tempData.close

          if (Math.abs(tempTrade.time - tempTime) < intervalDiff.value) {
            tempData.open = tempData.close
          } else {
            tempTrade.open = tempData.close
          }
          console.log('不一样', intervalDiff.value, tempTrade.time, tempTime, tempData.close, tempData.open, tempTrade.open)



          tempTrade.time = tempTime
          tempData.high = tempData.close
          tempData.low = tempData.close
          tempTrade.high = tempData.close
          tempTrade.low = tempData.close
        } else {
          // 当前分时
          tempData.high = tempTrade.high
          tempData.low = tempTrade.low
          if (tempTrade.open < tempData.close) {
            tempData.high = tempData.close
          } else if (tempTrade.open > tempData.close) {
            tempData.low = tempData.close
          }
        }
      } else {
        // 币安数据
        console.log('上一次的时间', tempTrade.time, tempTrade.time < tempTime)
        if (tempTrade.time < tempTime) {
          console.log('本次时间', tempData.open, tempTrade.time, tempTime, tempData)
          tempTrade.open = Number(priceFormat(tempData.open, 6))
          tempTrade.time = tempTime
        }
      }

      if (currentCoinInfo.market == 'mt5') {
        tempTrade.high = tempData.close
        tempTrade.low = tempData.close
      } else {
        tempTrade.high = tempData.high
        tempTrade.low = tempData.low
      }

      tempTrade.close = Number(priceFormat(tempData.close, 6))
      tempTrade.volume = tempData.vol
      updateDataKline(tempTrade)
    }
  })
  subscribeClientList.push(candlestickKey)
}
/**
 * 更新数据
 */
const updateDataKline = async (newData) => {
  if (newData?.close) {
    // console.log('更新数据', newData)
    await datafeeds.updateData(newData)
    await PubSub.publish(socketDict.DETAIL, {
      data: {
        ...newData,
        vol: newData.volume
      },
      origin: 'kline',
      symbol: currentCoinInfo.coin,
      type: socketDict.DETAIL
    })
  }
}
/**
 * 更新数据 限流
 */
const updateDataKlineThrottle = throttle(function (newData) {
  updateDataKline(newData)
}, 300)
/**
 * 显示更多分辨率
 */
const showMenu = ref(false)
/**
 * 选中分辨率
 * @param {*}
 */
const checkedInterval = (item, type = '') => {
  if (item.interval != currentInterval.interval) {
    setSymbol(coinInfo.value.symbol, item.interval)
  }
  showMenu.value = !!type
}

// 指标选择
const currentStudy = ref('')
/**
 * 设置指标
 */
const setStudy = (name) => {
  if (currentStudy.value == name) {
    return
  }
  const activeChart = widget.activeChart()
  // 关闭旧指标
  if (currentStudy.value) {
    let oldStudy = studyList.filter((elem) => elem.name == currentStudy.value)[0]
    oldStudy.list.forEach((elem) => {
      activeChart.removeEntity(elem)
    })
  }
  // 设置新指标
  currentStudy.value = name
  let newStudy = studyList.filter((elem) => elem.name == currentStudy.value)[0]
  let tempList = []
  newStudy.cycleList.forEach(async (cycle, index) => {
    let result = ''
    if (name == 'MACD') {
      result = await activeChart.createStudy(currentStudy.value, false, false, [], {})
    } else if (name == 'Bollinger Bands') {
      result = await activeChart.createStudy(currentStudy.value, false, false, [], {})
    } else {
      result = await activeChart.createStudy(currentStudy.value, false, false, [cycle], {
        'plot.color': newStudy.colorList[index],
        'plot.linewidth': 2
      })
    }
    tempList.push(result)
  })
  newStudy.list = tempList
}
</script>
<style lang="scss" scoped>
.candlestick {
  height: 348px;
  background-color: var(--ex-candlestick-bg);
}

.hightItem {
  color: var(--ex-font-color9) !important;
}

.third {
  padding: 10px 0;
  // border-bottom: 1px solid var(--ex--backup-background-color-2);

  .list {
    background-color: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .thirdLeft {
      flex: 1;
      background-color: var(--ex-candlestick-bg);
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: var(--ex-default-font-color);

      .item {
        flex: 1;
        text-align: center;
      }
    }

    .thirdRight {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: var(--ex-font-color9);

      .thirdRightImg {
        width: 10px;
        height: 6px;
        margin-left: 5px;
      }
    }
  }
}

.selectTimes {
  position: absolute;
  height: 100vh;
  width: var(--ex-max-width);
  background: rgba($color: #000000, $alpha: 0.6);
  z-index: 10;

  .times {
    background-color: var(--ex-candlestick-bg);
    position: absolute;
    width: 100%;
    height: 84px;
    display: flex;
    align-items: center;
    border-radius: 0px 0px 15px 15px;

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 15px;
      width: 37px;
      height: 23px;
      background: var(--ex-div-bgColor12);
      border-radius: 2px 2px 2px 2px;
      font-size: 12px;
      color: var(--ex-default-font-color);
    }
  }
}

.studyList {
  display: flex;
  padding: 10px 0px;
  justify-content: space-between;

  .studyItem {
    font-size: 14px;
    color: var(--ex-default-font-color);
  }
}
</style>
