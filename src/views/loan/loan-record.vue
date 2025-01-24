<template>
  <div>
    <!-- 导航条 -->
    <HeaderBar :currentName="_t18('loan_order', ['aams', 'vitc', 'aug'])" :cuttentRight="cuttentRight"></HeaderBar>
    <!--内容-->
    <!-- <div class="content">
      <van-tabs :active="active" @click-tab="handleClick">
        <van-tab v-for="item in headerList" :title="item.name">
          <LoanItem v-for="data in dataList" :dataList="data" :key="data"></LoanItem
        ></van-tab>
      </van-tabs>
    </div> -->
    <Tab :tabList="tabList" :active="curIndex" @change="changeIndex">
      <template #tabContent>
        <!-- release_refresh释放即可刷新 -->
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :loading-text="_t18(`loading`)"
          :loosing-text="_t18(`release_refresh`)">
          <!-- 加载中动画 -->
          <van-loading v-if="showLoading" />
          <!-- 数据列表 -->
          <div v-else>
            <!-- 没有更多数据了 no_more_data 加载中  loading-->
            <van-list v-if="tabContentList.length > 0" v-model:loading="loading" :finished="finished"
              :finished-text="_t18(`no_more_data`)" :loading-text="_t18(`loading`)" @load="onLoad">
              <div v-for="(item, index) in tabContentList" :key="index" class="record-list">
                <LoanCard :dataList="item"></LoanCard>
              </div>
            </van-list>
            <!-- 数据为空 -->
            <Nodata v-else />
          </div>
        </van-pull-refresh>
      </template>
    </Tab>
  </div>
</template>

<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import LoanCard from './components/LoanCard.vue'
import { getLoanOrderList } from '@/api/loan.js'
import Tab from '@/components/Tab/index.vue'
import { dict } from '@/api/common/index'
import { _t18 } from '@/utils/public'
import { nextTick } from 'vue'
const refreshing = ref(false) //下拉刷新的加载展示
const showLoading = ref(true) //加载动画
const loading = ref(false) //分页加载
const finished = ref(false) //数据是否加载完成
//下拉加载事件（初始化数据）
const onRefresh = () => {
  refreshing.value = false
  showLoading.value = true
  finished.value = false
  pageNum.value = 1
  loading.value = true
  tabContentList.value = []
  getList()
}

const curIndex = ref(0)
const tabList = computed(() => {
  let list = []
  // list = ['全部', '待审核', '审核成功', '审核失败', '已结清', '已逾期']
  list = [
    _t18('loan_tab_all', ['aams', 'aug', 'vitc']),
    _t18('loan_tab_wait'),
    _t18('loan_tab_success'),
    _t18('loan_tab_err'),
    _t18('loan_tab_complete'),
    _t18('loan_tab_overdue')
  ]
  return list
})
/**
 * 充值记录查询
 * pageNum页码
 * pageSize每页条数
 * total总条数
 */
onMounted(async () => {
  // await getDict()
})
const dictList = ref()
const getDict = async () => {
  const res = await dict('t_repay_type')
  if (res.code == 200) {
    dictList.value = res.data
  }
}
const pageNum = ref(1)
const pageSize = ref(3)
const total = ref(0)
const tabContentList = ref([]) //数据列表
//数据列表
const getList = async () => {
  let params = `pageNum=${pageNum.value}&pageSize=${pageSize.value}`
  // 排除全部时不传参数
  if (curIndex.value != '0') {
    params = `status=${curIndex.value - 1}&pageNum=${pageNum.value}&pageSize=${pageSize.value}`
  }
  console.log(dictList, 'mmmmmmmmm');
  await getDict()

  const res = await getLoanOrderList(params)
  if (res.code == '200') {
    setTimeout(() => {
      // 页面加载动画，下拉刷新动画
      if (showLoading.value) {
        showLoading.value = false
      }
      if (refreshing.value) {
        refreshing.value = false
      }
    }, 200)
    //分页加载动画
    loading.value = false
    tabContentList.value = tabContentList.value.concat(res.rows)
    total.value = res.total
    if (tabContentList.value.length >= total.value) {
      finished.value = true
    }
    pageNum.value++
  } else {
    finished.value = true
    loading.value = false
    showLoading.value = false
    refreshing.value = false
  }
}
const onLoad = () => {
  loading.value = true
  getList()
}
const changeIndex = (v) => {
  curIndex.value = v
  showLoading.value = true
  tabContentList.value = []
  finished.value = false
  pageNum.value = 1
  loading.value = true
}
watch(
  curIndex,
  () => {
    getList()
  },
  {
    immediate: true
  }
)
watch(tabContentList, (newValue) => {

  newValue.forEach((item, index) => {
    dictList.value?.forEach((itm, idx) => {

      if (item.tloadProduct?.repayType == itm.dictValue) {

        nextTick(() => {
          item['repayTypeLabel'] = itm.dictLabel
        })
      }
    })
  })
})
</script>
<style lang="scss" scoped>
// :deep(.van-tabs--line .van-tabs__wrap) {
//   margin-bottom: 15px;
// }

.van-loading {
  text-align: center;
  padding: 30px;
}

:deep(.van-tabs) {
  background: var(--ex-home-tabbar-background-color) !important;
}

:deep(.van-tabs__nav) {
  background: var(--ex-home-tabbar-background-color) !important;
}

:deep(.van-tab) {
  color: var(--ex-placeholder-font) !important;
  background: var(--ex-home-tabbar-background-color) !important;
}

:deep(.van-tabs__line) {
  bottom: 6px !important;
  background: var(--ex-default-font-color) !important;
}

:deep(.van-tab--active) {
  color: var(--ex-default-font-color) !important;
}

.record-list {
  padding: 16px 16px 0;
}

:deep(.tabContent) {
  border-top: none !important;
}
</style>
