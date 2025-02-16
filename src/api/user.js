// 登录，注册，用户信息

import { post, get } from '@/utils/request'

/**
 * 登录注册
 */
// 登录注册方式
export const loginRegisterList = () => post('/api/common/getLoginRegisterList')
// 用户注册
export const signUp = (parmas, loading) => post('/api/user/register', parmas, loading)
// 用户登录
export const signIn = (parmas, loading) => post('/api/user/login', parmas, loading)
// 修改登录密码
export const updateLoginPwd = (oldPwd, newPwd, userId) =>
  post(`/api/user/updateUserLoginPwd?oldPwd=${oldPwd}&newPwd=${newPwd}&userId=${userId}`)
// 添加登录密码
export const addLoginPwd = (pwd) => post(`/api/user/pwdSett?pwd=${pwd}`)
// 切换账户（1真实  2模拟）
export const switchAccount = (type) => post(`/api/user/switch?type=${type}`)
/**
 * 邮箱
 */
// 邮箱找回密码
export const backPwdToEmail = (email, newPwd, emailCode, loading) =>
  post(`/api/user/backPwd?email=${email}&newPwd=${newPwd}&emailCode=${emailCode}`, {}, loading)
// 邮箱修改密码
export const updatePwdByEmail = (email, newPwd, emailCode) =>
  post(`/api/user/updatePwdByEmail?email=${email}&newPwd=${newPwd}&emailCode=${emailCode}`)
// 邮箱验证码
export const emailCode = (codeType, email, loading) =>
  post(`/api/user/sendEmailCode?codeType=${codeType}&email=${email}`, {}, loading)
// 绑定邮箱
export const emailBind = (email, emailCode) =>
  post(`/api/user/bindEmail?email=${email}&emailCode=${emailCode}`)
/**
 * 手机
 */
// 手机区号
export const getAreaCode = () => post('/api/user/getCountryCode')
// 手机验证码
export const mobileCode = (codeType, mobile, loading) =>
  post(`/api/user/sendMobileCode?codeType=${codeType}&phone=${mobile}`, {}, loading)

// 退出登录
export const signOut = (parmas, loading) => post('/api/user/loginOut', parmas, loading)

// 获取用户信息
export const getUserInfo = () => post('/api/user/getInfo')

/**
 * 资金密码
 */
// 设置资金密码
export const setFundPwd = (pwd, data,loading) => post(`/api/user/tardPwdSet?pwd=${pwd}`, data,loading)
// 修改资金密码
export const updateFundPwd = (oldPwd, newPwd, signType, data,loading) =>
  post(`/api/user/updatePwd?oldPwd=${oldPwd}&newPwd=${newPwd}&signType=${signType}`, data,loading)

/**
 *
 * @param {*} realName 姓名
 * @param {*} idCard 证件号码
 * @param {*} flag 1 初级 2高级
 * @param {*} frontUrl 正面照片
 * @param {*} backUrl 反面照片
 * @param {*} country 国家
 * @param {*} handelUrl 手持照片
 * @param {*} cardType 类型
 * @returns
 */
// export const uploadKYC = (realName,idCard,flag,frontUrl,backUrl,country,handelUrl,cardType) =>
//   post(
//     `/api/user/uploadKYC?realName=${realName}&idCard=${idCard}&flag=${flag}&frontUrl=${frontUrl}&backUrl=${backUrl}&country=${country}&handelUrl=${handelUrl}&cardType=${cardType}`
//   )
export const uploadKYC = (params,loading) => post(`/api/user/uploadKYC?${params}`,loading)

export const getFreezeList = (params) => post(`api/withdraw/freezeList`)



