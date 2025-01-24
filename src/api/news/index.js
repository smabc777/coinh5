import { post, get } from '@/utils/request'

/**
 * 获取新闻tab
 * @returns
 */
export const getNewsTabs = () => post('/api/common/geNewsTabSetting')


/**
 * 获取新闻列表
 * @returns
 */
export const getJPNewsList = (params) => post('/api/news/getJPNewsList', params)

/**
 * 获取新闻详情
 * @returns
 */
export const getJPNewsContent = (params) => post('/api/news/getJPNewsContent', params)