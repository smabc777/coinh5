import Trade from '@/views/trade/index.vue'
import Trade_tab5 from '@/views/trade/tradeU.vue'
import TradeBB from '@/views/trade/tradeBB.vue'
import TradeDetail from '@/views/trade/tradeDetail.vue'
import TradingRules from '@/views/trade/tradingRules.vue'
import StockDetail from '@/views/trade/stockDetail.vue'

export default [
    // 股票交易详情图标
    {
        path: '/stockDetail',
        name: 'StockDetail',
        component: StockDetail
    },
    // 交易相关
    {
        path: '/trade',
        name: 'Trade',
        meta: {
            key:'SECOND_CONTRACT'
        },
        component: Trade
    },
    // U本位
    {
        path: '/tradeU',
        name: 'Trade_tab5',
        meta: {
            key:'U_CONTRACT'
        },
        component: Trade_tab5
    },
    // 交易BB
    {
        path: '/tradeBB',
        name: 'TradeBB',
        meta: {
            key:'CURRENCY'
        },
        component: TradeBB
    },
    // 交易详情图表
    {
        path: '/tradeDetail',
        name: 'TradeDetail',
        component: TradeDetail
    },
    // 交易说明
    {
        path: '/tradingRules',
        name: 'TradingRules',
        component: TradingRules
    },
]
