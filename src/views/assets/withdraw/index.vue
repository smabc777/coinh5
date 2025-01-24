<!-- 提现 -->
<template>
  <HeaderBar :currentName="_t18('withdraw', ['latcoin'])"></HeaderBar>
  <WithdrawList :data="coinList"> </WithdrawList>
  <div class="record-info" v-if="['cmmetrics'].includes(_getConfig('_APP_ENV'))">
    <div class="record-card" @click="dispatchCustomEvent('event_serviceChange')">
      <image-load filePath="record-coin.png" class="left-img"></image-load>
      <div class="record-right">
        <div>{{ _t18(`stock83`) }}</div>
        <image-load filePath="right-coin.png" class="right-img"></image-load>
      </div>
    </div>
  </div>
  <div class="record-info">
    <div class="record-card" @click="toUrl">
      <image-load filePath="record-coin.png" class="left-img"></image-load>
      <div class="record-right">
        <div>{{ _t18(`coin_withdrawal_record`, ['vitc']) }}</div>
        <image-load filePath="right-coin.png" class="right-img"></image-load>
      </div>
    </div>
  </div>
</template>
<script setup>
import { dispatchCustomEvent } from '@/utils'

import { _t18 } from '@/utils/public'
import WithdrawList from './components/WithdrawLists.vue'
import { filterCoin2 } from '@/utils/public'
import { useMainStore } from '@/store/index.js'
const mainStore = useMainStore()
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user/index'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const $router = useRouter()
const toUrl = (item) => {
  $router.push(`/withdraw-order`)
}
const userStore = useUserStore()
// 用户余额信息
const { asset } = storeToRefs(userStore)
// 提现方式列表
const coinList = computed(() => {
  let list = []
  console.log(9988, mainStore.getWithdrawList)

  mainStore.getWithdrawList.forEach((item, index) => {
    // status:0关闭，1开启
    if (item.status == '1') {
      let obj = {}
      obj['type'] = 1 //提现
      obj['ratio'] = item.ratio || '' //手续费
      obj['fee'] = item.fee //固定手续费
      // type:0数据货币，1银行卡
      if (item.type == 0) {
        obj['icon'] = item.rechargeType
        obj['title'] = item.rechargeName
      } else {
        obj['icon'] = 'card'
        // 银行卡提现
        obj['title'] = _t18('withdraw_card')
        obj['card'] = filterCoin2(item.rechargeType).toLocaleUpperCase()
      }

      list.push(obj)
    }
  })
  return list
})
// const coinList = computed(() => {
//   let list = []
//   list = [
//     { icon: 'usdt', type: '1', title: 'USDT - TRC' },
//     { icon: 'usdt', type: '1', title: 'USDT - ERC' },
//     { icon: 'btc', type: '1', title: 'BTC' },
//     { icon: 'eth', type: '1', title: 'ETH - ERC' },
//     { icon: 'usdc', type: '1', title: 'USDC' },
//     { icon: 'card', type: '2', title: '银行卡提现' }
//   ]
//   return list
// })
</script>

<style lang="scss" scoped>
.record-info {
  padding: 0 16px;

  .record-card {
    display: flex;
    align-items: center;
    background: var(--ex-assets--record-card-color);
    border-radius: 6px;
    padding: 11px 13px;

    .left-img {
      width: 16px;
      height: 16px;
    }

    .record-right {
      margin-left: 8px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      div {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: var(--ex-assets--record-font-color);
      }

      .right-img {
        width: 15px;
        height: 10px;
      }
    }
  }
}

.record-info {
  margin-bottom: 20px;
}
</style>
