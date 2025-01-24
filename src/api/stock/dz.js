import { post, get } from '@/utils/request'

/**
 * 大宗股票列表
 */
export const getDzListApi = (params) => get(`/api/dz/dzlist?${params}`)

/**
 * 大宗买入申请
 */
export const submitOrderApi = (data) => post('/api/dz/order/submit', data)

/**
 * 查询大宗订单列表
 */
export const getDzOrderListApi = (params) => get(`/api/dz/order/orderList?${params}`)

/**
 * 订单交易(转入持仓)
 */
export const tradeOrderApi = (data) => post('/api/dz/order/trade', data)