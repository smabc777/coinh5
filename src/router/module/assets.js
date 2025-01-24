import Assets from '@/views/assets/index.vue'
import Recharge from '@/views/assets/recharge/index.vue'
import RechargeApply from '@/views/assets/recharge/recharge-apply.vue'
import RechargeThb from '@/views/assets/recharge/recharge-thb.vue'

import RechargeOrder from '@/views/assets/recharge/recharge-order.vue'
import RechargeDetail from '@/views/assets/recharge/recharge-detail.vue'
import Withdraw from '@/views/assets/withdraw/index.vue'
import WithdrawApply from '@/views/assets/withdraw/withdraw-apply.vue'
import WithdrawOrder from '@/views/assets/withdraw/withdraw-order.vue'
import WithdrawDetail from '@/views/assets/withdraw/withdraw-detail.vue'
import Swap from '@/views/assets/swap/index.vue'
import Transfer from '@/views/assets/transfer/index.vue'
// 日内交易
import stockRecharge from '@/views/assets/recharge/stockRecharge.vue'
// 日内订单
import stockRechargeoreder from '@/views/assets/recharge/stockRechargeoreder.vue'

export default [
  // 日内交易
  {
    path: '/stockRecharge',
    name: 'StockRecharge',
    component: stockRecharge
  },
  {
    path: '/stockRechargeoreder',
    name: 'StockRechargeoreder',
    component: stockRechargeoreder
  },

  //资金相关
  {
    path: '/assets',
    name: 'Assets',
    component: Assets
  },
  // 充值
  {
    path: '/recharge',
    name: 'Recharge',
    meta: {
      key: 'RECHARGE'
    },
    component: Recharge
  },
  // 充值申请
  {
    path: '/recharge-apply',
    name: 'RechargeApply',
    component: RechargeApply
  },
  // 充值记录
  {
    path: '/recharge-order',
    name: 'RechargOrder',
    component: RechargeOrder
  },
  // 充值详情
  {
    path: '/recharge-detail',
    name: 'RechargDetail',
    component: RechargeDetail
  },
  // 提现
  {
    path: '/withdraw',
    name: 'Withdraw',
    meta: {
      key: 'WITHDRAW'
    },
    component: Withdraw
  }, // 提现申请
  {
    path: '/withdraw-apply',
    name: 'WithdrawApply',
    component: WithdrawApply
  },
  // 提现记录
  {
    path: '/withdraw-order',
    name: 'WithdrawOrder',
    component: WithdrawOrder
  },
  // 提现详情
  {
    path: '/withdraw-detail',
    name: 'WithdrawDetail',
    component: WithdrawDetail
  },
  // 兑换
  {
    path: '/swap',
    name: 'Swap',
    meta: {
      key: 'EXCHANGE'
    },
    component: Swap
  },
  //划转
  {
    path: '/transfer',
    name: 'Transfer',
    meta: {
      key: 'TRANSFERFUNDS'
    },
    component: Transfer
  },
   // thb充值申请
   {
    path: '/recharge-thb',
    name: 'RechargeThb',
    component: RechargeThb
  },
  
]
