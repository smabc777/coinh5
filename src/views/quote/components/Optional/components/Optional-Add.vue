<template>
  <van-popup v-model:show="OptionalAddShow" position="bottom" teleport=".quote" round :style="{ height: '80%' }"
    @close="CloseOptionalShow">
    <div class="Optional-Add">
      <!-- 搜索 -->
      <van-field autocomplete="off" class="searchInput" v-model="searchName" center
        :placeholder="_t18(`search_currency`)">
        <template #button>
          <van-icon size="20" color="var(--ex-default-font-color)" name="search" />
        </template>
      </van-field>

      <div class="Quote-list">
        <div class="Quote-list-item" v-for="(item, index) in currentCoinList" :key="index">
          <div class="Quote-list-left" @click="linkTo(item)">
            <!-- 币图标 -->
            <image-load :filePath="item.logo" class="Quote-list-img" />
            <!-- 币名称 -->
            <span class="ff-num"> {{ item.showSymbol }}</span>
          </div>

          <div class="Quote-list-right" @click="handelCollect(item)">
            <!--            <div class="fw-bold Quote-list-right-text">-->
            <!--              {{ priceFormat(tradeStore.allCoinPriceInfo[item.coin]?.close) }}-->
            <!--            </div>-->
            <div class="rightBox" :class="[
    _isRFD(
      tradeStore.allCoinPriceInfo[item.coin]?.openPrice,
      tradeStore.allCoinPriceInfo[item.coin]?.close
    ),
    'rfd-sign rfd-bg rightRight fw-num'
  ]">
              <span>{{ tradeStore.allCoinPriceInfo[item.coin]?.priceChangePercent }}%</span>
            </div>
            <van-icon name="star" size="20" :color="item.isCollect === 1
    ? 'var(--ex-active-font-color)'
    : 'var(--ex-passive-font-color)'
    " />
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { _getConfig, _isRFD, _t18 } from '@/utils/public'
import { useTradeStore } from '@/store/trade'
import { useRouter } from 'vue-router'
import { removeCollect, setCollect } from '@/api/trade'
import { showToast } from 'vant'

const tradeStore = useTradeStore()
const $router = useRouter()
// 显示弹窗
const OptionalAddShow = inject('OptionalAddShow')
// 搜索 key
const searchName = ref('')
// 现货数据
const currentCoinList = computed(() => {
  if (['cmmetrics'].includes(_getConfig('_APP_ENV'))) {
    return tradeStore.contractCoinList.filter((item) =>
      item.showSymbol.toLowerCase().includes(searchName.value.toLowerCase())
    )
  } else {
    return tradeStore.secondContractCoinList.filter((item) =>
      item.showSymbol.toLowerCase().includes(searchName.value.toLowerCase())
    )
  }
})

//跳转秒合约
const linkTo = (item) => {
  if (['cmmetrics'].includes(_getConfig('_APP_ENV'))) {
    $router.push(`/trade?tradeKey=Ustandard&symbol=${item.coin}`)
    return false
  }
  $router.push(`/trade?tradeKey=SecondContract&symbol=${item.coin}`)
  // emit('linkTo', item.coin, Number(0))
}
//关闭弹窗触发刷新列表
const CloseOptionalShow = inject('CloseOptionalShow')

// 收藏
const handelCollect = async (item) => {
  // isCollect    1  收藏   2 未收藏
  let params = { coin: item?.coin }
  var res = null
  if (item.isCollect == 2) {
    params['icon'] = item?.logo
    res = await setCollect(params, { loading: true })
    if (res.code == '200') {
      item.isCollect = 1
    }
  } else {
    res = await removeCollect(params, { loading: true })
    if (res.code == '200') {
      item.isCollect = 2
    }
  }

  if (res.code == '200') {
    showToast(res.msg)
    // await tradeStore.getCoinList()
  } else {
    showToast(res.msg)
  }
}
</script>

<style scoped lang="scss">
.Optional-Add {
  display: flex;
  flex-direction: column;
  padding: 20px 16px;

  :deep(.searchInput) {
    height: 50px;
    border-radius: 8px;
    background: var(--ex-default-background-color);
  }

  .Quote-list {
    flex: 1;
    overflow: auto;
    padding-top: 4px;

    .Quote-list-item {
      display: flex;
      justify-content: space-between;
      padding: 14px 0;
      border-radius: 10px;

      .Quote-list-left {
        display: flex;
        align-items: center;

        .Quote-list-img {
          width: 34px;
          height: 34px;
          margin-left: 1px;
          margin-right: 8px;
        }

        span {
          font-size: 15px;
        }
      }

      .Quote-list-right {
        display: flex;
        align-items: center;

        .Quote-list-right-text {
          font-size: 14px;
          margin-right: 30px;
        }

        .rightBox {
          font-size: 14px;
          margin-right: 10px;
          border-radius: 5px;
          padding: 7.2px 10px;
          min-width: 68px;
          //min-height: 30px;
          line-height: normal;
          text-align: center;
        }
      }
    }
  }
}
</style>
