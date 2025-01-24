import Home from './module/home'
import Quote from './module/quote'
import Settings from './module/settings'
import Financial from './module/financial'
import Assets from './module/assets'
import Trade from './module/trade'
import Loan from './module/loan'
import Pledge from './module/pledge'
import User from './module/user'
import Help from './module/help'
import Nft from './module/nft'
import Other from './module/other'
import Subscription from './module/subscription'
import Login from './module/login'
import Register from './module/register'
import Defi from './module/defi'
import Defic from './module/defic'
import Follow from './module/follow'
import Service from './module/service'
import Dz from './module/dz'

export default [
    ...Home,// 首页
    ...Login,//登录
    ...Register,//注册
    ...Settings, //设置
    ...Assets, //资产
    ...User, //用户
    ...Quote, // 行情
    ...Financial, // 理财
    ...Trade, // 交易
    ...Loan, //助力贷
    ...Pledge, //质押挖矿
    ...Help, // 帮助
    ...Nft, // nft
    ...Other, // 其他
    ...Subscription, //申购
    ...Defi, // def挖矿
    ...Defic, // def挖矿
    ...Service, // 服务
    ...Follow, // g跟单
    ...Dz, // 大宗交易

    // 404->首页
    {
        path: '/:catchAll(.*)', // 不识别的path自动匹配404
        redirect: '/home'
    }
]
