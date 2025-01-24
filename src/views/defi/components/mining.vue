<!-- defi挖矿 新版本 -->
<script setup>
import { DIFF_ISFREEZE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'
const { _isFreeze } = useFreeze()
import { priceFormat } from '@/utils/decimal.js'
import { approve } from '@/plugin/chain/index'
import { useUserStore } from '@/store/user'
import { _toView } from '@/utils/public'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
const router = useRouter()
const props = defineProps({
  incomeInfo: {
    type: Object,
    default: () => {}
  },
  outcomeInfo: {
    type: Object,
    default: () => {}
  }
})
const userStore = useUserStore()
/**
 * 是否授权
 */
const isApprove = computed(() => userStore.userInfo.approve == 1)
/**
 * 授权
 */
/* const toApprove = async () => {
  console.log('toApprove', res)
  const res = await approve().catch((err) => {
    // showToast('用户取消授权')
    _toast('defi_cancel')
  })
  console.log('toApprove', res)
  await userStore.getUserInfo()
} */
const toApproveForm = async () => {
  const res = await approve('USDT').catch((err) => {
    // showToast('用户取消授权')
    _toast('defi_cancel')
  })
  // console.log('toApprove', res)
  if (!res) {
    //授权失败
    // _toast('Please_access_wallet')
    _toast('Authorization_failed')
    // router.push('/no-wallet')
  }
  await userStore.getUserInfo()
}
const toApprove = () => {
  // if (DIFF_ISFREEZE.includes(__config._APP_ENV)) {
  if (_isFreeze(DIFF_ISFREEZE, 'DEFI')) {
    toApproveForm()
  }
  // } else {
  //   toApproveForm()
  // }
}
</script>
<template>
  <div class="mining_box">
    <div class="mining_content" v-if="isApprove">
      <!-- 已授权 -->
      <van-grid :gutter="10" :column-num="2" :border="false" class="list">
        <van-grid-item class="item">
          <div class="line"></div>
          <div class="fw-num">
            {{ priceFormat(userStore.userInfo.appAddressInfo?.usdt || 0, 2) }}
          </div>
          <div class="til">{{ _t18('pledge_hosting') }} USDT</div>
          <image-load filePath="defi/totalOutput.png" name="defi" class="img-icon"></image-load>
        </van-grid-item>
        <van-grid-item class="item">
          <div class="line"></div>
          <div class="fw-num">{{ priceFormat(props.incomeInfo.totalProfit) }}</div>
          <div class="til">{{ _t18('defi_total revenue') }} ETH</div>
          <image-load filePath="defi/userBenefits.png" name="defi" class="img-icon"></image-load>
        </van-grid-item>
        <van-grid-item class="item">
          <div class="line"></div>
          <div class="fw-num">{{ priceFormat(props.incomeInfo.singleRate) }}</div>
          <div class="top til">{{ _t18('defi_single benefit') }}</div>
          <image-load filePath="defi/participant.png" name="defi" class="img-icon"></image-load>
        </van-grid-item>
        <van-grid-item class="item">
          <div class="line"></div>
          <div class="fw-num">{{ priceFormat(props.incomeInfo.dayRate) }}</div>
          <div class="til">{{ _t18('defi_every_day_income') }}</div>
          <image-load filePath="defi/validNode.png" name="defi" class="img-icon"></image-load>
        </van-grid-item>
      </van-grid>
      <div class="mining_btn" @click="_toView('/defiDetail')">
        {{ _t18('defi_earnings Details', ['mimic']) }}
      </div>
    </div>
    <div class="mining_content" v-else>
      <!-- 未授权 -->
      <van-grid :gutter="10" :column-num="2" :border="false" class="list" v-if="!['gridai'].includes(_getConfig('_APP_ENV'))">
        <van-grid-item class="item">
          <div class="line"></div>
          <div class="fw-num">{{ priceFormat(outcomeInfo?.totalOutput) || 0 }}</div>
          <div class="til">{{ _t18('defi_total_output') }} ETH</div>
          <image-load filePath="defi/totalOutput.png" name="defi" class="img-icon"></image-load>
        </van-grid-item>
        <van-grid-item class="item">
          <div class="line"></div>
          <div class="fw-num">{{ priceFormat(outcomeInfo?.userBenefits) || 0 }}</div>
          <div class="til">{{ _t18('defi_user_benefit') }} U</div>
          <image-load filePath="defi/userBenefits.png" name="defi" class="img-icon"></image-load>
        </van-grid-item>
        <van-grid-item class="item">
          <div class="line"></div>
          <div class="fw-num">{{ outcomeInfo?.participant || 0 }}</div>
          <div class="top til">{{ _t18('defi_participant') }}</div>
          <image-load filePath="defi/participant.png" name="defi" class="img-icon"></image-load>
        </van-grid-item>
        <van-grid-item class="item">
          <div class="line"></div>
          <div class="fw-num">{{ outcomeInfo?.validNode || 0 }}</div>
          <div class="til">{{ _t18('defi_valid_node') }}</div>
          <image-load filePath="defi/validNode.png" name="defi" class="img-icon"></image-load>
        </van-grid-item>
      </van-grid>
      <div class="mining_btn" @click="toApprove">
        <image-load filePath="defi/fly.png" name="defi" class="fly"></image-load>
        {{ _t18('defi_takePart_in', ['gridai']) }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.mining_box {
  .mining_content {
    .item {
      align-items: flex-start;
      border-radius: 10px;
      position: relative;
      .line {
        width: 18px;
        height: 2px;
        background: var(--ex-financial-num-bg-color);
      }
      .fw-num {
        font-size: 16px;
        word-break: break-all;
        color: var(--ex-default-font-color);
        margin: 20px 0 2px;
        word-break: break-all;
        width: 80px;
      }
      .til {
        word-wrap: break-word;
        color: var(--ex-eth-label-color);
        font-size: 13px;
      }
      .img-icon {
        width: 44px;
        height: 44px;
        position: absolute;
        right: 18px;
        top: 18px;
      }
    }
    :deep(.van-grid-item__content) {
      border: 1px solid rgba(136, 133, 251, 0.19);
      border-radius: 10px;
      align-items: flex-start;
      padding-left: 10px;
    }
  }
  .mining_btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--ex-eth-button-color);
    padding: 15px;
    border-radius: 8px;
    font-size: 16px;
    color: var(--ex-font-color);
    text-align: center;
    cursor: pointer;
    .fly {
      width: 16px;
      margin-right: 14px;
      margin-bottom: 3px;
    }
  }
}
</style>
