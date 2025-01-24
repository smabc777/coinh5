/**
 * 跟单
 */

import follow from '@/router/module/follow'
import { post, get } from '@/utils/request'

//获取跟单员
export const getFollowTrader = () => post('/api/follow/list')


// 交易员排行榜
export const getFollowRank = () => post('/api/follow/rank')


//获取当前收益
export const getUserData = () => post('/api/follow/rankData')


//获取投资人列表
export const getPositionRank = () => post('/api/contract/position/rank')


//获取跟单列表
export const getFollowOrder = (followType) => post(`/api/follow/list?followType=${followType}`)


//获取跟单详情
export const getFollowDetail = (id) => post(`/api/follow/detail/${id}`)


//获取新闻列表
export const getNewsList = (lang) => post(`/api/news/getNews/${lang}`);



//获取金融列表
export const getFinancialList = (params) => post(`/api/financial/list`,params);



//获取金融收益
export const getPersonalIncome = (lang) => post(`/api/financial/personalIncome`);




/**
 *
 * @param {*} id
 * @returns 理财详情
 */
export const financialDetail = (id) => post(`api/financial/${id}`)



/**
 *
 * @param {*} id
 * @returns 理财详情
 */
export const financialSubmit = (planId, money, days) => post(`/api/financial/submit?planId=${planId}&money=${money}&days=${days}`)


/**
 *
 * @param {*} id
 * @returns 理财订单列表
 */
export const financialOrder = (status) => post(`/api/order/list?status=${status}`)
