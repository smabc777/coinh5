<template>
  <div class="assets">
    <!-- shrink -->
    <van-tabs  v-model:active="tabActive" line-width="0" :ellipsis="false" swipeable animated
      @click-tab="clickTab">
      <van-tab v-for="(item, index) in tabList" :key="index" :name="item.name">
        <template #title>
          <div class="tab-item" :class="{ atv: item.name == tabActive }">
            <!-- {{ item.name }} -->
            {{ _showName(item.keyStr) }}
          </div>
        </template>
        <template #default>
          <keep-alive>
            <component ref="childComp" :is="item.componentName" :amountSum="amountSum" :assetDetails="assetDetails"
              @handleYanjin="handleYanjin" @handleShuaxin="handleShuaxin" :showNum="showNum" :type="item.name"
              :keyStr="item.keyStr"></component>
          </keep-alive>
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Plat from './components/account/Plat.vue'
import Financ from './components/account/Finac.vue'
import Contarct from './components/account/Contarct.vue'
import Stock from './components/account/Stock.vue'

export default {
  name: 'Assets',
  components: {
    Stock,
    Plat,
    Financ,
    Contarct
  }
}
</script>
<script setup>
import { _add } from '@/utils/decimal'
import { priceFormat, countFormat, currencyFormat } from '@/utils/decimal.js'
import { useUserStore } from '@/store/user/index'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { storageDict } from '@/config/dict'
import { showLoadingToast } from 'vant'
import { getFreezeList } from '@/api/user'
import { onMounted } from 'vue'
import { DIFF_FREEZE_ASSETS, DIFF_SHOW_USER_TEST } from '@/config/index'
import { useToast } from '@/hook/useToast'
import { _getConfig } from '@/utils/public'
import { useRouter, useRoute } from 'vue-router'


const router = useRouter()
const route = useRoute()

const { _toast, _showName } = useToast()
const userStore = useUserStore()
const mainStore = useMainStore()

// tabs数据
const tabList = computed(() => {
  // 对应参数key值 -->1 平台资产 2理财资产 3合约账户 4 股票资产
  const key = { 股票资产: 'Stock', 平台资产: 'Plat', 理财资产: 'Financ', 合约资产: 'Contarct' }
  const data = mainStore.getAssetsTabList.filter((item) => item.isOpen)
  const list = data.map((item) => {
    return {
      componentName: key[item.name],
      ...item
    }
  })
  return list.sort((a, b) => a.sort - b.sort)
})

const tabActive = ref(tabList.value[0]?.name || '')



const isShow = ref(false)
const handleChange = (e) => {
  isShow.value = e
}

/**
 * 账户信息
 */
const childComp = ref(null)
const curIndex = ref('0')
const clickTab = (e) => {
  if (curIndex.value != e.name) {
    userStore.getUserInfo()
    curIndex.value = e.name
  }
  if (e.name == "股票资产") {
    childComp.value[1]?.getaccountStatisticslist()
    childComp.value[1]?.onClickTab(0)
  }
}

const showNum = ref(localStorage.getItem(storageDict.EYES) == 'true' || true)
// 点击小眼睛
const handleYanjin = () => {
  showNum.value = !showNum.value
  localStorage.setItem(storageDict.EYES, showNum.value)
}

// 点击刷新
const handleShuaxin = () => {
  showLoadingToast({
    forbidClick: true,
    duration: 0
  })
  userStore.getUserInfo()
  getAccountFreezeList()
}

// 用户余额信息
const { asset } = storeToRefs(userStore)
const assetDetails = computed(() => {
  let list = []
  //[{icon: 'usdt', title: 'USDT', keyong: 100, zhanyong: 100, zhehe: 100}]
  asset.value.forEach((item, index) => {
    // 之前两块多平台判断逻辑是一样的 -> 精简合并
    if (
      (item.type == 1 && tabActive.value == '平台资产') ||
      (item.type == 2 && tabActive.value == '理财资产') ||
      (item.type == 3 && tabActive.value == '合约资产') ||
      (item.type == 9 && tabActive.value == '股票资产')
    ) {

      let obj = {}
      obj['keyong'] = priceFormat(item.availableAmount)
      // rxce冻结金额=占用+冻结
      if (DIFF_FREEZE_ASSETS.includes(__config._APP_ENV)) {
        let temp = 0
        if (freezeList.value) {
          freezeList.value.forEach((itm, inx) => {
            if (itm.coin == item.symbol && item.type == 1) {
              temp = itm.price
            }
          })
        }
        obj['zhanyong'] = priceFormat(_add(item.occupiedAmount, temp))
      } else {
        obj['zhanyong'] = priceFormat(item.occupiedAmount)
      }
      obj['zhehe'] = priceFormat(item.exchageAmount)
      // 类型为股票 持仓市值和目前获利字段处理
      if (item.type == 9) {
        obj['chicang'] = priceFormat(item.occupiedAmount)
        obj['lirun'] = priceFormat(item.nowProfitAmount)
      }
      if (item.symbol == 'usdt') {
        obj['icon'] = 'usdt'
        obj['loge'] = item.loge
        obj['title'] = 'USDT'
        list.unshift(obj)
      } else {
        obj['loge'] = item.loge
        obj['title'] = item.symbol?.replace('usdt', '').trim().toLocaleUpperCase()
        obj['icon'] = item.symbol?.replace('usdt', '').trim().toLowerCase()
        list.push(obj)
      }
    }
  })
  return list
})
// console.log('--------', assetDetails.value)

// 计算账户余额
const amountSum = computed(() => {
  let sum = 0
  for (let i = 0; i < assetDetails.value.length; i++) {
    sum += Number(assetDetails.value[i].zhehe)
  }
  return priceFormat(sum)
})

const freezeList = ref()

// 获取冻结资产
const getAccountFreezeList = async () => {
  if (DIFF_FREEZE_ASSETS.includes(__config._APP_ENV)) {
    const res = await getFreezeList()
    if (res.code == '200') {
      freezeList.value = res.data
    }
  }
}
watch(
  () => route.query.name,
  () => {
    tabActive.value = route.query.name
    setTimeout(() => {
      if(childComp?.value[1]?.getaccountStatisticslist){
        childComp?.value[1]?.getaccountStatisticslist() 
        childComp?.value[1]?.onClickTab(0) 
      }
     
    }, 50);
  },
  { immediate: true }
)
onMounted(() => {

  mainStore.getSettingConfig()
  // console.log(route.query.name);
  console.log(route.query.name, 'bbbbbb78');

  // if () {
  //   
  //   console.log(route.query.name, 'bbbbbb');


  // }

  getAccountFreezeList()

})

</script>

<style lang="scss" scoped>
.assets {
  :deep(.van-tabs) {
    overflow: hidden;
    padding: 15px 0 16px;
    background: var(--ex-default-background-color);

    .van-tabs__wrap {
      padding: 0 16px;
      background: var(--ex-default-background-color);
    }

    .van-tabs__nav {
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      border-radius: 10px;
      padding: 0;
      background: var(--ex-home-tabs-bg-color);
    }

    .tab-item {
      padding: 9px 20px;
      width: 100%;
      font-size: 14px;
      color: var(--ex-home-tabs-text-color);

      &.atv {
        font-size: 15px;
        color: var(--ex-home-tabs-text-atv-color);
      }
    }

    .van-tab--active {
      background: var(--ex-home-tabs-bg-atv-color);
      color: var(--ex-home-tabs-text-atv-color);
      border-radius: 10px;
    }
  }
}
</style>
