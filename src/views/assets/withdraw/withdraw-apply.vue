<!-- 提现申请 -->
<template>
  <HeaderBar :currentName="currentName"></HeaderBar>
  <!-- 展示分为2种 一种币 一种银行卡 -->
  <!-- 提现-币 -->
  <div class="header-amount" v-if="$route.query.icon != 'card'">
    <div class="coin">
      <svg-load :name="$route.query.icon" class="coin-img"></svg-load>

      <div class="title">{{ $route.query.type }}</div>
    </div>
    <div class="userAmount">
      <p class="tips">{{ _t18('swap_available') }}</p>
      <p class="tips-amount">
        <span>{{ priceFormat(amount) }}</span>
        <span>{{ $route.query.type?.toUpperCase() }}</span>
      </p>
    </div>
  </div>
  <!-- 提现-卡 -->
  <div class="header-amount-bank" v-else>
    <div class="userAmount">
      <div></div>
      <div>
        <p class="tips">{{ _t18('swap_available') }}</p>
        <p class="tips-amount">
          <span>{{ priceFormat(amount) }}</span>
          <span>{{ $route.query.type?.toUpperCase() }}</span>
        </p>
      </div>
    </div>

    <div class="coin" @click="showSheet = true">
      <!-- {{ curBank }} -->
      <!-- 银行卡logo 需确认 暂时注释-->
      <svg-load :name="$route.query.icon" class="coinImg"></svg-load>
      <div class="bank-item">
        <div class="bankName">
          <div>{{ curBank?.bankName || '***' }}</div>
          <div>{{ hideBank(curBank?.cardNumber || '') }}</div>
        </div>
        <svg-load name="jiantou" class="jiantou"></svg-load>
      </div>
    </div>
  </div>
  <van-action-sheet v-model:show="showSheet" :closeable="false" teleport="body"
    :style="{ maxWidth: 'var(--ex-max-width)', left: '50%', translate: '-50%' }">
    <div class="sheetBox">
      <!-- 选择银行卡 -->
      <div class="title fw-bold">{{ _t18('withdraw_select_card') }}</div>
      <div v-for="(item, index) in bankList" :key="index" class="sheetContent" @click="selectSheet(item)">
        <svg-load :name="$route.query.icon" class="coin"></svg-load>
        <div>
          <p class="bankName">
            {{ item?.bankName }} <span class="scl" v-if="item?.coin">（{{ item?.coin }}）</span>
          </p>
          <p class="cardNumber fw-num">{{ hideBank(item?.cardNumber) }}</p>
        </div>
      </div>
    </div>
  </van-action-sheet>
  <div class="content">
    <div class="form">
      <div class="num">
        <!-- 提现数量 -->
        <div class="top">
          {{ _t18('withdraw_num', ['bitmake']) }}

          <!--   无该币种资金 显示换算数额  -->
          <span v-if="$route.query.type != curBank?.coin && WithdrawMt5Amount && allAmount">
            {{ _t18('asset_equivalent') }}
            ({{ priceFormat(allAmount * WithdrawMt5Amount, 8) + curBank?.coin }})
          </span>
        </div>
        <div class="bottom">
          <input type="number" v-model="allAmount" :placeholder="_t18('withdraw_input')" class="ff-num" />
          <p @click="allNum()">{{ _t18('swap_all') }}</p>
        </div>
      </div>
      <div class="address" v-if="$route.query.icon != 'card'">
        <!-- 提现地址 -->
        <div class="top">{{ _t18('withdraw_address') }}</div>
        <div class="bottom">
          <input type="text" v-model="address" :placeholder="_t18('withdraw_input')" />
        </div>
      </div>
      <div class="password">
        <!-- 提现密码 -->
        <div class="top">{{ _t18('withdraw_pwd', ['rxce']) }}</div>
        <div class="bottom">
          <input :type="showk ? 'text' : 'password'" v-model="password" :placeholder="_t18('withdraw_input')" />
          <svg-load :name="showk ? 'yanjin-k' : 'yanjin-g'" class="yanjing" @click="showk = !showk"></svg-load>
        </div>
      </div>
    </div>
    <div class="tip">
      <div v-if="['smartfund'].includes(_getConfig('_APP_ENV'))">
        {{ _t18('promp_tinfo') }}
      </div>
      <!-- 温馨提示：提现会收取部分手续费，提现后24小时之内 到账，如有疑问请     联系客服-->
      <div v-if="!['vitc'].includes(_getConfig('_APP_ENV'))">
        {{
          _t18('withdraw_tip')
        }}<span class="customer" @click="dispatchCustomEvent('event_serviceChange')">{{
          _t18('custorm_service')
          }}</span>
      </div>
      <!-- 手续费 -->
      <!--      <div v-if="['coinsexpto'].includes(_getConfig('_APP_ENV'))">-->
      <!--        {{ _t18('withdraw_commission') }}：<span class="ff-num"-->
      <!--      >{{ $route.query.fee || '' }} {{ $route.query.icon.toLocaleUpperCase() }}</span-->
      <!--      >-->
      <!--      </div>-->
      <div v-if="!['vitc'].includes(_getConfig('_APP_ENV'))">
        {{ _t18('withdraw_commission') }}：<span class="ff-num">{{ $route.query.ratio * allAmount }}</span>
      </div>
    </div>
  </div>
  <div class="btnBox" @click="submit">
    <!-- 确认提现 -->
    <ButtonBar :btnValue="_t18('withdraw_require')" />
  </div>
</template>

<script setup>
import { dispatchCustomEvent } from '@/utils'
import { DIFF_ISFREEZE, DIFF_WITHDRAW2, DIFF_ISFREEZE_RXCE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'

const { _isFreeze } = useFreeze()
import {
  getBindCardList,
  haveCacheAddress,
  getCacheStatus,
  saveCacheAddress,
  withdrawSubmit2,
} from '@/api/account.js'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
//   import Amount from '../components/applyAmount.vue'
import { withdrawSubmit, getWithdrawMt5Amount } from '@/api/account'
import { _toView } from '@/utils/public'
import { _toFixed2, priceFormat } from '@/utils/decimal.js'
import { showToast } from 'vant'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
import { filterCoin2 } from '@/utils/public'
import { onMounted } from 'vue'
import { useMainStore } from '@/store/index.js'

const mainStore = useMainStore()
const { _toast } = useToast()
const userStore = useUserStore()

// 用户信息
const { userInfo } = storeToRefs(userStore)
// 用户余额信息
const { asset } = storeToRefs(userStore)
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentName = _t18('withdraw', ['latcoin'])
// const cuttentRight = { iconRight: [{ iconName: 'jilu', clickTo: '/withdraw-order' }] }
const showk = ref(false)

// 银行卡数据
const curBank = ref({})
const showSheet = ref(false)
const selectSheet = (item) => {
  showSheet.value = false
  curBank.value = item
  //获取汇率
  const index = asset.value.findIndex(
    (item) => filterCoin2(item.symbol) == curBank.value.coin?.toLowerCase()
  )
  if (index == -1) {
    getWithdrawMt5(item.coin)
  }
}

const amount = computed(() => {
  let data = 0

  //银行卡提现--> 显示对应币种资产 无则默认显示 usdt资产
  const index =
    route.query?.icon == 'card' &&
    asset.value.findIndex((item) => filterCoin2(item.symbol) == curBank.value.coin?.toLowerCase())
  //查询余额
  for (let i = 0; i < asset.value.length; i++) {
    // 银行卡提现
    if (route.query?.icon == 'card') {
      if (
        asset.value[i].type == 1 &&
        filterCoin2(asset.value[i].symbol) ==
        (index != -1 ? curBank.value.coin?.toLowerCase() : 'usdt')
      ) {
        data = asset.value[i].availableAmount
        route.query.type = index != -1 ? curBank.value.coin : 'USDT'
      }
    } else {
      // 币种提现
      if (asset.value[i].type == 1 && filterCoin2(asset.value[i].symbol) == route.query?.icon) {
        data = asset.value[i].availableAmount
      }
    }
  }
  return data
})

// 获取银行卡信息
const hideBank = (item) => {
  let str = ''
  var str1 = item.substring(0, 4)
  var str2 = item.substring(item.length - 4, item.length)
  str = str1 + ' *** *** ' + str2
  return str
}

//银行卡列表
const bankList = ref([])
const getCardList = async () => {
  const res = await getBindCardList()
  if (res.code == '200') {
    if (res.data.length > 0) {
      bankList.value = res.data
      selectSheet(res.data[0])
    } else {
      // showToast('请先绑定银行卡')
      _toast('Unbound_bank_card')
      setTimeout(() => {
        router.push('/bind-card')
      }, 1000)
    }
  }
}

// 获取usdtd到银行卡币种汇率
const WithdrawMt5Amount = ref(0)
const getWithdrawMt5 = (coin) => {
  if (!coin) return (WithdrawMt5Amount.value = 0)
  getWithdrawMt5Amount(coin).then((res) => {
    if (res.code == '200' && res.data) {
      WithdrawMt5Amount.value = res.data
    }
  })
}

onMounted(() => {
  if (route.query?.icon == 'card') {
    getCardList()
  }
})

const allAmount = ref('')
/**
 * 提现地址
 */
const address = ref('')
provide('address', address)
if ([].includes(__config._APP_ENV)) {
  // 显示用户绑定地址
  address.value = userInfo.value?.user?.address
}
const password = ref('')
let allNum = () => {
  allAmount.value = amount.value
}

// 特殊平台，提现需要初级认证（初级）
// const primaryAuth = ref(userInfo.value.detail?.auditStatusPrimary)
const primaryAuth = computed(() => {
  return userInfo.value.detail?.auditStatusPrimary
})
// 特殊平台，提现需要高级认证（高级）
// const advancedAuth = ref(userInfo.value.detail?.auditStatusAdvanced)
const advancedAuth = computed(() => {
  return userInfo.value.detail?.auditStatusAdvanced
})
// 提交
const submitForm = async () => {

  let flag = true
  // 非空判断
  if (allAmount.value == '' || allAmount.value > amount.value || allAmount.value <= 0) {
    return (_toast('withdraw_please_num'))
  }

  if (route.query?.icon != 'card' && (address.value == '' || address.value == null)) {
    return (_toast('withdraw_please_address'))
  }

  if (password.value == '') {
    return (_toast('withdraw_please_pwd'))
  }

  if (!['vitc'].includes(__config._APP_ENV)) {
    if (password.value.length != password.value.replace(/[^\w]/g, '').length) {
      // showToast('密码只能有字母和数字')
      _toast('register_pwd_NoSpecialSymbols')
      return
    }
  }
  // await userStore.getUserInfo()

  if (userInfo.value.detail?.userTardPwd == null) {
    // showToast('请设置资金密码')
    flag = false
    _toast('withdraw_please_fundPwd')
    setTimeout(() => {
      router.push('/fund-password')
    }, 800)

    return flag
  }
  // 初级实名认证
  if (['bydfe'].includes(__config._APP_ENV) && allAmount.value > 100) {
    console.log(primaryAuth.value)
    flag = false
    if (primaryAuth.value !== '1') {
      _toast('please_primary')
      setTimeout(() => {
        router.push('/certification-primary')
      }, 1000)
      return flag
    } else {
      flag = true
    }
  }

  // 高级实名认证
  if (['bydfe'].includes(__config._APP_ENV) && allAmount.value > 500) {
    flag = false
    if (advancedAuth.value !== '1') {
      _toast('please_advanced')
      setTimeout(() => {
        router.push('/certification-advanced')
      }, 1000)
      return flag
    } else {
      flag = true
    }
  }
  // 初级实名认证才能提现
  if (['vitc'].includes(__config._APP_ENV)) {
    flag = false
    if (primaryAuth.value != '1') {

      _toast('please_primary')
      setTimeout(() => {
        router.push('/certification-primary')
      }, 1000)
      return flag
    }
    flag = true
  }
  // 高级实名认证才能提现
  if (['cmmetrics'].includes(__config._APP_ENV)) {
    flag = false
    if (advancedAuth.value !== '1') {

      _toast('please_advanced')
      setTimeout(() => {
        router.push('/certification-advanced')
      }, 1000)
      return flag
    }
    flag = true
  }

  //  参数组装
  let params = ``
  let params2 = {}
  if (route.query?.icon == 'card') {
    params = `amount=${priceFormat(allAmount.value)}&coinType=BANK&pwd=${password.value}&adress=${curBank.value.cardNumber
      }&coin=${curBank.value.coin?.toLowerCase() || route.query.type?.toLowerCase()}&bankName=${curBank.value.bankName
      }&bankUserName=${curBank.value.userName}&bankBranch=${curBank.value.bankBranch}`
    params2 = {
      amount: Number(priceFormat(allAmount.value)),
      coinType: 'BANK',
      pwd: password.value,
      adress: curBank.value.cardNumber,
      coin: curBank.value.coin?.toLowerCase() || route.query.type?.toLowerCase(),
      bankName: curBank.value.bankName,
      bankUserName: curBank.value.userName,
      bankBranch: curBank.value.bankBranch
    }
  } else {
    params = `amount=${priceFormat(allAmount.value)}&coinType=${route.query?.type}&pwd=${password.value
      }&adress=${address.value}&coin=${route.query?.icon}`
    params2 = {
      amount: Number(priceFormat(allAmount.value)),
      coinType: route.query?.type,
      pwd: password.value,
      adress: address.value,
      coin: route.query?.icon,
    }
  }

  if (flag) {
    if (DIFF_WITHDRAW2.includes(__config._APP_ENV)) {
      const res = await getCacheStatus()
      if (res.data) {
        return (_toast('last_order_info'))
      }
    }
  }


  submitApi(params, params2)
}
const setAddress = (params) => {
  let data = { coin: route.query?.type, address: address.value }
  saveCacheAddress(data).then((res) => {
    if (res.code == '200') {
      submitApi(params, params2)
    }
  })
}
const submitApi = (params, data) => {
  withdrawSubmit(params, data, { loading: true }).then((res) => {
    if (res.code == '200') {
      // showToast('提现成功')
      _toast('stock91')
      // 提交成功
      setTimeout(() => {
        router.push('/withdraw-order')
      }, 1000)
    } else {
      showToast(res.msg)
    }
  })
}
const submit = () => {
  // if (DIFF_ISFREEZE.includes(__config._APP_ENV) || DIFF_ISFREEZE_RXCE.includes(__config._APP_ENV)) {
  if (_isFreeze(DIFF_ISFREEZE, 'WITHDRAW') && _isFreeze(DIFF_ISFREEZE_RXCE, 'WITHDRAW')) {
    submitForm()
  }
  // } else {
  //   submitForm()
  // }
}

</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.header-amount {
  display: flex;
  justify-content: space-between;
  padding: 16px 15px 0;

  .coin {
    display: flex;
    align-items: center;

    .coin-img {
      width: 40px;
      height: 40px;
    }

    .title {
      font-size: 16px;
      margin-left: 6px;
    }

    .bankName {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .cardNumber {
      font-size: 18px;
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;

      .jiantou {
        font-size: 10px;
      }
    }
  }

  .userAmount {
    .tips {
      font-size: 11px;
      color: var(--ex-passive-font-color);
    }

    .tips-amount {
      font-size: 16px;
      margin-top: 6px;

      :first-child {
        color: var(--ex-font-color9);
      }

      :last-child {
        margin-left: 6px;
      }
    }
  }
}

.header-amount-bank {
  padding: 0 20px;

  .coin {
    display: flex;
    align-items: center;
    margin-top: 10px;
    background: var(--ex-financial-card-bg-color);
    border-radius: 10px;
    padding: 10px 10px 2px;

    .coinImg {
      width: 30px;
      height: 30px;
    }

    .title {
      font-size: 16px;
      margin-left: 6px;
    }

    .bank-item {
      display: flex;
      justify-content: space-between;
      flex: 1;
      align-items: center;
      margin-left: 8px;

      .bankName {
        div {
          font-size: 14px;
          color: var(--ex-passive-font-color);
        }

        :nth-child(1) {
          margin-bottom: 10px;
        }
      }

      .cardNumber {
        font-size: 18px;
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;

        .jiantou {
          font-size: 10px;
        }
      }
    }
  }

  .userAmount {
    display: flex;
    justify-content: flex-end;

    .tips {
      font-size: 13px;
      color: var(--ex-passive-font-color);
    }

    .tips-amount {
      font-size: 16px;
      margin-top: 6px;

      :first-child {
        color: var(--ex-font-color9);
      }

      :last-child {
        margin-left: 6px;
      }
    }
  }
}

.content {
  padding: 20px 15px;

  .form {
    background: var(--ex-financial-card-bg-color);
    border-radius: 10px;
    padding: 20px 0px 5px;

    &>div {
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--ex-passive-font-color);

        .right {
          font-size: 10px;
          color: var(--ex-eth-font-color);
          text-decoration: underline;
        }
      }

      .coin-top {
        justify-content: left;
      }

      .bottom {
        margin: 10px 0 20px;
        padding: 15px 10px;
        border: 1px solid var(--ex-border-line);
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          align-items: center;
        }

        input {
          flex: 1;
          background: var(--ex-financial-card-bg-color);
        }

        input::placeholder {
          color: var(--ex-placeholder-font) !important;
        }

        p {
          //   color: var(--ex-font-color9);
          color: var(--ex-copy-font-color);
        }

        .yanjing {
          font-size: 16px;
        }
      }
    }
  }

  .tip {
    margin-top: 16px;

    div {
      font-size: 12px;
      color: var(--ex-passive-font-color);
      line-height: 1.4;

      span.customer {
        margin-left: 4px;
        font-size: 12px;
        color: var(--ex-font-color9);
        text-decoration: underline;
      }
    }

    &>div:first-child {
      margin-bottom: 3px;
    }
  }
}

.btnBox {
  padding: 20px 15px 50px;
  border-radius: 8px;
}

.sheetBox {
  padding: 0 15px 30px;
  max-height: 300px;
  overflow: auto;

  .title {
    font-size: 18px;
    padding: 30px 0 30px;
    text-align: center;
  }

  .sheetContent {
    background-color: var(--ex-div-bgColor8);
    padding: 15px 10px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .coin {
      font-size: 20px;
      margin-right: 15px;
    }

    p {
      color: var(--ex-default-font-color);
      font-size: 14px;
    }

    .bankName {
      margin-bottom: 10px;

      .scl {}
    }

    .cardNumber {
      font-size: 18px;
    }
  }
}
</style>
