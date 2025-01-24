<!-- 活动弹窗 -->

<template>
  <div class="ActivityPopup">
    <van-popup
        v-model:show="show"
        @close="close"
        :close-on-click-overlay="false"
        :closeable="['mimic'].includes(_getConfig('_APP_ENV'))"
    >
      <div class="ActivityPopup-conent">
        <div class="title">
          <!-- 幸运活动 -->
          {{ _t18('defi_air_activity') }}
        </div>
        <div class="content">
          <div class="tit">
            <!-- 划分 -->
            {{ _t18('divide') }}
            {{ defiStore.divideBalance }} ETH
          </div>
          <div class="row">
            <!-- 当钱包余额达到  -->
            {{ _t18('when_wallet_balance_reaches') }}
            {{ priceFormat(activityInfo.totleAmount, 2) }} USDT，
            <!-- 您将获得 -->
            {{ _t18('you_will_receive') }}
            {{ priceFormat(activityInfo.amount) }}
            {{ coin }}
            <!-- 来自矿池中的奖励 -->
            {{ _t18('rewards_from_pool') }}
          </div>
        </div>
        <div class="footer">
          <div class="row">
            <!-- 接收有效时间 -->
            {{ _t18('receive_valid_time') }}
            ：{{ activityInfo.days }}
            <!-- 天 -->
            {{ _t18('day') }}
          </div>
          <div class="btn" @click="receive">
            <!-- 立即领取 -->
            {{ _t18('claim_immediately') }}
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script setup>
import {priceFormat} from '@/utils/decimal.js'
import {getShowDefiActivityNoticeApi, updateDefiActivityApi} from '@/api/defi'
import {_getConfig, _t18, _toView} from '@/utils/public'
import {dict} from '@/api/common'
import {useDefiStore} from '@/store/defi/index'
import {useUserStore} from "@/store/user";

const defiStore = useDefiStore()
const userStore = useUserStore()

//显示数据
const show = ref(false)
const close = () => {
  show.value = false
}

//显示活动
//活动数据
const activityInfo = ref({})
const setDefiActivityNotice = async () => {
  const res = await getShowDefiActivityNoticeApi(userStore.userInfo.user.userId)
  if (res?.code == 200 && res?.data?.length) {
    res.data = res.data[0]
    res.data.days = Math.ceil((res.data.endTimeS - res.data.beginTimeS) / (24 * 60 * 60 * 1000))
    activityInfo.value = res.data
    show.value = true
  } else {
    show.value = false
  }
}
defineExpose({setDefiActivityNotice})

//defi 活动字典
const defiActivityTypeList = ref([])
const getDefiActivityType = async () => {
  const res = await dict('defi_activity_type')
  if (res.code == 200) {
    defiActivityTypeList.value = res.data
  }
}

//确认已读
const receive = async () => {
  await updateDefiActivityApi({id: activityInfo.value.id, status: '1'})
  close()
  _toView('/defi')
}

//奖励币种
const coin = computed(
    () => defiActivityTypeList.value.find((elem) => elem.dictValue == activityInfo.value?.type)?.dictLabel
)
onMounted(() => {
  getDefiActivityType()
})
</script>
<style lang="scss" scoped>
.ActivityPopup {
  :deep(.van-popup) {
    border-radius: 10px;

    .ActivityPopup-conent {
      min-height: 370px;
      padding: 100px 14px 90px 14px;
      background-image: url("/public/resource/images/dark/defi-notice.png");
      background-repeat: no-repeat;
      background-size: contain;

      .title {
        text-align: center;
        font-family: 'RZRX';
        font-weight: 400;
        font-size: 38px;
        color: var(--ex-default-font-color);
      }

      .content {

        display: flex;
        flex-direction: column;
        justify-content: center;

        .tit {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          font-size: 30px;
          font-family: 'RZRX';
          font-weight: 400;

          background-image: linear-gradient(45deg, #D095C5 0%, #73B8C3 100%);
          -webkit-background-clip: text;
          color: transparent;
        }

        .row {
          margin-top: 20px;
          font-weight: 400;
          font-size: 18px;
          line-height: 25px;
          color: var(--ex-default-font-color);
        }
      }


      .footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;

        .row {
          margin-top: 46px;
          font-weight: 400;

          font-size: 14px;
          color: var(--ex-default-font-color);
        }

        .btn {
          text-align: center;
          width: 100%;
          margin-top: 60px;
          padding: 12px;
          background: linear-gradient(45deg, #E567BF 0%, #805EFF 100%);
          border-radius: 8px;
          font-size: 15px;
          font-weight: 400;
          color: var(--ex-font-color);
        }
      }

    }
  }
}
</style>
