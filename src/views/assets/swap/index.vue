<!-- 兑换 -->
<template>
  <!-- 闪兑 -->
  <HeaderBar :currentName="_t18('swap')"></HeaderBar>
  <div class="swap-page">
    <div class="content">
      <p class="label">{{ _t18(`transfer_out`) }}</p>
      <div class="from">
        <div class="left-img" @click="showAction('from')">
          <div class="svgImg" v-show="fromImg !== ''">
<!--            <img v-if="fromSymbol != 'usdt'" :src="fromImg" alt="" />-->
<!--            <svg-load v-else name="usdc" class="currencyIcon"></svg-load>-->
            <img :src="fromImg" alt="" />
          </div>
<!--          <div class="coin-name">{{fromSymbol == 'usdt' ? 'USDC'  : fromSymbol.toLocaleUpperCase() }}</div>-->
          <div class="coin-name">{{fromSymbol.toLocaleUpperCase()}}</div>
          <image-load filePath="down.png" alt="" class="downImg" />
        </div>
        <div class="input-item">
          <input type="number" v-model="fromNum" :placeholder="_t18('swap_input')" class="ff-num" />
          <!-- 全部 -->
          <div class="all" @click="fromNum = availableAmount || '0'">
            {{ _t18('swap_all') }}
          </div>
        </div>
      </div>
      <!-- 交换按钮 -->

      <div class="exchange_btn">
        <svg-load name="huazhuanbtn" class="dui" @click="jiaohuan()"></svg-load>
      </div>
      <p class="label">{{ _t18(`transfer_in`) }}</p>
      <div class="to">
        <div class="left-img" @click="showAction('to')">
          <div class="svgImg" v-show="toImg !== ''">
<!--            <img v-if="toSymbol != 'usdt'" :src="toImg" alt="" />-->
<!--            <svg-load v-else name="usdc" class="currencyIcon"></svg-load>-->
            <img  :src="toImg" alt="" />
          </div>
          <div class="coin-name">
<!--            {{toSymbol == 'usdt' ? 'USDC'  : toSymbol.toLocaleUpperCase() }}-->
            {{ toSymbol.toLocaleUpperCase() }}
          </div>
          <image-load filePath="down.png" alt="" class="downImg" />
        </div>

        <!-- 兑换数量 -->
        <div class="change-input">
          <input type="number" disabled class="ff-num" v-model="toNum" :placeholder="_t18('swap_number')" />
        </div>
      </div>
      <div class="rate ff-num">
        <!-- 今日汇率 -->
        <!-- <p>{{ _t18('swap_rateDay') }}：</p> -->
        <image-load filePath="rate.png" alt="" class="rateImg" />
        <p>
          1
          <span>{{ fromSymbol == 'usdt' ? 'USDC'  : fromSymbol?.toLocaleUpperCase()  }}</span>&nbsp;≈&nbsp;<span>{{ curRate }}</span><span>{{
            toSymbol == 'usdt' ? 'USDC'  : toSymbol?.toLocaleUpperCase() }}</span>
        </p>
      </div>
    </div>
    <!-- 可用余额 -->
    <div class="available-amount">
      <div>{{ _t18('transfer_available') }}({{fromSymbol == 'usdt' ? 'USDC': fromSymbol?.toLocaleUpperCase() }})</div>
      <div>{{ availableAmount }}</div>
    </div>
    <!-- 确定 -->
    <div class="btn">
      <p @click="submit">{{ _t18('btnConfirm', ['bitmake']) }}</p>
    </div>
    <!-- sheet币种面板 -->
    <van-action-sheet v-model:show="showSheet" title="" id="sheetPopup"
      style="max-width: var(--ex-max-width); left: 50%; translate: -50%">
      <div class="coinList">
        <div v-for="(item, index) in tempAllList" :key="item.id" class="coinItem" @click="selectCoin(item, index)">
          <div class="svgImg">
<!--            <img v-if="item.symbol != 'usdt'" :src="item.logo" alt="" class="logoImg" />-->
<!--            <svg-load v-else name="usdc" class="logoImg"></svg-load>-->
            <img  :src="item.logo" alt="" class="logoImg" />

          </div>

          <div>
<!--            <p>{{item.symbol == 'usdt' ? 'USDC': item.symbol?.toLocaleUpperCase() }}</p>-->
            <p>{{item.symbol?.toLocaleUpperCase()}}</p>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { DIFF_ISFREEZE, DIFF_ISFREEZE_RXCE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'

const { _isFreeze } = useFreeze()
import { showToast } from 'vant'
import { _getConfig, _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'

const { _toast } = useToast()
import { rate, toExchange } from '@/api/account'
import { debounce } from 'lodash'
import { priceFormat } from '@/utils/decimal.js'
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
import { getSwapSetting } from '@/api/account.js'
import { contractHistoryList } from "@/api/trade";

const userStore = useUserStore()
userStore.getUserInfo()
// 用户余额信息
const { asset } = storeToRefs(userStore)
/**
 * 货币兑换
 * 1.用户信息货币asset.value
 */

// 当前币种的余额（一定取最新的）
const availableAmount = computed(() => {
  let sme = 0
  asset.value.filter((item) => {
    if (item.symbol == fromSymbol.value.toLowerCase() && item.type == 1) {
      sme += Number(item.availableAmount)
    }
  })
  return priceFormat(sme)
})
/* 转出 转入 币种名称及图标 */
const fromSymbol = ref('usdt')
const toSymbol = ref('eth')
const fromImg = ref('')
const toImg = ref('')
/* 币种列表 */
const tempAllList = ref([])
const init = async () => {
  // 获取兑换 币种列表
  getSwapSetting({ isAsc: 'asc', orderByColumn: 'sort' }).then((res) => {
    if (res) {
      tempAllList.value = res.rows
      fromImg.value = findLogoBySymbol(tempAllList.value, fromSymbol.value)
      toImg.value = findLogoBySymbol(tempAllList.value, toSymbol.value)
      getRate()
    }
  })
}
// 根据symbol查询logo
const findLogoBySymbol = (arr, symbol) => {

  const result = arr.find((item) => item.symbol === symbol)
  console.log(result.logo, '99999900');


  return result ? result.logo : ''
}

const curRate = ref(0)
// 获取汇率
const getRate = () => {


  rate(fromSymbol.value.toLowerCase(), toSymbol.value.toLowerCase()).then((res) => {


    if (res.code == '200') {
      let resFrom = res.data[fromSymbol.value.toLowerCase()] || 1
      let resTo = res.data[toSymbol.value.toLowerCase()] || 1

      if (fromSymbol.value == 'brl') {
        curRate.value = priceFormat(resTo / resFrom, 8)
        return
      }
      if (toSymbol.value == 'brl') {
        curRate.value = priceFormat(resTo * resFrom, 8)
        return
      }
      curRate.value = priceFormat(resFrom / resTo, 8)
    }
  })
}

/**
 * sheet面板
 */
const showSheet = ref(false) //sheet面板隐显
const flag = ref('from') //面板展示数据from/to

/**
 * 兑换金额
 */
const fromNum = ref('')
const toNum = ref()
watch([fromNum, curRate], () => {
  toNum.value = priceFormat(fromNum.value * curRate.value, 8)
})
onMounted(() => {
  init()
})
// 触发sheet面板事件(item=from/to)
const showAction = (item) => {
  flag.value = item
  showSheet.value = true
}
// sheet面板内容选择（根据flag标识，修改当前货币及logo）
const selectCoin = (item, index) => {
  if (flag.value == 'from') {
    if (toSymbol.value != 'usdt' && item.symbol == 'brl') return _toast('stock92')
    if (toSymbol.value == 'brl' && item.symbol != 'usdt') return _toast('stock92')
  } else {
    if (fromSymbol.value != 'usdt' && item.symbol == 'brl') return _toast('stock92')
    if (fromSymbol.value == 'brl' && item.symbol != 'usdt') return _toast('stock92')
  }

  if (flag.value == 'from') {
    // 排toSymbol币
    if (item.symbol != toSymbol.value) {
      fromSymbol.value = item.symbol
      fromImg.value = item.logo
      getRate()
      showSheet.value = false
    }
  } else if (flag.value == 'to') {
    //排fromSymbol币
    if (item.symbol != fromSymbol.value) {
      toSymbol.value = item.symbol
      toImg.value = item.logo
      getRate()
      showSheet.value = false
    }
  }
}

// 点击交换按钮（交换上下货币列表，当前显示）
const jiaohuan = () => {
  ;[fromSymbol.value, toSymbol.value] = [toSymbol.value, fromSymbol.value]
    ;[fromImg.value, toImg.value] = [toImg.value, fromImg.value]
  getRate()
}
const submitForm = debounce(async () => {


  if (fromNum.value <= 0) {
    // 兑换金额不能小于0

    return (_toast('swap_minNum'))
  }
  // 兑换金额不能超过可用金
  if (fromNum.value > availableAmount.value) {
    return (_toast('swap_maxNum'))
  }



  let params = {
    fromSymbol: fromSymbol.value.toLowerCase(),
    toSymbol: toSymbol.value.toLowerCase(),
    total: fromNum.value
  }
  toExchange(params).then((res) => {
    if (res.code == '200') {
      // 兑换成功，请稍后查看
      _toast('swap_success', ['aams', 'vitc', 'aug'])
      setTimeout(() => {
        userStore.getUserInfo()
        // init()
      }, 1000)
    } else {
      showToast(res.msg)
    }
  })
  // console.log('兑换操作',params)
}, 500)
// 兑换按钮
const submit = async () => {


  if (_isFreeze(DIFF_ISFREEZE, 'EXCHANGE') && _isFreeze(DIFF_ISFREEZE_RXCE, 'EXCHANGE')) {
    submitForm()
  }
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.swap-page {
  padding: 0 15px;
}

.content {
  padding: 20px 15px;
  background: var(--ex-financial-card-bg-color);
  margin-top: 20px;
  border-radius: 5px;

  .label {
    font-size: 14px;
    margin-bottom: 12px;
    color: var(--ex-passive-font-color);
  }

  .from,
  .to {
    display: flex;
    justify-content: space-between;

    // padding: 15px 10px;
    .all {
      color: var(--ex-copy-font-color);
    }

    .coin-name {
      margin: 0 8px 0;
    }

    .downImg {
      width: 9px;
      height: 5px;
    }

    .left-img {
      display: flex;
      align-items: center;

      .svgImg {
        width: 20px;
        height: 20px;
        border-radius: 50%;

        img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .icon {
          font-size: 20px;
          border-radius: 50%;
        }

        .iconImg {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
      }
    }

    .input-item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding-bottom: 13px;
      border-bottom: 1px solid var(--ex--backup-background-color-2);
    }

    input {
      flex: 1;
      color: var(--ex-font-color20);
      background-color: transparent;
    }

    input::placeholder {
      color: var(--ex-placeholder-font) !important;
    }

    .change-input {
      input {
        text-align: right;
      }
    }
  }

  .exchange_btn {
    padding: 40px 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .dui {
      font-size: 42px;
    }
  }

  .rate {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 15px 0;
    border-radius: 5px;
    // background: var(--ex-card-deep-bg-color);

    .rateImg {
      width: 22px;
      height: 22px;
      margin-right: 10px;
    }

    p {
      font-size: 15px;
    }
  }
}

.available-amount {
  display: flex;
  justify-content: space-between;
  // background: var(--ex-card-deep-bg-color);
  margin-top: 20px;
  border-radius: 5px;
  padding: 15px;
  border: 1px solid var(--ex--backup-background-color-2);

  :first-child {
    font-size: 13px;
    color: var(--ex-passive-font-color);
  }

  :last-child {
    font-size: 14px;
  }
}

.btn {
  padding: 66px 0 50px;

  p {
    padding: 14px 0;
    font-size: 16px;
    background: var(--ex-btn-background-color) !important;
    color: var(--ex-btn-font-color) !important;
    border-radius: 8px;
    text-align: center;
  }
}

.coinList {
  max-height: 250px;

  .logoImg {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
}

.coinItem {
  display: flex;
  align-items: center;
  padding: 15px 0;
  flex: 1;
  background: var(--ex-default-background-color);

  div {
    flex: 1;
  }

  .svgImg {
    text-align: right;

    // width: 30px;
    // height: 30px;
    .icon {
      text-align: right;
      font-size: 30px;
    }

    .iconImg {
      width: 30px;
    }
  }

  p {
    font-size: 16px;
    color: var(--ex-passive-font-color);
  }

  &>div:first-child {
    text-align: end;
    margin-right: 5px;
  }

  &>div:last-child {
    text-align: start;
    margin-left: 5px;
  }
}

input:disabled {
  background-color: var(--ex-default-background-color);
}
</style>
