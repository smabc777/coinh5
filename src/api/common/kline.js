/**
 * kline 相关
 */
import { post } from '@/utils/request'

/**
 * k线历史数据
 */
export const getKlineHistory = (parmas) => post('/api/kline', parmas)

/**
 * 股票k线历史数据
 */
export const getKlineStockHistory = (parmas) => post('/api/klineStock', parmas)
