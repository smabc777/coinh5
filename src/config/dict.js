/**
 * 配置字典
 */

/**
 * 存储 key
 */
const getStorageDict = () => {
  let tempList = [
    // token
    'TOKEN',
    // 语言
    'LANGUAGE',
    // 语言ID
    'LANGUAGE_ID',
    // 用户信息
    'USER_INFO',
    // 主题
    'THEME',
    // 资产眼睛
    'EYES',
    // 关闭窗口时长
    'CLOSE_WINDOW_TIME',
    // 测试平台
    'TEST_PLATFORM'
  ]
  let tempStorageDict = {}
  tempList.forEach((key) => {
    tempStorageDict[key] = `${import.meta.env.VITE_APP_ENV.toLocaleUpperCase()}_${key}`
  })
  Object.freeze(tempStorageDict)
  return tempStorageDict
}
/**
 * 存储 字典
 */
export const storageDict = getStorageDict()
/**
 *  socket key
 */
const getSocketDict = () => {
  // kLine部分
  let kLineTempList = [
    'subscribe',
    'unsubscribe',
    // 币种详情
    'DETAIL',
    // K线
    'KLINE',
    // 交易数据
    'TRADE',
    // 心跳
    'HEARTBEAT',
    // 结算
    'SETTLEMENT',
    // 持仓变化
    'POSITION',
    // 用户账号冻结
    'USER_STATUS',
    // 申购
    'OWNCOIN'
  ]

  let tempList = [...kLineTempList]
  let tempSocketDict = {}
  tempList.forEach((key) => {
    tempSocketDict[key] = key
  })
  Object.freeze(tempSocketDict)
  return tempSocketDict
}
/**
 * socket 字典
 */
export const socketDict = getSocketDict()
