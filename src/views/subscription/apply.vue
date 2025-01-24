<template>
  <div>
    <!-- 确认申购 -->
    <!--
          formData.type == 1 配售  0 申购
        formData.type == 1 ? _t18('Placement') :_t18(`Immediate-subscription`)/>-->

    <HeaderBar
        :currentName=" formData.type == 1 ? _t18('Apply-for-allocation') :_t18(`Apply_subscription`)"></HeaderBar>

    <div class="subApply">

      <!-- 币种介绍 -->
      <CoinInfo :data="formData"></CoinInfo>

      <div v-if="formData.type != 1" class="mt-10"></div>
      <!-- 认购数量 -->
      <div v-else>
        <p class="title fw-bold">{{ _t18('Subscription_quantity') }}</p>

        <div class="infoItem">
          <div class="infoItem-num">
            <input
                type="number"
                class="numInput"
                :placeholder="_t18(`exchange.input`)"
                v-model="number"
            />
            <div class="tip-list">
              <div class="row">
                <!-- 可购买数量 -->
                <div class="label">{{ _t18('available_quantity') }}</div>
                <div class="value">{{ availableNum }} {{ formData.showSymbol }}</div>
              </div>
              <div class="row">
                <!-- 可用余额 -->
                <div class="label">{{ _t18('exchange_balance') }}</div>
                <div class="value">{{ availableBalance || 0 }} USDT</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- 产品详情 -->
      <div class="infoItem">
        <ProductInfo :data="formData"></ProductInfo>
      </div>

      <!-- 产品规则 -->
      <div class="infoItem" v-if="formData.type != 1">
        <RuleInfo :purchaseLimit="formData.purchaseLimit"></RuleInfo>
      </div>

      <!-- 提交申购 -->
      <div class="infoItem btnBox" @click="submit">
        <!--               formData.type == 1 配售  0 申购-->
        <!--        <ButtonBar :btnValue="( formData.type == 1 ? _t18('Placement') :_t18(`Immediately-subscribe`))"/>-->
        <ButtonBar :btnValue="_t18('confirm')"/>

      </div>
    </div>
    <van-dialog v-model:show="show" title=""
                closeOnClickOverlay
                :confirmButtonText="_t18('Go-check')"
                @confirm="to_ok">
      <Nodata></Nodata>
      <div class="dialog-name">{{
          formData.type == 1 ? _t18('Successful-allocation') : _t18('Successful-subscription')
        }}
      </div>
      <div class="dialog-name2">{{
          formData.type == 1 ? _t18('Your-allocation-application-has-been-submitted') : _t18('Your-subscription-application-has-been-submitted')
        }}
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import {_t18} from '@/utils/public'
import HeaderBar from '@/components/HeaderBar/index.vue'
import CoinInfo from './components/CoinInfo.vue'
import ProductInfo from './components/ProductInfo.vue'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import {getOwnCoinDetail, placing} from '@/api/subscription/index'
import {placingownCoinApply, getAvailableNum} from '@/api/subscription/subscribe'
import {_mul, _toFixed} from '@/utils/decimal'
import {_toView} from '@/utils/public'
import {useRouter, useRoute} from 'vue-router'
import {useToast} from '@/hook/useToast'

const {_toast} = useToast()
import {showToast} from 'vant'

import {useUserStore} from '@/store/user/index'
import RuleInfo from "@/views/subscription/components/RuleInfo.vue";
import {useMainStore} from "@/store";

const userStore = useUserStore()
userStore.getUserInfo()
const $router = useRouter()
const route = useRoute()


/**
 * 详情数据
 */
const formData = reactive({})
const show = ref(false)
/**
 * id
 */
const id = ref('')
/**
 * 可用余额
 */
const availableBalance = computed(() => {
  let tempValue = 0
  if (userStore.asset.length) {
    tempValue = userStore.asset.filter((item) => item.symbol === 'usdt')[0]?.availableAmount || 0
  }
  return tempValue
})

const number = ref()
const to_ok = () => {
  _toView(`/subscription/order?type=${formData.type}`)
  show.value = false
}
const submit = async () => {

  getDetail()

  let params = {
    userId: userStore.userInfo.user?.userId,
    ownId: formData.id,
    amount: _mul(formData?.price, number.value || 0),
    number: number.value || 0
  }


  //申购
  if (formData.type != 1) {
    params.number = formData.purchaseLimit
    params.amount = _mul(formData?.price, params.number || 0)
  } else {
    if (availableNum.value <= 0) {
      return (_toast('Please_ correct_quantity'))
    }
    if (!(number.value > 0 && number.value <= availableNum.value)) {
      // 请填写正确数量
      return (_toast('Please_ correct_quantity'))
    }
  }


  var res = null
  if (formData.type == 0) {
      res = await placingownCoinApply(params, {loading: true})
  } else {
    let data =`?amount=${params.amount}&number=${params.number}&ownId=${params.ownId}&userId=${params.userId}`
    res = await placing(data,params, {loading: true})
  }

  if (res.code == 200) {
    show.value = true
  } else {

    showToast(res.msg)
    if (res.code == 500) {
      setTimeout(() => {
        location.reload()
      }, 2000)
    }

  }
}

/**
 * 获取数据详情
 */
const availableNum = ref(0)
const getDetail = async () => {
  if (id.value) {
    const res = await getOwnCoinDetail(id.value)

    if (res.code == 200) {
      const res2 = await getAvailableNum(res.data.id, res.data.coin)

      let unm = +(res2?.data || 0)
      let totalAmount = +(res.data?.totalAmount || 0)

      availableNum.value = _toFixed((totalAmount - +unm), 2)

      Object.assign(formData, res.data)
    }

  }
}
onMounted(() => {
  id.value = route.query.id
  getDetail()
})
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  //   color: var(--ex-home-list-ftcolor2);
}

.noData {

  padding-bottom: 50px;
}

.dialog-name {
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
  color: var(--ex-text-color);
}

.dialog-name2 {
  font-size: 14px;
  text-align: center;
  margin-bottom: 30px;

  color: var(--ex-default-font-color2);
}

.subApply {
  padding: 0 14px 20px;
}

.infoItem {
  padding: 0 0 20px;

  .infoItem-num {
    padding: 14px 14px;
    border-radius: 5px;
    background: var(--ex-financial-card-bg-color);
    box-sizing: border-box;

    .numInput {
      padding: 15px 10px;
      background: var(--ex-financial-card-bg-color);
      width: 100%;
      border-radius: 3px;
      border: 1px solid var(--ex-border-line);
    }

    .numInput::placeholder {
      color: var(--ex-placeholder-font) !important;
    }
  }

  .tip-list {
    .row {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;

      .label {
        color: var(--ex-home-list-ftcolor2);
      }

      div {
        font-size: 12px;
      }
    }
  }
}

.mt-10 {
  margin-top: 20px;
}

.title {
  font-size: 16px;
  padding: 20px 0;
}

.btnBox {
  padding-top: 50px;
}
</style>
