/**
 * 站内信api
 */

import { post } from '@/utils/request'

// 查询站内信消息
export const getSiteMessage = () => post('/api/mail/listByUserId')

//借贷订单
// export const getLoan = (params) => post('/api/mail/updateMail', params)

//消息已读
export const haveRead = (params) => post(`/api/mail/updateMail?${params}`)





export const googleTranslator = (params) => post(`/api/common/googleTranslator`, params)

