<template>
  <van-popup v-model:show="OptionalEditShow" position="bottom" round teleport="body"
    :style="{ height: '80%', maxWidth: 'var(--ex-max-width)' }" @close="CloseOptionalShow">
    <div class="Optional-Edit">

      <!--      搜索/完成-->
      <div class="search">
        <!-- 搜索 -->
        <van-field autocomplete="off" class="searchInput" v-model="searchName" center
          :placeholder="_t18(`search_currency`)">
          <template #button>
            <van-icon size="20" color="var(--ex-default-font-color)" name="search" />
          </template>
        </van-field>
        <div class="Optional-Edit-Ok" @click="submit">
          <van-button type="primary" size="20" color="var(--ex-active-font-color)">{{
    _t18(`quote_finish`)
  }}
          </van-button>
        </div>

      </div>


      <!--      列表-->
      <div class="Quote-list">
        <div class="Quote-list-item" v-for="(item, index) in currentCoinList" :key="index">

          <div class="Quote-list-left" @click="linkTo(item)">
            <!-- 币图标 -->
            <image-load :filePath="item.logo" class="Quote-list-img" />
            <!-- 币名称 -->
            <span class="ff-num"> {{ item.showSymbol }}</span>
          </div>

          <div class="Quote-list-right" @click="onisCollect(item)">
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
            <van-icon name="checked" size="18"
              :color="item.isCollect === 1 ? 'var(--ex-active-font-color)' : 'var(--ex-passive-font-color)'" />
          </div>

        </div>
      </div>

      <!--      批量操作-->

      <div class="Optional-Edit-bottom">
        <div class="delete" @click="onDelete">
          <van-icon name="delete" size="18"
            :color="allFlag ? 'var(--ex-font-color15)' : 'var(--ex-passive-font-color)'" />
          {{ _t18('quote_del') }}
        </div>
        <div class="checked" @click="onChecked">
          <van-icon name="checked" size="18"
            :color="allFlag ? 'var(--ex-active-font-color)' : 'var(--ex-passive-font-color)'" />
          {{ _t18('quote_all') }}
        </div>
      </div>

    </div>

  </van-popup>

</template>

<script setup>

import { _getConfig, _isRFD, _t18 } from "@/utils/public";
import { useToast } from "@/hook/useToast";
import { useTradeStore } from "@/store/trade";
import { useRouter } from "vue-router";
import { removeCollect, removeCollectRemoves, setCollect, setCollectAdds } from "@/api/trade";
import { showToast } from "vant";

import PublicPopup from '@/components/Popup/public.vue'

const tradeStore = useTradeStore()
const $router = useRouter()
const { _toast } = useToast()

//当前自选列表数据
const currentList = inject('currentList')

// 显示弹窗
const OptionalEditShow = inject('OptionalEditShow')

//关闭弹窗触发刷新列表
const CloseOptionalShow = inject('CloseOptionalShow')

// 搜索 key
const searchName = ref('')
// 现货数据
const currentCoinList = computed(() => {
  if (['cmmetrics'].includes(_getConfig('_APP_ENV'))) {
    return tradeStore.contractCoinList.filter(item => item.showSymbol.toLowerCase().includes(searchName.value.toLowerCase()))
  } else {
    return tradeStore.secondContractCoinList.filter(item => item.showSymbol.toLowerCase().includes(searchName.value.toLowerCase()))
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

const onisCollect = (item) => {
  item.isCollect = item.isCollect == 2 ? 1 : 2
}


//批量操作全选
const allFlag = ref(false)
const onChecked = () => {
  allFlag.value = !allFlag.value
  currentCoinList.value.forEach((item) => {
    // 批量设置收藏添加
    item.isCollect = allFlag.value ? 1 : 2
  })
}

//完成提交
const submit = async () => {
  let resultEditArr = []
  currentCoinList.value.forEach((item) => {
    // 批量设置收藏添加
    if (item.isCollect == 1) {
      resultEditArr.push({
        coin: item.coin,
        icon: item.logo
      })
    }
  })

  if (!resultEditArr.length) return false
  //保存
  const res = await setCollectAdds(resultEditArr, { loading: true })
  if (res.code == '200') {
    _toast('quote_addSuccess')
    await nextTick()
    CloseOptionalShow()
  } else {
    showToast(res.msg)
  }
}
//批量操作删除
const onDelete = async () => {
  // 非批量操作
  if (!allFlag.value) return false
  let strArr = currentList.value.map(item => item.id)

  if (!strArr.length) return false

  // 删除收藏
  const res = await removeCollectRemoves(strArr.join(','), { loading: true })
  if (res.code == '200') {
    showToast(res.msg)
    await nextTick()
    CloseOptionalShow()
  } else {
    showToast(res.msg)
  }

}
</script>

<style scoped lang="scss">
.Optional-Edit {
  display: flex;
  flex-direction: column;

  height: 100%;
  position: relative;
  padding-top: 66px;
  padding-bottom: 70px;


  .search {
    position: absolute;
    top: 16px;
    left: 0;
    width: 100%;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    :deep(.searchInput) {
      height: 50px;
      border-radius: 8px;
      background: var(--ex-default-background-color);
    border: 1px solid var(--ex--backup-background-color-2);

    }

    .Optional-Edit-Ok {
      margin-left: 20px;
      min-width: 60px;

      :deep(.van-button) {
        width: 100%;
        height: 36px;
      }

    }
  }


  .Quote-list {
    overflow: auto;
    padding-top: 4px;
    padding: 0 16px;

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

  .Optional-Edit-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 26px 16px;
    width: 100%;
    border-top: var(--ex-border-color) 1px solid;

    div {
      display: flex;
      line-height: normal;
      align-items: center;
      font-size: 14px;

      i {
        margin-right: 6px;
      }
    }
  }
}
</style>
