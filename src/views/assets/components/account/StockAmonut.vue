<template>
  <div class="stock-amount">
    <!-- 头部余额部分 -->
    <div class="amount-header">
      <div class="amount-header-left">
        <div class="flex-st">
          <div class="amount-header-left-title" @click="tabclick(0)">
            <div class="amount-header-left-title-money" :class="active == 0 ? 'activeColor' : ''">{{
              _t18('asset_account', ['ebc']) }}(USD)</div>
            <!-- <svg-load name="showicon" class="yanjin" @click="handleYanjin"></svg-load> -->
          </div>
          <!-- <div class="amount-header-left-title brl" @click="tabclick(1)">
            <div class="amount-header-left-title-money" :class="active == 1 ? 'activeColor' : ''">{{
              _t18('asset_account', ['ebc']) }}(BRL)</div>
          </div> -->
          <svg-load name="showicon" class="yanjin" @click="handleYanjin"></svg-load>

        </div>

        <div class="amount-header-left-number"> {{ showNum ? _numberWithCommas(active == 0 ? accountlist.amout || '0.00'
          :
          accountlist.amout
          * tradeStore.rateinfo.brlRate
          || 0, 2) : '******' }} <span>{{ showNum ? active == 0 ? 'USD' : 'BRL' : '' }}</span>
        </div>
        <!-- <div class="amount-header-left-cny">≈CNY</div> -->
      </div>
      <div class="amount-header-right">
        <div class="amount-header-right-btn" v-if="!['cmmetrics'].includes(_getConfig('_APP_ENV'))"
          @click="dispatchCustomEvent('event_serviceChange')">
          <svg-load name="dui" class="currencyIcon"></svg-load>
          <div class="amount-header-right-btn-text">{{ _t18('recharge') }}</div>
        </div>
        <div class="amount-header-right-btn" v-else @click="router.push('/recharge')">
          <svg-load name="dui" class="currencyIcon"></svg-load>
          <div class="amount-header-right-btn-text">{{ _t18('recharge') }}</div>
        </div>
        <!-- <div class="amount-header-right-btn" @click="toRecharge('/stockRecharge')">
          <svg-load name="huazhuan" class="currencyIcon"></svg-load>
          <div class="amount-header-right-btn-text">{{ _t18('asset_withdraw') }}</div>
        </div> -->

      </div>
    </div>

    <!-- 底部资产 -->
    <div class="amount-bottom">
      <div class="amount-bottom-item">
        <div class="amount-bottom-item-title">{{ _t18('available_funds_text') }}</div>
        <div class="amount-bottom-item-money">{{ showNum ? _numberWithCommas(active == 0 ? accountlist.availableAmount -
          accountlist.occupiedAmount || '0.00' : (accountlist.availableAmount -
            accountlist.occupiedAmount) * tradeStore.rateinfo.brlRate || 0, 2) : "******" }}</div>
      </div>
      <!-- <div class="amount-bottom-item" v-if="lengthsk > 0"> -->
      <div class="amount-bottom-item">
        <div class="amount-bottom-item-title">{{ _t18('holding_market_text') }}</div>
        <div class="amount-bottom-item-money">{{ showNum ? tabActive == 0 ?
          _numberWithCommas(accountlist.currentPositionAmt || 0, 2)
          : 0 : "******" }}</div>
        <!-- <div class="amount-bottom-item-money" v-else>{{ tabActive == 0 ? _numberWithCommas(accountlist.currentPositionAmt
            * rateinfo.brlRate || 0)
            : 0 }}</div> -->
      </div>
      <div class="amount-bottom-item">
        <div class="amount-bottom-item-title">{{ _t18('current_profit_text') }}</div>
        <div class="amount-bottom-item-money">{{ showNum ? tabActive == 0 ?
          _numberWithCommas(accountlist.currentPositionProfitAndLose || 0, 2) :
          _numberWithCommas(accountlist.historicalPositionProfitAndLose || 0, 2) : "******" }}</div>

        <!-- <div class="amount-bottom-item-money" v-else>{{ tabActive == 0 ?
            _numberWithCommas(accountlist.currentPositionProfitAndLose * rateinfo.brlRate || 0) :
            _numberWithCommas(accountlist.historicalPositionProfitAndLose * rateinfo.brlRate || 0) }}</div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { dispatchCustomEvent } from '@/utils'
import { _getConfig, _t18, _toView } from '@/utils/public'
import { DIFF_ISFREEZE_RXCE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'
import { useUserStore } from '@/store/user'
import { computed, onMounted } from 'vue'
import { _toFixed, _formattedAmount, currencyFormat } from '@/utils/decimal'
import { useTradeStore } from '@/store/trade'
import { useToast } from '@/hook/useToast'
import { useRouter, useRoute } from 'vue-router'


const router = useRouter()
const { _toast, _showName } = useToast()

const tradeStore = useTradeStore()
const userStore = useUserStore()


// 判断是否模拟交易
const isSimulate = computed(() => {
  return userStore.isSimulate
})


// 切换账户
const active = ref(0)
const tabclick = (id) => {
  return
  active.value = id
  let account = id == 0 ? 'US' : 'BR'
  emit('onClickTab', 3, account)

  emit('getaccountStatisticslist', account)






}

const { _isFreeze } = useFreeze()
const props = defineProps({
  tabActive: {
    type: Number

  },
  accountlist: {
    type: Object
  },
  data: {
    type: Object
  },
  amountProfit: {
    type: String
  },
  amountNowProfitSum: {
    type: String
  },
  amount: {
    type: String
  },
  coin: {
    type: String,
    default: 'USDT'
  },
  type: {
    type: String
  },
  showicon: {
    type: String
  },
  keyStr: {
    type: String
  },
  lengthsk: {
    type: Number
  },
})

const showNum = ref(localStorage.getItem('EYES') || true)
// 点击小眼睛
const handleYanjin = () => {
  showNum.value = !showNum.value
  localStorage.setItem('EYES', showNum.value)
}
const emit = defineEmits(['handleYanjin', 'handleShuaxin', 'getaccountStatisticslist', 'onClickTab'])

const handleShuaxin = () => {
  emit('handleShuaxin')
}

const currencyAbout = computed(() => {
  let list = []
  if (props.type == '平台资产') {
    list = [
      {
        icon: 'dui',
        title: _t18('asset_recharge'),
        url: '/recharge',
        isShow: isSimulate.value ? false : true
      }, //充币
      {
        icon: 'huazhuan',
        title: _t18('asset_withdraw'),
        url: '/withdraw',
        isShow: isSimulate.value ? false : true
      }, //提币
      { icon: 'tibi', title: _t18('asset_swap'), url: '/swap', isShow: true }, //闪兑
      { icon: 'daikuai', title: _t18('asset_loan'), url: '/loan', isShow: false }, //助力贷
      {
        icon: 'chongbi',
        title: _t18('asset_transfer'),
        url: '/transfer',
        isShow: !['jphskt'].includes(_getConfig('_APP_ENV'))
      } //划转
    ]
  } else {
    if (['gridai'].includes(_getConfig('_APP_ENV')) || ['bydfe'].includes(_getConfig('_APP_ENV'))) {
      list = [
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true },
        {}
      ]
    } else {
      list = [
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true },
        // { icon: 'chongbi', title: '充币', url: '/recharge', isShow: true },
        // { icon: 'tibi', title: '提币', url: '/withdraw', isShow: true },
        // { icon: 'dui', title: '闪兑', url: '/swap', isShow: true },
        {
          icon: 'daikuai',
          title: _t18('asset_loan'),
          url: '/loan',
          isShow: ['cmmetrics'].includes(_getConfig('_APP_ENV')) ? false : true
        }
      ]
    }
  }

  return list
})
/**
 * 点击快捷充币
 */
const toRecharge = (url) => {
  _toView({
    path: url,
    query: { keyStr: props.keyStr }
  })
  return
  if (DIFF_ISFREEZE_RXCE.includes(__config._APP_ENV) && url == '/recharge') {
    _toView(url)
  } else {
    // if (DIFF_ISFREEZE_RXCE.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE_RXCE, 'RECHARGE')) {
      _toView(url)
    }
    // } else {
    //   _toView(url)
    // }
  }
}

</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
  box-sizing: border-box
}

.stock-amount {
  padding: 20px 0 15px;

  .amount-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    margin-bottom: 30px;


    &-left {
      display: flex;
      flex-direction: column;

      &-title {
        display: flex;
        align-items: center;

        &-money {
          font-size: 14px;
          color: var(--ex-font-color32);
        }


      }

      .yanjin {
        font-size: 25px;
        margin-left: 8px;
      }

      &-number {
        font-size: 24px;
        font-weight: 500;
        margin-top: 13px;

        span {
          font-size: 12px;
        }
      }

      &-cny {
        font-size: 12px;
        margin-top: 7px;
      }
    }

    &-right {
      display: flex;
      align-items: center;

      &-btn {
        display: flex;
        flex-direction: column;
        align-items: center;

        // &:first-child {
        //   margin-right: 30px;
        // }
        .currencyIcon {
          font-size: 48px;
          margin-bottom: 8px;
        }

        &-text {
          font-size: 12px;
          color: var(--ex-assets--font-color);
        }
      }
    }
  }

  .amount-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 26px;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      &-title {
        font-size: 12px;
        font-weight: 500;
        color: var(--ex--home-grid-text-color);
      }

      &-money {
        font-size: 12px;
        margin-top: 13px;
      }
    }
  }
}

.brl {
  margin-left: 20px;
}

.activeColor {
  color: var(--ex-home-tabs-text-atv-color) !important;
}
</style>
