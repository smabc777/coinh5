// IEO认购、发币

import { post, get } from '@/utils/request'

// IEO认购数量限制
export const getAvailableNum = (coinId,coin) => get(`/api/ownCoinOrder/getAvailableNum?coinId=${coinId}&coin=${coin}`)

// IEO认购订单列表
export const getownCoinApplyOrder = (params) => get(`/api/ownCoinApplyOrder/list?${params}`)

// IEO认购新币
export const placingownCoinApply = (params,loading) => post('/api/ownCoinApplyOrder/placing', params,loading)
