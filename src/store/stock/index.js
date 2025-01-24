// 股票相关
import { defineStore } from 'pinia'

export const useStockStore = defineStore('stock', {
  state: () => {
    return {
      /**
       * 行情页面点击股票设置单支股票数据
       */
      stockInfo: reactive({}),
      /**
       * 24小时成交
       */
      klineTicker: reactive({}),
      /**
       * 当前股票
       */
      currentStockList: [],
      // 当前汇率
      stockRate: reactive(0),
    }
  },
  getters: {},
  actions: {
    // 设置股票数据
    setStockInfo(stockInfo) {
      this.stockInfo = stockInfo
    },
    // 获取汇率
    setStockRate(rate) {
      console.log(+rate.currencyRate,'raterateraterateraterate');
      
      this.stockRate = +rate.currencyRate
    },
    setKlineTicker(klineTicker) {
      this.klineTicker = klineTicker
    },
    /**
     * 设置当前股票
     */
    setCurrentStockList(val, type) {
      if (val) {
        if (type == 'remove') {
          this.currentStockList = this.currentStockList.filter((elem) => elem != val)
        } else if (!this.currentStockList.includes(val)) {
          this.currentStockList.push(val)
        }
      }
    },
  },
  // 开启数据持久化
  persist: true
})
