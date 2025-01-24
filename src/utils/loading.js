import {showLoadingToast} from 'vant'

/* 全局请求 loading */
let loadingInstance = null;
let Timeout = null;

/**
 * @description 开启 Loading
 * */
const startLoading = (options = {}, duration = 5000) => {
    let option = {
        forbidClick: true,//是否禁止背景点击
        duration: duration,//展示时长(ms)，值为 0 时，toast 不会消失
        ...options
    }
    loadingInstance = showLoadingToast(option);
    if (Timeout) clearTimeout(Timeout)
    Timeout = setTimeout(() => {
        endLoading()
    }, duration)
};

/**
 * @description 结束 Loading
 * */
const endLoading = () => {
    if (Timeout) clearTimeout(Timeout)
    if (loadingInstance) loadingInstance.close();
};

/**
 * @description 显示全屏加载
 * */
export const showFullScreenLoading = (option, duration) => {
    startLoading(option,duration);
}


/**
 * @description 隐藏全屏加载
 * */
export const tryHideFullScreenLoading = () => {
    endLoading();
};
