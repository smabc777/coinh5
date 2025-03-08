import axios from 'axios'
import { useUserStore } from '@/store/user/index.js'
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/loading'
import { showToast } from 'vant'
import { _toView } from "@/utils/public";
import { removePending, addPending } from '@/utils/requestPending.js'

let _axios = null
/**
 * 初始化
 */

export const baseURL = __config._BASE_API
// export const initAxios = () => {
if (!_axios) {
    _axios = axios.create({
        // 默认请求连接
        baseURL: baseURL,
        // 请求头
        headers: {
            'Content-Type': 'application/json'
        },
        // 超时时间（ms）
        timeout: 10 * 1000
    })
}
// }
// 请求拦截器
_axios.interceptors.request.use((config) => {
    // token 判断
    let userStore = useUserStore()
    let token = userStore.token
    if (token) {
        config.headers['authorization'] = token
        config.headers['satoken'] = token
    }
    config.headers['language'] = document.querySelector('html').getAttribute('language')
    config.headers['lang'] = document.querySelector('html').getAttribute('lang')

    removePending(config) // 在请求开始前，对之前的请求做检查取消操作
    addPending(config) // 将当前请求添加到 pending 中
    return config
})

// 响应拦截器
_axios.interceptors.response.use((response) => {
    // 在请求结束后，移除本次请求
    // 频繁请求优化
    setTimeout(() => {
        removePending(response)
    }, 500)





    if (response.status === 200) {
        if (response.data.code == '403') {
            // 判断钱包清除用户数据  浏览器 跳转登录页
            let userStore = useUserStore()
            userStore.signOut()
            //跳转登录页
            _toView('/login')
            // setTimeout(() => location.reload(), 10)
        }
        if (response.data.code == '500' && response.data?.msg?.includes('Token')) {
            // 判断钱包清除用户数据  浏览器 跳转登录页
            let userStore = useUserStore()
            userStore.signOut()
            //跳转登录页
            _toView('/login')
            // setTimeout(() => location.reload(), 10)
        }
        if (response.data && response.data.code > 0) {
            return Promise.resolve(response.data)
        } else {
            showToast(response.data.msg || 'System error')
            return Promise.reject(response)
        }
    } else {
        showToast('Network anomaly')
        return Promise.resolve(response)
    }
}, error => {
    // 在请求结束后，移除本次请求
    // 频繁请求优化
    setTimeout(() => {
        removePending(error)
    }, 500)
    //触发这个错误处理
    if (axios.isCancel(error)) {
        console.log("已取消的重复请求：" + error.message)
        return
    }
})

/**
 * post 请求
 *
 * loading:true 启动加载
 */
export const post = (url, params = {}, loading = { loading: false }) => {
    //开始Loading
    loading.loading && showFullScreenLoading()

    return new Promise((resolve, reject) => {
        _axios
            .post(url, params)
            .then((res) => {
                // 结束 Loading
                tryHideFullScreenLoading()
                resolve(res)
            })
            .catch((err) => {
                // 结束 Loading
                tryHideFullScreenLoading()
                reject(err)
            })
    })


}

/**
 * get 请求
 *
 * loading:true 启动加载
 */
export const get = (url, params = {}, loading = { loading: false }) => {
    //开始Loading
    loading.loading && showFullScreenLoading()

    return new Promise((resolve, reject) => {
        _axios
            .get(url, params)
            .then((res) => {
                // 结束 Loading
                tryHideFullScreenLoading()
                resolve(res)
            })
            .catch((err) => {
                // 结束 Loading
                tryHideFullScreenLoading()
                reject(err)
            })
    })
}
/**
 * put 请求
 *
 * loading:true 启动加载
 */
export const put = (url, params = {}, loading = { loading: false }) => {
    //开始Loading
    loading.loading && showFullScreenLoading()

    return new Promise((resolve, reject) => {
        _axios
            .put(url, params)
            .then((res) => {
                // 结束 Loading
                tryHideFullScreenLoading()
                resolve(res)
            })
            .catch((err) => {
                // 结束 Loading
                tryHideFullScreenLoading()
                reject(err)
            })
    })
}

