// 配售、发币

import { post, get } from '@/utils/request'
// 配售列表
export const ownCoinList = (status, type) => post(`/api/ownCoin/list?status=${status}&type=${type}`)
// 创建配售列表
export const ownCoinCreateOrder = (params) => post(`/api/ownCoinOrder/createOrder`, params)
// 查询配售订单
export const getOwnCoinOrder = (params) => get(`/api/ownCoinOrder/list?${params}`)
/**
 * 获取配售详情
 */
export const getOwnCoinDetail = (id) => get(`/api/ownCoin/getDetail/${id}`)

// 订阅接口
export const subscribeCoins = (params) => post('/api/ownCoin/subscribeCoins', params)

// 订阅接口
export const payForOrder = (params) => post('/api/ownCoinApplyOrder/payForOrder' + params)
//查询用户订阅记录列表
export const subscribeList = (params) => get('/bussiness/ownCoin/subscribeList', params)

// 审批用户订阅
export const editSubscribe = (params) => post('/bussiness/ownCoin/editSubscribe', params)

// 提前发布新币
export const editStatus = (params) => get('/bussiness/ownCoin/editStatus', params)

// 配售新币
export const placing = (data, params, loading) => post('/api/ownCoinOrder/placing' + data, params, loading)

// 审批配售新币
export const editPlacing = (params) => post('/api/bussiness/ownCoinOrder/editPlacing', params)

/**
 * 新股持仓
 * @returns
 */
export const stockSubscribePage = (params) =>
    get(
        `/api/stock/user-stock-subscribe/page?pageNo=${params.pageNo}&pageSize=${params.pageSize}&userAccount=${params.userAccount}`,
        {}
    )
/**
 * 新股去缴纳
 * @returns
 */
export const stockSubmit = (params) => post(`/api/stock/user-stock-subscribe/submit`, params)
// 平仓
export const stockSell = (params, loading) =>
    post(`/api/stock/userPosition/sell?positionSn=` + params.positionSn, loading)
/**
 * 获得用户持仓订单分页
 * @returns
 */
export const userPositionPage = (params) =>
    get(
        `/api/stock/userPosition/apiPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}&currencyType=${params.currencyType}&state=${params.state}&stockType=${params.stockType}`,
        {}
    )
// 获取大宗订单

export const getorderPage = (params) =>
    get(
        `/api/stock/userPosition/orderPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}&userId=${params.userId}`,
        {}
    )