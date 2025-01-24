/**
 * 币种交易相关 api
 */
import { post, get, put } from '@/utils/request'

/**
 * 获取所有币种列表 type 1 秒合约 2 币币 3 U本位 4 期权  5 外汇（待定）
 * @returns
 */
export const getCoinListApi = () => post('/api/common/getCoinList')
/**
 * 币币买入卖出
 * @returns
 */
export const submitOrderCurrencyApi = (params, loading) => post('/api/currency/order/submit', params, loading)

/**
 * 币币撤销订单
 * @returns
 */
export const cancelOrderCurrencyApi = (id) => post(`/api/currency/order/cancelOrder?id=${id}`)

/**
 * 获取币币列表
 * @returns
 */
// export const getOrderListCurrencyApi = (params) => post(`/api/currency/order/orderList`)
export const getOrderListCurrencyApi = (params) => post(`/api/currency/order/orderList?${params}`)

/**
 *
 * @param {*} data
 * @returns 查看币种周期配置
 */
export const getPeriodList = (data) => post('/api/period/list', data)

/**
 *
 * @param {*} data
 * @returns 新增秒合约订单
 */
export const createSecondContractOrder = (data, loading) =>
    post('/api/secondContractOrder/createSecondContractOrder', data, loading)
/**
 *
 * @param {*} key :
 *      秒合约 S_TOTAL
 *      币币  B_TOTAL
 *      u本位  U_TOTAL
 *    * @returns 获取订单数量角标版
 */
export const countOrderTotals = (key, loading) =>
    get('/api/countOrderTotals/' + key, {}, loading)

/**
 *
 * @param {*} data
 * @returns 当前/历史委托  秒合约
 */
export const secondContractOrderselectOrderList = (data) =>
    post('/api/secondContractOrder/selectOrderList', data)
/**
 *
 * @param {*} data
 * @returns 提交本位
 */
export const submitUcontract = (data, loading) => post('/api/contract/order/submit', data, loading)

/**
 *
 * @param {*} status  0 当前持仓 1.历史持仓
 * @returns 持仓列表
 */
export const contractHistoryList = (data) =>
    post(
        `/api/contract/position/list?status=${data.status}&&pageSize=${data.pageSize}&&pageNum=${data.pageNum}`
    )
/**
 *
 * @param {*} data
 * @returns 极速平仓
 */
export const stopOrder = (data) => post(`/api/contract/position/stopOrder?id=${data.id}`)

/**
 *
 * @param {*} data
 * @returns 调整保证金
 */
export const adjustAmount = (data, loading) =>
    post(`/api/contract/position/adjustAmount?id=${data.id}&money=${data.money}&flag=${data.flag}`, {}, loading)

/**
 *
 * @returns 止盈止损列表
 */
export const contractLossList = (data) => post(`/api/contract/loss/list?pageSize=${data.pageSize}&&pageNum=${data.pageNum}`)

/**
 *
 * @param {*} data
 * @returns 止盈止损设置
 */
export const settLoss = (data, loading) => post(`/api/contract/loss/sett`, data, loading)
/**
 *
 * @param {*} data
 * @returns 取消止盈止损
 */
export const cancelLoss = (id) => post(`/api/contract/loss/cancel?id=${id}`)

/**
 *
 * @param {*} data
 * @returns 委托订单列表 0 当前 1 历史
 */
export const orderList = (data) => post(`/api/contract/order/list?status=${data.status}&&pageSize=${data.pageSize}&&pageNum=${data.pageNum}`)

/**
 *
 * @param {*} id
 * @returns 当前委托扯单
 */
export const canCelOrder = (id) => post(`/api/contract/order/canCelOrder?id=${id}`)

/**
 * 收藏币种
 */
export const setCollect = (params, loading) => post(`/api/userCoin/save`, params, loading)

/**
 * rxce平仓
 */

export const stopPosition = (data) => post(`/api/contract/position/stopPosition?id=${data.id}`)
/**
 * 追加保证金

 */
export const adjustPositionMargn = (data, loading) =>
    post(`/api/contract/position/adjustPositionMargn?id=${data.id}&money=${data.money}`, {}, loading)
/**
 * 追加本金
 */
export const adjustPositionAmout = (data, loading) =>
    post(`/api/contract/position/adjustPositionAmout?id=${data.id}&money=${data.money}`, {}, loading)
export const removeCollect = (params, loading) => post(`/api/userCoin/removeByCoin`, params, loading)
/**
 * 获取自选列表
 */
export const getCollect = (params) => post(`/api/userCoin/getUserCoin`, params)
/**
 * 批量添加收藏
 */
export const setCollectAdds = (params, loading) => post(`/api/userCoin/addBath`, params, loading)
/**
 * 批量取消收藏
 */
export const removeCollectRemoves = (ids, loading) => post(`/api/userCoin/remove/${ids}`, {}, loading)
/**
 * 秒合约黄金白银假数据
 */
export const getMt5Amount = (coin) => post(`/api/common/getMt5Amount?coin=${coin}`)



// 获取市场列表

//1 涨幅排序 2 涨的价格排序
export const getStockList = (params, rank) => post(`/api/stock/getStock?rank=${rank ? rank : ''}`, params)

// export const getStockList = (params,rank) => post(`/stock/getStock?rank=1`, params)

// 获取股票详情
export const getSingleStockApi = (id) => post(`/api/stock/getSingleStock?gid=${id}`)

export const getBuyBusinessApi = (params, loading) => post(`/api/stock/userPosition/buyBusiness`, params, loading)
export const getSellBusinessApi = (params, loading) => post(`/api/stock/userPosition/sell`, params, loading)
export const pendingordercreate = (params) => post(`/api/stock/userPendingOrder/create`, params)
//定时刷新
export const stocKtick = (params) => post(`/api/stock/tick`, params)

//新股持仓

export const getSingleStocklist = (params) => post(`/api/stock/singleStock/list?stockGid=${params}`)

//新股持仓的买卖交易
export const getbuyNewStock = (params) => post(`/api/stock/userPosition/buyNewStock`, params)

// 获取盘后股票



export const dispositionstock = (params) => post(`/api/stock/disposition-stock/discStock?type=${params.type}`)

// 盘后配置


export const dispositionstockpage = (params) => get(`/api/stock/disposition-stock/page?stockGid=${params}`)
// 盘后买卖


export const dispositionbusinessDeal = (params) => post(`/api/stock/userPosition/businessDeal`, params)

// 委托订单

export const userPositionphPage = (params) => get(`/api/stock/userPosition/phPage?state=${params.status}&pageSize=${params.pageSize}&pageNo=${params.pageNo}&stockGid=${params.stockGid}`)
// 限制

export const getPqPhState = (params) => get(`/api/stock/userPosition/get?stockGid=${params}`)


/**
 * 大宗交易列表
 * @returns
 */
export const dzPage = (params) =>
    get(
        `/api/stock/dz/page?pageNo=${params.pageNo}&pageSize=${params.pageSize}&type=${params.type}`,
        {}
    )

// 获取大宗订单

export const getorderPage = (params) =>
    get(
        `/api/stock/userPosition/orderPage?${params}`,
    )
/**
* 大宗购买
* @returns
*/
export const buyStockDzApi = (params, loading) => post(`/api/stock/userPosition/buyStockDz`, params, loading)

/**
 * 新股中心分类获取
 * @returns
 */
export const subscribeCenterPage = (params) =>
    get(
        `/api/stock/subscribe/center/page?pageNo=${params.pageNo}&pageSize=${params.pageSize}&centerType=${params.centerType}`,
        {}
    )

/**
* 创建新股买入
* @returns
*/
export const subscribeCreate = (params, loading) => post(`/api/stock/user-stock-subscribe/create`, params, loading)

// 日内创建


export const subdaytrading = (params, loading) => post(`/api/stock-day-trading/create`, params, loading)


export const tradingPage = (params, type) =>
    get(
        `/api/stock-day-trading/page?userId=${params}&status=${type}`
    )


/**
* 获得股票委托订单分页
* @returns
*/
export const userApiWTPagePage = (params) =>
    get(
        `/api/stock/userPosition/apiWTPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}&currencyType=${params.currencyType}&state=${params.state}`,
        {}
    )

// 股票撤单


export const rejectPosition = (params, loading) => put(`/api/stock/userPosition/rejectPosition`, params, loading)




export const getaccountStatistics = (data) => get(`/api/stock/userFunds/accountStatistics?stockType=${data.stockType}`, data)


export const getRate = (params) => get(`/api/stock/userFunds/getRate`, params)






