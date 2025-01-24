<template>
  <div class="cardBox">
    <!--申购标题-->
    <div class="cardTitle">
      <div class="fw-bold title">{{ data.showSymbol }}</div>
      <!-- 筹备 -->
      <div class="right preparation" v-if="data.status == '1' || null">
        {{ _t18('Preparation') }}
      </div>
      <div class="right btn" v-else-if="data.status == '2'" @click="toBuy">
        <!--        type= 1  配售  0  申购-->
        {{ data.type == 1 ? _t18('Placement') : _t18('Immediately-subscribe') }}
      </div>
      <!-- 已结束 -->
      <div class="right Inover" v-else-if="data.status == '3'">{{ _t18('In_over') }}</div>
    </div>

    <!--申购详情-->
    <div class="cardInfo">
      <div class="top">
        <div class="label">
          {{ _t18('Lock-up_period') }}
        </div>
        <div class="value">
          {{ _timeFormat(data.beginTime, 'MM/DD/YYYY HH:mm:ss', true) || '' }} ~
          {{ _timeFormat(data.endTime, 'MM/DD/YYYY HH:mm:ss', true) || '' }}
        </div>
      </div>
      <div class="center">
        <van-progress
            :percentage="percentage"
            color="var(--ex-primary-color)"
            track-color="#30354d"
        />
      </div>
      <div class="bottom">
        <div class="left">
          <span class="white">{{ data.raisedAmount || 0 }} {{ data.showSymbol }}</span> /
          {{ data.totalAmount || 0 }}
          {{ data.showSymbol }}
        </div>
        <div class="right">
          {{ _t18('Remaining') }} <span class="white">{{ _toFixed((100 - percentage)) }}%</span>
        </div>
      </div>
      <!--配售-->
      <div class="bottom" v-if="data.type == 1">
        <div class="right">
          {{ _t18('Estimated-listing-price') }}<span class="white">{{ data.estimatedPrice }} {{
            data.showSymbol
          }}：</span>
        </div>
        <div class="left">
          <span class="white"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {_t18, _toView} from '@/utils/public'
import {_div, _sub, _add, _mul, _toFixed, _SN2D} from '@/utils/decimal.js'
import {_timeFormat} from '@/utils/public'
import {useRouter} from 'vue-router'
import {subscribeCoins} from '@/api/subscription/index.js'
import {useUserStore} from '@/store/user'
import {Dialog, showDialog, showToast, Toast} from 'vant'
import {onMounted} from 'vue'
import {useToast} from '@/hook/useToast'

const {_toast} = useToast()
const disableBtn = ref(0)
// 申购订阅
const btn_subscription = (model) => {
  // 用户信息
  const useStore = useUserStore()
  const userInfo = useStore.userInfo

  const params = {
    userId: userInfo.user.userId, //用户
    ownId: model.id, //订阅币种ID
    ownCoin: model.showSymbol, //币种名称
    price: model.price //初始单价
  }

  subscribeCoins(params).then((res) => {
    disableBtn.value = 1
    showDialog({
      message: res.msg
    })
  })
}

const props = defineProps({
  data: {
    type: Object
  }
})
onMounted(() => {
  disableBtn.value = props.data.params.sub_status
})
const percentage = computed(() => {
  const umn = _toFixed(_mul(_div(props.data.raisedAmount, props.data.totalAmount), 100), 4)
  return umn > 100 ? 100 : umn
})
const toBuy = () => {
  if (props.data.params?.sub_status == '2' || props.data.params?.sub_status == '3') {
    // 申购  0  配售 1
    if (props.data.type == 1) {
      _toView(`/subscription/info?id=${props.data.id}`)
    } else {
      _toView(`/subscription/apply?id=${props.data.id}`)
    }

  } else {
    // 未订阅不可申购
    _toast('cannot_subscribe')
  }
}
</script>

<style lang="scss" scoped>
* {
  font-size: 12px;
  color: var(--ex-home-list-ftcolor2);
}

.cardBox {
  margin: 20px 15px;
  border-radius: 5px;
  background: var(--ex-financial-card-bg-color);
  margin-bottom: 22px;
  padding: 20px 14px;
  box-sizing: border-box;

  //订阅按钮
  .subscribe-button {
    text-align: center;
    padding-bottom: 0.7rem;

    .button-subscribe-button {
      display: block;
      margin: 0 auto;
      font-size: 0.2rem;
      font-weight: bold;
      color: var(--ex-default-font-color);
      height: 0.9rem;
      padding: 0 2.5rem 0 2.5rem;
    }
  }

  .cardTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 16px;
      color: var(--ex-default-font-color);
    }

    .right {
      line-height: normal;
      padding: 8px 20px;
      border-radius: 8px;
    }

    .preparation {
      background: #252059;
    }

    .btn {
      background: var(--ex-primary-color);
      color: var(--ex-default-font-color);
    }

    .Inover {
      background: #30354d;
    }
  }

  .cardInfo {
    margin-top: 10px;

    .top {
      padding: 15px 0 10px 0;

      div {
        font-size: 12px;
        font-weight: 400;
      }

      .label {
        color: var(--ex-home-list-ftcolor2);
      }

      .value {
        margin-top: 10px;
        color: var(--ex-primary-color);
      }
    }

    .center {
      margin: 10px 0 16px 0;
    }

    .bottom {
      padding: 15px 0px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        // color: #a1a1a1;
        color: var(--ex-home-list-ftcolor2);
      }

      .right {
        // color: #a1a1a1;
        color: var(--ex-home-list-ftcolor2);
      }

      .white {
        color: var(--ex-default-font-color);
      }
    }
  }
}
</style>
