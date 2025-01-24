<template>
    <div class="content">
        <div class="second-tabs" v-if="headerSecondList.length > 1">
            <div class="second-tabs-list">
                <div class="second-tabs-list-item" v-for="(item, index) in headerSecondList" :key="index"
                    :class="[currentSecondIndex === index ? 'active' : '']" @click="clicSecondkTab(index)">
                    {{ item.type }}
                </div>
            </div>


        </div>
        <van-loading v-if="loading"></van-loading>
        <van-list v-if="dataNewList?.length > 0" :finished="finished"
            :finished-text="dataNewList?.length ? _t18(`no_more_data`) : ''" :loading-text="_t18(`loading`)"
            @load="onLoad" :immediate-check="false" v-model:loading="loading">
            <van-cell v-for="(data, index) in dataNewList" :key="index">
                <div class="hisToryList">
                    <p>{{ data.index }}</p>
                    <div class="header">
                        <div class="headerLeft">
                            <!-- 买 -->
                            <div class="name" v-if="data.orderDirection == '买涨'">{{ _t18(`buy`) }}</div>
                            <!-- 卖 -->
                            <div class="name name2" v-else>{{ _t18(`sell`) }}</div>
                            <div class="fw-bold">
                                {{

            data.stockCode
        }}
                            </div>
                        </div>
                        <div>
                            <div class="fw-num numItem" :class="[_isStockRFD(calculateProfitPercentageByTotal(
                data
            )), 'rfd-sign  rightRight fw-num tw']

            ">
                                {{
            calculateProfitPercentageByTotal(
                data
            )
        }} %
                            </div>

                        </div>

                    </div>
                    <div class="list">
                        <div class="item">
                            <div>{{ _t18(`stock28`) }}</div>
                            <div class="fw-num numItem">
                                {{ _toFixed(data.nowPrice || 0, 2) }} USD
                            </div>
                        </div>
                        <div class="item">
                            <div>{{ _t18(`bydfe_trade_tab5`) }}</div>
                            <div class="fw-num numItem">
                                {{ data.orderLever }}X
                            </div>
                        </div>
                        <div class="item">
                            <div>{{ _t18(`stock36`) }}</div>
                            <div class="fw-num numItem">
                                {{ data.orderNum }}
                            </div>
                        </div>

                        <div class="item">
                            <div>{{ _t18(`stock37`) }}</div>
                            <div class="fw-num numItem">
                                {{ _toFixed(data.buyOrderPrice || 0, 2) }} USD
                            </div>
                        </div>
                        <div class="item">
                            <div>{{ _t18(`stock38`) }}</div>
                            <div class="fw-num numItem">
                                {{ _toFixed(data.profitAndLose || 0, 2) }} USD
                            </div>
                        </div>
                        <div class="item">
                            <div>{{ _t18(`stock39`) }}</div>
                            <div class="fw-num numItem">
                                {{ _toFixed(data.sellOrderPrice || 0, 2) }} USD
                            </div>
                        </div>
                        <div class="item">
                            <div>{{ _t18(`stock40`) }}</div>
                            <div class="fw-num numItem">
                                {{ _toFixed(data.orderTotalPrice || 0, 2) }} USD
                            </div>
                        </div>
                        <div class="item">
                            <div>{{ _t18(`stock41`) }}</div>
                            <div class="fw-num numItem">
                                {{ _toFixed(data.sellOrderPrice * data.orderNum, 2) }} USD
                            </div>
                        </div>
                        <div class="item">
                            <div>{{ _t18(`stock42`) }}</div>
                            <div class="fw-num numItem">
                                {{ _toFixed(data.allProfitAndLose) }} USD
                            </div>
                        </div>
                        <div class="item">
                            <div>{{ _t18(`stock43`) }}</div>
                            <div class="fw-num numItem">
                                {{ _timeFormat(data.sellOrderTime)}}
                            </div>
                        </div>
                        <!-- 时间 -->
                        <div class="item">
                            <div>{{ _t18(`stock44`) }}</div>
                            <div class="fw-num numItem" v-if="data.buyOrderTime">
                                {{ _timeFormat(data.buyOrderTime) }}
                            </div>
                        </div>
                    </div>
                </div>
            </van-cell>
        </van-list>
        <Nodata v-if="loading == false && dataNewList?.length <= 0"></Nodata>
    </div>
</template>
<script setup>
import { formatCurrentcurrency } from '@/utils/filters'
import { _t18, _timeFormat } from '@/utils/public'
import { userPositionPage, stockSell } from '@/api/subscription/index'
import { _toFixed, _formattedAmount } from '@/utils/decimal'
import { inject, onMounted } from 'vue'
import { useToast } from '@/hook/useToast'
import { useMainStore } from '@/store/index'
const mainStore = useMainStore()
const { _toast } = useToast()

// 数据列表
const stockInfo = inject('stockInfo')
// 切换眼睛（隐藏其他交易数据）
const showEye = inject('currentEye')
const loading = ref(false)
const finished = ref(false)
const pageSize = ref(10)
const pageNum = ref(1)
const dataList = ref([])
const dataNewList = ref([])
// 股票类型
const headerSecondList = ref([
    
])
const currentSecondIndex = ref(0)
const params = ref({
    pageNo: 1,
    pageSize: 10,
    currencyType: 'USDT',
    state: 1,
    stockType: 'US'
})


// 切换二级分类
const clicSecondkTab = (e) => {
  currentSecondIndex.value = e
  params.value.stockType = headerSecondList.value[e].type
  refresh()
}

// 获取二级分类
const getSecondTabs = () => {
  const tabsList = mainStore.getstockenable
  // 设置默认值
  params.value.stockType = mainStore.getstockenable[0].type
  headerSecondList.value = []
  tabsList.forEach((item) => {
    headerSecondList.value.push({
      type: item.type,
      market: item.market.split(',')
    })
  })
  
  // market.value = headerSecondList.value[0].market[0]
  refresh()
}

// 上拉加载分页
const onLoad = () => {
    getOrderList()
}
//刷新订单
const refresh = () => {
    dataList.value = []
    dataNewList.value = []
    pageNum.value = 1
    finished.value = false
    onLoad()
}


// 计算盈亏比
function calculateProfitPercentageByTotal(stock) {
    console.log(stock, '0000000');

    // const profit = currentPrice - buyPrice
    const profitPercentage = (stock.allProfitAndLose / stock.orderTotalPrice) * 100
    return _toFixed(profitPercentage, 2)
}
// status =  0 当前委托
//获取列表
const getOrderList = async () => {
    loading.value = true

    const res = await userPositionPage(params.value)


    loading.value = false
    // finished.value = true

    if (res?.data.total == undefined || res?.data.total <= dataList.value.length) {
        return (finished.value = true)
    }

    if (res.code == 200) {
        dataList.value = [...dataList.value, ...res.data.list]
        pageNum.value++
    }

    filterEyes()
}



//处理订单数据 -> 过滤当前币种订单

const filterEyes = () => {
    if (!showEye.value) {
        dataNewList.value = formatCurrentcurrency(dataList.value, stockInfo.value.coin)
    } else {
        dataNewList.value = dataList.value
    }
}

defineExpose({
    refresh,
    filterEyes,
    getSecondTabs
})
</script>
<style scoped lang="scss">
.content {
    text-align: center;
    min-height: 240px;

    :deep(.van-cell) {
        padding: 0;
    }

    .share-button {
        color: var(--ex-active-font-color);
        border: 1px solid var(--ex-active-font-color);
        border-radius: 4px;
        padding: 5px 10px;
    }

    .hightUp {
        color: var(--ex-font-color2) !important;
    }

    .hightDown {
        color: var(--ex-font-color10) !important;
    }

    .colorBlue {
        color: var(--ex-font-color9) !important;
    }

    .hisToryList {
        padding: 20px 15px 0;

        // border-bottom: 1px solid var(--ex-border-color);
        .header {
            padding-bottom: 20px;
            font-size: 14px;
            color: var(--ex-default-font-color);
            display: flex;
            align-items: center;
            justify-content: space-between;

            .headerLeft {
                display: flex;
                align-items: center;

                .name {
                    padding: 0 5px;
                    font-size: 12px;
                    background: var(--ex-div-bgColor1);
                    border-radius: 4px;
                    margin-right: 10px;
                    color: var(--ex-font-color);
                }

                .name2 {
                    background: var(--ex-rfd-fall);
                }
            }

            .headerRight {
                padding: 0 5px;
                background: var(--ex-default-background-color);
                border-radius: 4px;
                opacity: 1;
                border: 1px solid var(--ex-font-color9);
                font-size: 12px;
                color: var(--ex-font-color9);
            }
        }

        .list {
            .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;
                color: var(--ex-passive-font-color);
                padding-bottom: 15px;

                .numItem {
                    color: var(--ex-default-font-color);
                }

                .numItemRed {
                    color: var(--ex-font-color15);
                }
            }
        }
    }
}

.second-tabs {
    display: flex;
    align-content: center;
    justify-content: space-between;
    border-bottom: 1px solid #272c3c;
    padding: 10px 16px 0 16px;

    // margin-bottom: 16px;
    &-list {
        width: 70%;
        display: flex;

        &-item {
            display: flex;
            flex-direction: column;
            color: #7a7a7a;
            font-size: 14px;
            font-weight: 500;
            line-height: 22px;
            margin-right: 30px;

            &:last-child {
                margin-right: 0;
            }

            &::after {
                content: '';
                width: 100%;
                height: 3px;
                border-radius: 10px;
                margin-top: 8px;
            }
        }

        .active {
            font-size: 16px;
            color: #7833f6;

            &::after {
                background-color: #7833f6;
            }
        }
    }

    .all-btn {
        font-size: 16px;
        line-height: 22px;
        color: #7833f6;

        .van-icon {
            transform: rotate(90deg);
        }
    }
}
</style>