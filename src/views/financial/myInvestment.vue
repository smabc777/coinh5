<!-- 我的投资 -->
<template>
  <div class="columnFlex">
    <HeaderBar :currentName="_t18(`my_invest`)" />
    <div class="subtitle">
      <div></div>
      <div>{{ _t18(`transaction_statistics`) }}</div>
      <div></div>
    </div>
    <div class="invest">
      <!-- 总投入价值 -->
      <div class="item">
        <div>{{ _t18(`sum_bet_value`) }}(USDT)</div>
        <div class="item-value fw-num">{{ headerObj.sumAmount }}</div>
      </div>
      <!-- 当日赚取奖励 -->
      <div class="item">
        <div>{{ _t18(`earn_rewards`) }}(USDT)</div>
        <div class="item-value fw-num">{{ headerObj.commission }}</div>
      </div>
      <!-- 累计收益 -->
      <div class="item">
        <div>{{ _t18(`Cumulative_income`) }}(USDT)</div>
        <div class="item-value blueColor fw-num">{{ headerObj.sumEarn }}</div>
      </div>
      <!-- 持仓数量 -->
      <div class="item">
        <div>{{ _t18(`number_of_positions`) }}</div>
        <div class="item-value">{{ headerObj.position }}</div>
      </div>
    </div>
    <!-- 交易记录 -->
    <div class="subtitle">
      <div></div>
      <div>{{ _t18(`transaction_record`) }}</div>
      <div></div>
    </div>
    <div class="recordList">
      <div v-if="list.length > 0 ">
        <RecordItem v-for="item in list" :key="item" :itemObj="item"></RecordItem>
      </div>
      <Nodata v-else></Nodata>
    </div>
  </div>
</template>
<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import RecordItem from './components/RecordItems.vue'
import { ref, onMounted } from 'vue'
import { investmentList, personalIncome } from '@/api/financial/index'
import { _t18 } from '@/utils/public'
import { _toFixed } from '@/utils/decimal'
const headerObj = ref({})
const list = ref([])
const pageNum = ref(1)
const pageSize = ref(9999)
const isShow = ref(false)
const loading = ref(false)
const finished = ref(false)
const total = ref(0)
const onLoad = async () => {
  try {
    const data = await getInvestment()
    list.value = data
  } catch (error) {
  } finally {
    loading.value = false
  }
}
const allList = async () => {
  try {
    const res = await personalIncome()
    if (res.code === 200) {
      headerObj.value = res.data
    }
  } catch (error) {}
}
const getInvestment = async () => {
  try {
    const res = await investmentList(pageNum.value, pageSize.value)
    if (res.code === 200) {
      total.value = res.total
      return res.rows
    }
  } catch (error) {}
}
onMounted(() => {
  allList()
  onLoad()
})
</script>
<style lang="scss" scoped>
.columnFlex {
  height: 100vh;
}
.subtitle {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
  :not(:nth-child(2)) {
    width: 69px;
    height: 1px;
    background: var(--ex-financial-line-bg-color);
  }
  :nth-child(2) {
    font-size: 15px;
    font-weight: 400;
    margin: 0 5px;
  }
}
.invest {
  padding: 10px 15px;
  display: grid;
  grid-template-columns: 164px 164px;
  grid-column-gap: 11px;
  grid-row-gap: 11px;
  .item {
    padding: 14px;
    border-radius: 5px;
    background: var(--ex-financial-card-bg-color);
    color: var(--ex-passive-font-color);
    display: flex;
    flex-direction: column-reverse;
    font-size: 12px;
    .item-value {
      margin-bottom: 3px;
      font-size: 16px;
      color: var(--ex-default-font-color);
    }
  }
}
.recordList {
  padding: 10px 15px;
  flex: 1;
  overflow: auto;
}
:deep(.van-list__finished-text) {
  height: 79px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--ex-passive-font-color);
}
</style>
