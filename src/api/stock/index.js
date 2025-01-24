// 日本股票相关
import { post, get } from '@/utils/request'

/**
 * 查询股票交易市场配置列表
 */
export const getStocklistApi = (params) => get(`/api/common/stockList?${params}`)

/**
 * 查询股票交易订单列表
 */
export const getOrderListApi = (data) => post('/api/stock/order/orderList', data)

/**
 * 股票交易（买卖）
 */
export const submitOrderStock = (data, loading) => post('/api/stock/order/submit', data, loading)

/**
 * 撤单
 */
export const cancelStockOrderApi = (data) => post('/api/stock/order/cancelOrder', data)

/**
 * 股票资产管理列表
 */
export const getStockAssetlistApi = (params) => get(`/api/stock/asset/list?${params}`)

/**
 * 用户单个市场股票资产
 */
export const getStockAssetApi = (params) => get(`/api/stock/asset/get?${params}`)

/**
 * 获取资产和订单数量
 */
export const getAssetCountApi = (params) => get(`/api/stock/asset/getCount?${params}`)


// 获取汇率

export const getRateApi = (type) => get(`/api/common/getRate?sourceType=${type}`)
