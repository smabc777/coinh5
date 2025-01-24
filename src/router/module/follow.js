// defi 路由模块
import FollowIndex from '@/views/follow/index.vue'
import News from '@/views/followai/news.vue'
import Test from '@/views/follow/test.vue'
import Wallet from '@/views/follow/wallet.vue'
import FinancialOrder from '@/views/follow/wallet.vue'
import FinancialList from '@/views/follow/financialList.vue'
import FinancialViewList from '@/views/follow/financialView.vue'


import newsList from '@/views/news/index.vue'
import newsDetail from '@/views/news/detail.vue'
import Order from '@/views/follow/order.vue'
import AITradingIndex from '@/views/AITrading/index.vue'
import AIRecommend from '@/views/AITrading/recommend.vue'
import WealthOptimizer from '@/views/AITrading/WealthOptimizer.vue'
import AITradingDetail from '@/views/AITrading/detail.vue'
import benefitDetail from '@/views/AITrading/benefitDetail.vue'
import benefitDetailTable from '@/views/AITrading/benefitDetailTable.vue'


export default [
  {
    path: '/benefitDetailTable',
    name: 'benefitDetailTable',
    component: benefitDetailTable
  },
  {
    path: '/benefitDetail',
    name: 'benefitDetail',
    component: benefitDetail
  },
  {
    path: '/AITradingDetail',
    name: 'AITradingDetail',
    component: AITradingDetail
  },
  {
    path: '/WealthOptimizer',
    name: 'WealthOptimizer',
    component: WealthOptimizer
  },
  {
    path: '/AIRecommend',
    name: 'AIRecommend',
    component: AIRecommend
  },
  {
    path: '/AITrading',
    name: 'AITrading',
    component: AITradingIndex
  },
  {
    path: '/order',
    name: 'order',
    component: Order
  },
  {
    path: '/follow',
    name: 'follow',
    component: FollowIndex
  },
  {
    path: '/newsList',
    name: 'newsList',
    component: newsList
  },
  {
    path: '/newsDetail',
    name: 'newsDetail',
    component: newsDetail
  },
  {
    path: '/news',
    name: 'news',
    component: News
  },
  {
    path: '/financialList',
    name: 'financialList',
    component: FinancialList
  },
  // AI GPT
  {
    path: '/financialView',
    name: 'financialView',
    component: FinancialViewList
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  },
  {
    path: '/walletview',
    name: 'walletview',
    component: Wallet
  },
  {
    path: '/financialOrder',
    name: 'financialOrder',
    component: FinancialOrder
  }
]
