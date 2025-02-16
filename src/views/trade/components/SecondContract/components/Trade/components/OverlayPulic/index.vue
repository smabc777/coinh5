<template>
  <van-popup v-model:show="show" round teleport="#trade" @close="close">
    <div class="countdown">
      <div class="fw-bold closeBtn">
        <div class="left">
          <span v-if="coinInfo.coin === 'btc' && ['moonex'].includes(_getConfig('_APP_ENV'))">{{
    coinInfo.symbolUpperCase
  }}</span>
          <span v-else>{{ matchText(coinInfo.showSymbol, '/USDT') }}</span>
          <!-- formData.betContent 买涨 1  买跌 0 -->
          <p class="titleName" :class="{ titleColor: !formData.betContent }">
            {{ formData.betContent ? _t18(`option_buy_up`, ['moonex']) : _t18(`option_buy_short`, ['moonex']) }}
          </p>

        </div>

        <div @click="show = false">
          <van-icon name="close" size="18" color="var(--ex--home-grid-text-color)" />
        </div>
      </div>


      <!-- 订单倒计时  -->
      <div class="order-circle" v-if="!orderObj.id">

        <div class="circle">
          <van-circle :color="gradientColor" v-model:current-rate="currentRate" :stroke-width="160" size="180"
            :layer-color="`#D9D9D9`">
            <template #default>
              <div class="circle-text">
                <van-count-down ref="countDownRef" format="mm:ss" :time="countDown" @change="onTime"
                  @finish="onFinish" />

              </div>
            </template>

          </van-circle>
        </div>
        <div class="countList margin20">
          <!-- 现价 -->
          <div class="item">
            <div>{{ _t18(`quick_label_2`, ['moonex']) }}</div>
            <div class="itemRight fw-num">
              {{ coinPriceInfo.close }}
            </div>
          </div>
          <!-- 周期 -->
          <div class="item">
            <div>{{ _t18(`quick_label_3`, ['moonex']) }}</div>
            <div class="itemRight fw-num">{{ formData.period }}s</div>
          </div>
          <!-- 方向 -->
          <div class="item">
            <div>{{ _t18(`bb_direction`) }}</div>
            <!-- formData.betContent ? 1'买涨' : 0'买跌' -->
            <div class="itemRight fw-num" :class="formData.betContent ? 'hightUp' : 'hightDown'">

              {{
    formData.betContent
      ? _t18(`option_buy_up`, ['moonex'])
      : _t18(`option_buy_short`, ['moonex'])
  }}
            </div>
          </div>
          <!-- 数量 -->
          <div class="item">
            <div>{{ _t18(`metastaking_bb_count`, ['moonex']) }}</div>
            <div class="itemRight fw-num">{{ formData.betAmount }} USDT</div>
          </div>
          <!-- 价格 -->
          <div class="item">
            <div>{{ _t18(`price`, ['moonex']) }}</div>
            <div class="itemRight fw-num">{{ formData.buyPrice }} USDT</div>
          </div>
          <!-- 预计盈利 -->
          <div class="item">
            <div>{{ _t18(`quick_label_7`, ['moonex']) }}</div>
            <!-- fx平即为输 -->
            <div v-if="['fx', 'dev'].includes(_getConfig('_APP_ENV')) &&
    _sub(formData.openPrice, coinPriceInfo.close) == 0
    " class="itemRight fw-num hightDown">
              -{{ formData.betAmount }}USDT
            </div>
            <div v-else class="itemRight fw-num"
              :class="formatExpectedProfitColor(formData.betContent, formData.openPrice, coinPriceInfo.close)">

              {{
    formatExpectedProfit(
      formData.betContent,
      formData.buyPrice,
      coinPriceInfo.close,
      formData.betAmount,
      formData.odds,
      formData.flag,
    )
  }}
              USDT
            </div>
          </div>
        </div>

      </div>
      <!--  订单结算完成 -->
      <div class="order-ok" v-else>
        <div class="countdownHeader">
          <div :class="profitAndlossColor(orderObj?.betAmount, orderObj?.rewardAmount)" class="ff-num order_num">
            <span v-if="['moonex'].includes(_getConfig('_APP_ENV'))"
              :class="profitAndloss(orderObj?.betAmount, orderObj?.rewardAmount) >= 0 ? 'hightUp' : 'hightDown'">{{
    profitAndloss(orderObj?.betAmount, orderObj?.rewardAmount) }}</span>
            <span v-else :class="formData.betContent ? 'hightUp' : 'hightDown'">{{ profitAndloss(orderObj?.betAmount,
    orderObj?.rewardAmount) }}</span>

          </div>
          <div v-if="['moonex'].includes(_getConfig('_APP_ENV'))" class="countdownHeaderName"
            :class="profitAndloss(orderObj?.betAmount, orderObj?.rewardAmount) >= 0 ? 'hightUp' : 'hightDown'">USDT
          </div>
          <div v-else class="countdownHeaderName" :class="formData.betContent ? 'hightUp' : 'hightDown'">USDT</div>
        </div>
        <!-- 到期结算完成 -->
        <div class="countdownOver">{{ _t18(`quick_label_1`, ['moonex']) }}</div>
        <div class="countList">
          <!-- 现价 -->
          <div class="item">
            <div>{{ _t18(`quick_label_2`, ['moonex']) }}</div>
            <div class="itemRight fw-num">
              {{ orderObj?.closePrice }}
            </div>
          </div>
          <!-- 周期 -->
          <div class="item">
            <div>{{ _t18(`quick_label_3`, ['moonex']) }}</div>
            <div class="itemRight fw-num">{{ formData.period }}s</div>
          </div>
          <!-- 方向 -->
          <div class="item">
            <div>{{ _t18(`bb_direction`) }}</div>
            <!-- formData.betContent ? 1'买涨' : 0'买跌' -->
            <div class="itemRight fw-num" :class="formData.betContent ? 'hightUp' : 'hightDown'">
              {{
    formData.betContent
      ? _t18(`option_buy_up`, ['moonex'])
      : _t18(`option_buy_short`, ['moonex'])
  }}
            </div>
          </div>
          <!-- 数量 -->
          <div class="item">
            <div>{{ _t18(`metastaking_bb_count`, ['moonex']) }}</div>
            <div class="itemRight fw-num">{{ orderObj.betAmount }} USDT</div>
          </div>
          <!-- 价格 -->
          <div class="item">
            <div>{{ _t18(`price`, ['moonex']) }}</div>
            <div class="itemRight fw-num">{{ orderObj?.openPrice }} USDT</div>
          </div>
        </div>
      </div>


      <!-- 最终价格以系统结算为准 -->
      <div class="countFooter">
        <van-icon name="warning-o" />
        <span>{{ _t18(`option_profit_loss_3`, ['moonex']) }}</span>
      </div>
    </div>
  </van-popup>
</template>

<script setup>

import {
  countdownNum,
  formatExpectedProfit,
  formatExpectedProfitColor,
  formatTime,
  matchText,
  getRangeNumber, profitAndlossColor, profitAndloss
} from "@/utils/filters";
import { _sub } from "@/utils/decimal";
import { _getConfig, _t18 } from "@/utils/public";
import { useTradeStore } from "@/store/trade";
import { useUserStore } from "@/store/user";
import { useToast } from "@/hook/useToast";
import { ref } from "vue";
import { secondContractOrderselectOrderList } from "@/api/trade";
import { showToast } from "vant";


const tradeStore = useTradeStore()
const userStore = useUserStore()
const { _toast, _showName } = useToast()

//弹窗show
const show = ref(false)

// 当前币种数据
const coinInfo = inject('coinInfo')

// 币种价格详情
const coinPriceInfo = computed(() => tradeStore.allCoinPriceInfo[coinInfo.value.coin])

//当前余额
const availableBalance = computed(() => {
  let obj = userStore.asset.filter((item) => item.symbol === 'usdt')[0]
  return obj?.availableAmount || 0
})
// 表单数据
const formData = ref({})

// 倒计时
const countDown = ref(0)
const currentRate = ref(0)

// 结算当前倒计时的进度
const onTime = (item) => {
  currentRate.value = getRangeNumber(-item.total, -countDown.value, 0)
}

//倒计时结束
const orderObj = ref({})
const onFinish = () => {

  let data = {
    status: 1,
    id: formData.value?.orderId
  }
  // 调用订单接口用于展示倒计时完成
  secondContractOrderselectOrderList(data).then((res) => {
    if (res.code === 200) {
      orderObj.value = Array.isArray(res.data) && res.data.length ? res.data[0] : {}
      // formData.value = {...formData.value, ...orderObj}
    } else {
      showToast(res.msg)
    }
  })
}


//进度条颜色值
const gradientColor = {
  '0%': '#138A5D',
  '100%': '#17ac74'
};

const countDownRef = ref(null);
//close关闭弹窗触发
const OrderRefresh = inject('OrderRefresh')
const close = () => {
  //刷新订单
  OrderRefresh()
}

//看涨 1  看跌0
const setOverlayPulicShow = async (data) => {
  show.value = true
  formData.value = data
  orderObj.value = {}
  currentRate.value = 0
  countDown.value = Number(data.period) * 1000
  await nextTick()
  countDownRef.value.reset()
  countDownRef.value.reset()
}
defineExpose({ setOverlayPulicShow })

</script>

<style scoped lang="scss">
.countdown {
  padding: 14px;
  font-size: 16px;
  color: var(--ex-default-font-color);
  width: 343px;
  border-radius: 10px;

  .closeBtn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;


    .left {
      display: flex;

      span {
        font-size: 16px;
      }

      p {
        margin-left: 6px;
        min-width: 34px;
        padding: 2px;
        background: var(--ex-trade-buy-bg-color);
        border-radius: 4px;
        font-size: 12px;
        text-align: center;
        color: #fff;
      }
    }
  }


  //等待订单完成
  .order-circle {
    .countdownHeader {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 15px;

      .countdownHeaderName {
        margin-left: 5px;
        font-size: 16px;
        color: var(--ex-passive-font-color);
      }
    }

    .countdownOver {
      color: var(--ex-passive-font-color);
      font-size: 14px;
      margin-bottom: 20px;
      text-align: center;
    }

    .circle {
      margin-top: 20px;
      text-align: center;

      .circle-text {
        height: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        :deep(.van-count-down) {
          font-size: 32px;
          color: var(--ex-default-font-color);
          font-family: 'DINOT-Medium' !important;
        }
      }

    }

    .countList {
      .item {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: var(--ex-passive-font-color);
        padding: 10px 0;

        .itemRight {
          color: var(--ex-default-font-color);

          // 涨跌颜色
          &.hightUp {
            color: var(--ex-trade-buy-bg-color);
          }

          &.hightDown {
            color: var(--ex-trade-Sell-bg-color);
          }
        }
      }
    }

    .margin20 {
      padding-top: 20px;
    }


  }

  //订单完成
  .order-ok {
    .countdownHeader {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 15px;

      .order_num {

        // 涨跌颜色
        .hightUp {
          color: var(--ex-trade-buy-bg-color);
        }

        .hightDown {
          color: var(--ex-trade-Sell-bg-color);
        }
      }

      .countdownHeaderName {
        margin-left: 5px;
        font-size: 16px;

        // 涨跌颜色
        &.hightUp {
          color: var(--ex-trade-buy-bg-color);
        }

        &.hightDown {
          color: var(--ex-trade-Sell-bg-color);
        }
      }
    }


    .countdownOver {
      color: var(--ex-passive-font-color);
      font-size: 14px;
      margin-bottom: 20px;
      text-align: center;
    }

    .circle {
      margin-top: 20px;
      text-align: center;

      .circle-text {
        height: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        :deep(.van-count-down) {
          font-size: 32px;
          color: var(--ex-default-font-color);
          font-family: 'DINOT-Medium' !important;
        }
      }

    }

    .countList {
      .item {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: var(--ex-passive-font-color);
        padding: 10px 0;

        .itemRight {
          color: var(--ex-default-font-color);

          // 涨跌颜色
          &.hightUp {
            color: var(--ex-trade-buy-bg-color);
          }

          &.hightDown {
            color: var(--ex-trade-Sell-bg-color);
          }
        }
      }
    }

    .margin20 {
      padding-top: 20px;
    }


  }

  .countFooter {
    padding-top: 20px;
    font-size: 14px;
    color: var(--ex-text-color);
    text-align: center;

    span {
      padding-left: 2px;
    }
  }


}
</style>
