<template>

  <div class="Optional">

    <!--添加-->
    <div class="Optional-edit" v-if="currentList.length">
      <div>{{ _t18(`quote_spot`) }}</div>
      <div @click="OptionalEditShow = true">
        <van-icon name="edit" size="22" color="var(--ex-default-font-color)" />
      </div>
    </div>

    <!--筛选-->
    <QuoteFilter></QuoteFilter>

    <div class="Quote-list" v-if="currentList.length">
      <div class="Quote-list-item" v-for="item in filterKeyCoin(currentList, searchName, 2)" :key="item.id"
        @click="linkTo(item)">

        <div class="Quote-list-left">
          <!-- 币图标 -->
          <image-load :filePath="item.icon" class="Quote-list-img" />
          <!-- 币名称 -->
          <span class="ff-num"> {{ item.coin?.toUpperCase() }}</span>
        </div>

        <div class="Quote-list-right">
          <div class="fw-bold Quote-list-right-text">
            {{ priceFormat(tradeStore.allCoinPriceInfo[item.coin]?.close) }}
          </div>
          <div class="rightBox" :class="[
      _isRFD(
        tradeStore.allCoinPriceInfo[item.coin]?.openPrice,
        tradeStore.allCoinPriceInfo[item.coin]?.close
      ),
      'rfd-sign rfd-bg rightRight fw-num'
    ]">
            <span>{{ tradeStore.allCoinPriceInfo[item.coin]?.priceChangePercent }}%</span>
          </div>
        </div>

      </div>
    </div>

    <div class="Optional-add-but" v-else>
      <Nodata></Nodata>
      <van-button type="primary" icon="plus" color="var(--ex-primary-color)" @click="OptionalAddShow = true">
        {{ _t18(`quote_addOwn`, ['vitc']) }}
      </van-button>
    </div>

    <!--自选弹窗-->
    <!--  添加-->
    <OptionalAdd></OptionalAdd>
    <!--  编辑-->
    <OptionalEdit></OptionalEdit>
  </div>


</template>

<script setup>
import OptionalAdd from "./components/Optional-Add.vue";
import OptionalEdit from "./components/Optional-Edit.vue";
import QuoteFilter from "@/components/QuoteFilter/index.vue";
import { _getConfig, _isRFD, _t18 } from "@/utils/public";
import { priceFormat } from "@/utils/decimal";
import { useTradeStore } from "@/store/trade";
import { getCollect } from "@/api/trade";
import { filterKeyCoin } from "@/utils/filters";

const tradeStore = useTradeStore()
const router = useRouter()

// 自选列表
const isActivated = ref(false)
const currentList = ref([])

//添加/编辑 自选弹窗
const OptionalAddShow = ref(false)
const OptionalEditShow = ref(false)
const CloseOptionalShow = async () => {
  OptionalAddShow.value = false
  OptionalEditShow.value = false

  await nextTick()
  console.log('asdas')
  // 刷新自选列表
  await getCollectList()
  // 刷新币种
  await tradeStore.getCoinList()
}
provide('OptionalAddShow', OptionalAddShow)
provide('OptionalEditShow', OptionalEditShow)
provide('CloseOptionalShow', CloseOptionalShow)


//搜索key
const searchName = inject('searchName')


const getCollectList = async () => {
  isActivated.value = true
  const res = await getCollect()
  if (res?.code == 200) {
    currentList.value = res.data
  }
}

onMounted(() => {
  if (!isActivated.value) {
    getCollectList()
  }


})

onActivated(() => {
  if (isActivated.value) {
    getCollectList()
  }
})

//自选行情数据
const setCurrentList = (val) => {
  currentList.value = val
}
provide('currentList', currentList)
provide('setCurrentList', setCurrentList)

//跳转交易
const linkTo = (item) => {
  if (['cmmetrics'].includes(_getConfig('_APP_ENV'))) {
    $router.push(`/trade?tradeKey=Ustandard&symbol=${item.coin}`)
    return false
  }
  router.push(`/trade?symbol=${item.coin}&tradeKey=SecondContract`)
}
</script>

<style scoped lang="scss">
.Optional {
  margin-top: 16px;
  padding-right: .5px;

  .Optional-edit {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    color: var(--ex-home-tabs-text-color);
    margin-bottom: 10px;

    div:nth-of-type(2) {
      padding-left: 10px;
    }
  }

  .Optional-add-but {
    display: flex;
    flex-direction: column;
    justify-content: center;

    :deep(.van-button) {
      height: 46px;
    }
  }

  .BBTrading-filter {

    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--ex-home-tabs-text-color);

    .BBTrading-filter-item {
      display: flex;
      align-items: center;

      .itemImg {
        margin-left: 4px;
        width: 6px;
        height: 8px;
      }
    }

  }

  .Quote-list {
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
          width: 28px;
          height: 28px;
          margin-right: 8px;
          margin-left: 1px;
          //border-radius: 10px;
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
