<!-- 快捷充币 -->
<template>
  <HeaderBar :cuttentRight="cuttentRight" :currentName="_t18('recharge_fast', ['aams', 'vitc', 'robinhood2', 'aug'])"></HeaderBar>
  <RechargeList :data="coinList"></RechargeList>

  <!-- 人工匹配商家 -->
  <div class="custorm" @click="dispatchCustomEvent('event_serviceChange')"
    v-if="['dev'].includes(_getConfig('_APP_ENV'))">
    <div class="left">
      <image-load filePath="custorm.png" class="service-img"></image-load>
      <span class="text">{{ _t18('findCustorm') }}</span>
    </div>
    <div class="right">
      <van-icon name="arrow" size="16" />
    </div>
  </div>
  <!-- <div class="record-info" v-if="['macquarie'].includes(_getConfig('_APP_ENV'))">
    <div class="record-card" @click="dispatchCustomEvent('event_serviceChange')">
      <image-load filePath="record-coin.png" class="left-img"></image-load>
      <div class="record-right">
        <div>{{ _t18(`stock82`) }}</div>
        <image-load filePath="right-coin.png" class="right-img"></image-load>
      </div>
    </div>
  </div> -->
 
</template>

<script setup>
import { dispatchCustomEvent } from '@/utils'

import { _t18 } from '@/utils/public'
// import List from './recharge-list.vue'
import RechargeList from './components/RechargeList.vue'
import { filterCoin2 } from '@/utils/public'
import { useMainStore } from '@/store/index.js'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const mainStore = useMainStore()
import { useToast } from '@/hook/useToast'
const { _toast, _showName } = useToast()
/**
 * 充值方式列表
 * [{ icon: 'usdt', type: '0', title: 'USDT - ERC' ,address:'111111'},{ icon: 'btc', type: '0', title: 'BTC' ,address:'222222'},]
 */
 const cuttentRight = reactive({
  iconRight: [
    { iconName: 'sub-record', clickTo: '/recharge-order' }
  ]

 
})
const coinList = computed(() => {
  let rechargeList = mainStore.getRechargeList
  if (['smartfund'].includes(__config._APP_ENV)) {
    rechargeList = rechargeList.filter((item, index) => {
      return item.address != ''
    })
    let rechargeList2 = mainStore.getRechargeList.filter((item, index) => {
      return item.address == '' && item.coin == 'usdt'
    })
    mainStore.getRechargeList2(
      rechargeList2.map((item, index) => {
        return {
          icon: filterCoin2(item.coin),
          // type: 0, //充值
          title: item.coinName.replace('/USDT', ''),
          address: item.address,
          coin: item.coin,
          type: item.coinName
        }
      })
    )
  }
  let list = []

  rechargeList.map((item, index) => {
    if (item.isShow) {
      let obj = {}
      // type:0数据货币，1银行卡
      if (item.coinName == "THB") {
        obj['icon'] = 'thb'
        // 银行卡充值
        obj['title'] = item.coinName
        obj['address'] = ''
        obj['isMCS'] = true
      } else if(item.coinName == "BANK") {
        obj['icon'] = 'card'
        // 银行卡充值
        obj['title'] = _showName('stock94')
        obj['address'] = ''
        obj['isMCS'] = true
      }else if(item.coinName ){
        obj['icon'] = filterCoin2(item.coin)
        obj['title'] = item.coinName
        obj['address'] = item.address
        obj['type'] = 0
      }
      list.push(obj)
    }
  })
  return list



})
const $router = useRouter()
const toUrl = (item) => {

  $router.push(`/recharge-order`)
}
onMounted(() => {
  mainStore.getUserRechargeAddressAll()
})
</script>

<style lang="scss" scoped>
.custorm {
  margin-bottom: 30px;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left,
  .right {
    display: flex;
    align-items: center;

    .service-img {
      font-size: 20px;
      width: 28px;
      height: 28px;
      margin-right: 8px;
    }

    .text {
      font-size: 15px;
    }

    .jiantou {
      // font-size: 10px;
    }
  }
}

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
