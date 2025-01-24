<!-- 首页 -->
<script setup>
import { ref, toRefs, defineProps, toRef } from 'vue'
import { showConfirmDialog } from 'vant'
import { useToast } from '@/hook/useToast'
import { _getConfig, _isStockRFD } from '@/utils/public'
import { _toFixed, _formattedAmount } from '@/utils/decimal'


const { _toast, _st18 } = useToast()

const emit = defineEmits(['closingPosition'])

const props = defineProps({
  //子组件接收父组件传递过来的值
  stockList: {
    type: Object,
    default: {}
  },
  id: {
    type: Number
  }
})
function clickButton(item) {

  showConfirmDialog({
    cancelButtonColor: 'var(--ex-font-color12)',
    title: _st18('stock45'),
    message: _st18('stock46'),
    confirmButtonText: _st18('stock47'),
    cancelButtonText: _st18('stock48')
  })
    .then(() => {
      // 平仓按钮
      emit('closingPosition', item)
    })
    .catch(() => { })
}
function calculateProfitPercentage(buyPrice, currentPrice) {
  const profit = currentPrice - buyPrice
  const profitPercentage = (profit / buyPrice) * 100
  return _toFixed(profitPercentage, 2)
}
function calculateProfitPercentageByTotal(stock) {


  // const profit = currentPrice - buyPrice
  const profitPercentage = (stock.allProfitAndLose / stock.orderTotalPrice) * 100
  return _toFixed(profitPercentage, 2)
}
</script>

<template>
  <div class="list-item">
    <div class="top">
      <div class="Micorfhg flex-ct">
        <div class="flex-st">
          <div>
            <!-- 买 -->
            <div class="name" v-if="stockList.orderDirection == '买涨'">{{ _t18(`buy`) }}</div>
            <!-- 卖 -->
            <div class="name name2" v-else>{{ _t18(`sell`) }}</div>
          </div>
          <div>
            {{ stockList.stockCode }}

          </div>
        </div>

        <div class="flex-ct">
          <div class="andLose" :class="[_isStockRFD(calculateProfitPercentageByTotal(
              stockList
            )), 'rfd-sign  rightRight fw-num tw']

              ">
            {{
              calculateProfitPercentageByTotal(
                stockList
              )
            }} %
          </div>

        </div>
      </div>
      <div class="flex-ct">
        <div>{{ stockList.stockGid }} </div>
        <div class="price" :class="stockList.maRate > 0
              ? 'gree'
              : 'redd'
              ">
          {{ _toFixed(stockList.nowPrice || 0, 2) }} USD
        </div>
      </div>
    </div>
    <div class="list-item-info">
      <div class="list-item-info-left">{{ _t18('bydfe_trade_tab5') }}</div>
      <div class="list-item-info-right">{{ stockList.orderLever }}X</div>
    </div>

    <div class="list-item-info">
      <div class="list-item-info-left">{{ _t18('stock36') }}</div>
      <div class="list-item-info-right">{{ stockList.orderNum }}</div>
    </div>
    <div class="list-item-info">
      <div class="list-item-info-left">{{ _t18('stock37') }}</div>
      <div class="list-item-info-right"> {{ _toFixed(stockList.buyOrderPrice || 0, 2) }} USD
      </div>
    </div>
    <div class="list-item-info">
      <div class="list-item-info-left">{{ _t18('stock38') }}</div>
      <div class="list-item-info-right">{{ _toFixed(stockList.profitAndLose, 2) }} USD</div>
    </div>
    <div v-if="id != 0">
      <div class="list-item-info">
        <div class="list-item-info-left">{{ _t18('stock39') }}</div>
        <div class="list-item-info-right">{{ _toFixed(stockList.sellOrderPrice, 2) }} USD</div>
      </div>
      <div class="list-item-info">
        <div class="list-item-info-left">{{ _t18('stock40') }}</div>
        <div class="list-item-info-right">{{ _toFixed(stockList.orderTotalPrice, 2) }} USD</div>
      </div>
      <div class="list-item-info">
        <div class="list-item-info-left">{{ _t18('stock41') }}</div>
        <div class="list-item-info-right">{{ _toFixed(stockList.sellOrderPrice * stockList.orderNum, 2) }} USD
        </div>
      </div>
      <div class="list-item-info">
        <div class="list-item-info-left">{{ _t18('stock42') }}</div>
        <div class="list-item-info-right">{{ _toFixed(stockList.allProfitAndLose, 2)
          }} USD</div>
      </div>
      <div class="list-item-info">
        <div class="list-item-info-left">{{ _t18('stock43') }}</div>
        <div class="list-item-info-right">{{ _timeFormat(stockList.sellOrderTime) }}</div>
      </div>
    </div>
    <div class="list-item-info">
      <div class="list-item-info-left">{{ _t18('stock44') }}</div>
      <div class="list-item-info-right">{{ _timeFormat(stockList.buyOrderTime) }}</div>
    </div>
    <div class="list-item-bottom" v-if="id == 0">
      <van-button type="primary" color="var(--ex-primary-color)" @click="clickButton(stockList)">{{
              _t18('Close_position')
            }}</van-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
* {
  font-size: 13px;
  font-weight: 400;
  color: var(--ex-default-font-color);
  box-sizing: border-box;
}

.page-border {
  border-radius: 10px;
  background: var(--ex-default-bgcolor);
  border: 1px solid var(--ex-box-border2);
  margin-top: 16px;
  padding: 15px;
  font-size: 12px;

  .line {
    background: var(--ex-box-border2);
    margin-top: 16px;
    margin-bottom: 12px;
    width: 100%;
    height: 1px;
  }

  >div {
    margin-bottom: 10px;
  }



  .price-coler {
    color: var(--ex-tip-font-color2);
  }

  .text-color {
    color: var(--ex-tip-font-color3);
  }
}

.list-item {
  width: 100%;
  border-radius: 10px;
  background-color: var(--ex-backup--background-color);
  margin-bottom: 15px;
  padding: 20px 15px;
  border-bottom: 2px solid var(--ex-border-color16);


  &:last-child {
    margin-bottom: 0;
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-left {
      display: flex;
      align-items: center;

      img {
        width: 44px;
        height: 44px;
        margin-right: 15px;
      }

      &-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &-title {
          font-weight: 500;
        }

        &-text {
          margin-top: 4px;
          color: var(--ex--home-grid-text-color);
        }
      }
    }

    &-right {
      font-weight: 600;
    }
  }

  &-info {
    margin: 20px 0 15px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-left {
      color: var(--ex--home-grid-text-color);
    }
  }

  :deep(.van-button) {
    width: 100%;
    height: 40px;
    border-radius: 27px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
}

.top {
  margin-bottom: 30px;
}

.list-item-bottom {
  margin-top: 40px;
}

.Micorfhg {
  font-family: Poppins;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 14px;

  span {
    font-size: 12px;
    font-weight: 700;
    margin-left: 10px;
  }
}

.showConfirmDialogContent {
  color: var(--ex-default-font-color);
}

.name {
  padding: 2px 5px;
  font-size: 12px;
  background: var(--ex-div-bgColor1);
  border-radius: 4px;
  margin-right: 10px;
  color: var(--ex-font-color);
}

.name2 {
  background: var(--ex-rfd-fall);
}

.price {
  font-size: 20px;
  white-space: nowrap;
}

.andLose {
  font-size: 16px;
}
</style>
