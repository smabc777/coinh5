<template>
  <div class="quote-filter">
    <div class="filter-item" @click="toDealSort">
      <span>{{ _t18(`home_currencyName`) }}</span>
      <svg-load :name="firstIconArr[arrowList.firstIcon]" class="itemImg"></svg-load>
    </div>
    <div class="filter-item" @click="toUpSort">
      <span>{{ _t18(`home_newPrice`) }}</span>
      <svg-load :name="firstIconArr[arrowList.secondIcon]" class="itemImg"></svg-load>
    </div>
    <div class="filter-item" @click="toRafSort">
      <span>{{ _t18(`home_upDown`, ['vitc']) }}</span>
      <svg-load :name="firstIconArr[arrowList.thirdIcon]" class="itemImg"></svg-load>
    </div>
  </div>
</template>
<script setup>

import {_t18} from "@/utils/public";
import {
  LatestpriceLargeToSmall,
  LatestpriceSmallToLarge,
  letterLargeToSmall,
  letterSmallToLarge
} from "@/utils/filters";
import {useTradeStore} from "@/store/trade";

const tradeStore = useTradeStore()

// 筛选图标数据
const firstIconArr = ref(['moren', 'gao', 'di'])

// 当前筛选数据 0默认 1 a-z 2 z-a
const arrowList = ref({
  firstIcon: 0, //名称
  secondIcon: 0,//最新价
  thirdIcon: 0 //涨跌
})
// 当前筛选的数据
const currentList = inject('currentList')
// 设置数据
const setCurrentList = inject('setCurrentList')

//设置筛选key
const resetArrow = (key) => {
  //清除其他筛选项
  for (const keyKey in arrowList.value) {
    keyKey != key && (arrowList.value[keyKey] = 0)
  }
  //设置当前筛选项
  arrowList.value[key] == 2 ? arrowList.value[key] = 0 : arrowList.value[key]++
}

// 切换名称
const toDealSort = async () => {
  // 设置当前筛选项
  resetArrow('firstIcon')
  let listResult = []

  if (arrowList.value.firstIcon === 0) {
    listResult = letterSmallToLarge(currentList.value, 'coin')
  } else if (arrowList.value.firstIcon === 1) {
    listResult = letterLargeToSmall(currentList.value, 'coin')
  } else {
    listResult = currentList.value
  }
  await nextTick()
  setCurrentList(listResult)
}

// 切换最新价
const toUpSort = async () => {
  // 设置当前筛选项
  resetArrow('secondIcon')
  await nextTick()

  let listResult = currentList.value

  if (arrowList.value.secondIcon === 0) {
    listResult = LatestpriceLargeToSmall(currentList.value, tradeStore.allCoinPriceInfo, 'close')
  } else if (arrowList.value.secondIcon === 1) {
    listResult = LatestpriceSmallToLarge(currentList.value, tradeStore.allCoinPriceInfo, 'close')
  }

  setCurrentList(listResult)

}
// 切换涨跌
const toRafSort = () => {
  // 设置当前筛选项
  resetArrow('thirdIcon')
  let listResult = []

  if (arrowList.value.thirdIcon === 0) {
    listResult = LatestpriceLargeToSmall(currentList.value, tradeStore.allCoinPriceInfo, 'change', 1)
  } else if (arrowList.value.thirdIcon === 1) {
    listResult = LatestpriceSmallToLarge(currentList.value, tradeStore.allCoinPriceInfo, 'change', 1)
  } else {
    listResult = currentList.value
  }

  setCurrentList(listResult)
}

</script>
<style scoped lang="scss">
.quote-filter {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ex-home-tabs-text-color);

  .filter-item {
    display: flex;
    align-items: center;

    .itemImg {
      margin-left: 4px;
      width: 6px;
      height: 8px;
    }
  }

}

</style>
