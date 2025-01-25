<!-- 充值申请 -->
<template>
  <HeaderBar :currentName="currentName"></HeaderBar>
  <div class="recharge-apply">
    <div class="apply-header">
      <svg-load :name="route.query.coin" class="header-coin"></svg-load>
      <!-- 二维码 -->
      <div class="erweima" v-if="!route.query.isMCS">
        <QRCode :address="address"></QRCode>
      </div>
      <!-- 银行信息 -->
      <!-- <div class="erweima" >
        <div class="bankinfo" @click="bankinfodialog('EUR1', -1)">
          <span :class="-1 == wireTransferListIndex ? 'cueBank' : ''">EUR</span>
        </div>
        <div class="bankinfo" @click="bankinfodialog(it.title, idx)"
          v-for="( it, idx ) in  mainStore.rechargeWireTransfer " :key="idx">
          <span :class="idx == wireTransferListIndex ? 'cueBank' : ''">{{ it.title }}</span>
        </div>
        <p class="promptinfo">{{ _t18('promp_tinfo') }}</p>
      </div> -->

      <!-- 在线和服/充值地址  -->
      <!-- <div class="online-address" v-if="!route.query.isMCS">
        <p class="top">{{ _t18('recharge_address', ['bitmake']) }}({{ route.query.type }})</p>
        <div class="address">{{ address }}</div>
        <van-button block class="service-btn" @click="_copy(address)">
          {{ _t18('copy') }}
        </van-button>
      </div> -->
    </div>
    <!-- 申请信息 -->
    <div class="applyMes">
      <div class="num">
        <!-- 充值地址 -->
        <p class="top">{{ _t18('account') }}</p>
        <div class="bottom">
          <input  :placeholder="_t18('recharge_input') + _t18('account')" class="ff-num" v-model="form.cardNo" />
        </div>
      </div>
      <div class="num">
        
     
     <!-- 充值金额 -->
     <p class="top">{{ _t18('recharge_money') }}</p>
        <div class="bottom">
          <input type="number" :placeholder="_t18('recharge_input') + _t18('recharge_money')" class="ff-num" v-model="form.money" />
        </div>
      </div>
        <!-- 上传支付详情截图 -->

      <!-- <div class="uploadImg">
        <p class="top">{{ _t18('recharge_imgUpload', ['bitmake']) }}</p>
        <van-uploader :after-read="afterRead" max-count="1" v-model="fileList">
          <div class="bottom">
            <van-icon name="add-o" size="44" color="var(--ex-financial-line-bg-color)" />
          </div>
        </van-uploader>
      </div> -->
    </div>
    <!--    <template v-if="['rxce', 'bitbyex', 'gmmoin', 'ex'].includes(_getConfig('_APP_ENV'))">-->
    <!--      &lt;!&ndash; 复制按钮 &ndash;&gt;-->
    <!--      <div class="btn" @click="_copy(address)">-->
    <!--        <p>{{ _t18('copy') }}</p>-->
    <!--      </div>-->
    <!--      <div class="tip-list">-->
    <!--        <div class="tip" v-for="(item, index) in tipList" :key="index">-->
    <!--          {{ index + 1 }}.{{ item.content }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      &lt;!&ndash; 充值说明列表 &ndash;&gt;-->
    <!--      <div class="tip-list" v-if="['bitbyex'].includes(_getConfig('_APP_ENV'))">-->
    <!--        <div class="tip" v-for="(item, index) in tipList2" :key="index">-->
    <!--          {{ item.content }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="tip-list" v-else>-->
    <!--        <div class="tip" v-for="(item, index) in tipList" :key="index">-->
    <!--          {{ index + 1 }}.{{ item.content }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </template>-->
    <!--    <template v-else-if="['gmtoin', 'nzqsoin'].includes(_getConfig('_APP_ENV'))">-->
    <!--      <div class="tip-list">-->
    <!--        <div class="tip">{{ _t18('account_balance_info') }}</div>-->
    <!--      </div>-->
    <!--    </template>-->
    <!--    <template v-else-if="['aams', 'gmmoin'].includes(_getConfig('_APP_ENV'))"></template>-->
    <!-- 确认充值 -->
   
    <ButtonBar @click="submit" :btnValue="_t18('recharge_require', ['bitmake'])"></ButtonBar>

    <!--    <div class="advertBox" v-if="['mirae', 'miraeasset'].includes(_getConfig('_APP_ENV'))">-->
    <!--      <Advert></Advert>-->
    <!--    </div>-->
  </div>
</template>

<script setup>
import Advert from '@/components/Advert/index.vue'
import { uploadImg } from '@/api/common/index.js'
import { showDialog, showToast } from 'vant'
import { updatePaySubmit, getUserRechageNewApi } from '@/api/account.js'
import { _toView, _hideAddress, _t18, _getConfig } from '@/utils/public'
import { priceFormat } from '@/utils/decimal'
import QRCode from '@/components/common/QRCode/index.vue'
import { debounce } from 'lodash'
import { useToast } from '@/hook/useToast'
import { useCopy } from '@/hook/useCopy'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '@/store'
import { onMounted, reactive } from 'vue'


const { _toast, _showName } = useToast()
const { _copy } = useCopy()
const route = useRoute()
const router = useRouter()
// 充值
const currentName = `${route.query.type}`
// const cuttentRight = { iconRight: [{ iconName: 'jilu', clickTo: '/recharge-order' }] }
/**
 * 充值说明
 */
const tipList = reactive([
  { content: _t18('recharge_tip1') },
  { content: _t18('recharge_tip2') },
  { content: _t18('recharge_tip3') },
  { content: _t18('recharge_tip4') }
])
const tipList2 = reactive([{ content: _t18('recharge_tip5') }])
const num = ref('')
const fileList = ref([])
const afterRead = (file) => {
  file.status = 'uploading'
  // 此时可以自行将文件上传至服务器
  let formData = new FormData()
  formData.append('file', file.file)
  uploadImg(formData).then((res) => {
    res = res.data
    if (res.code == 200) {
      file.res = res.url
      file.status = 'success'
    } else {
      showToast(res.msg)
      fileList.value = []
    }
  })
}

const form = ref({
  cardNo:null,
money:null,
// filePath:null
})
const submit = debounce(() => {
  if (!form.value.cardNo ) {
    // 请填写充值卡号
    return _toast(_showName('recharge_input') + _showName('account'))
  }
  if (!form.value.money ) {
    // 请填写充值金额
    return _toast(_showName('recharge_input') + _showName('recharge_money'))
  }
  // let filePath = ''
  // if (fileList.value.length == 0) {
  //   // 请上传截图
  //   return _toast('recharge_img')
  // }
  // const file = fileList.value[0] || {}
  // filePath = file.res
  // if (file.status != 'success') {
  //   // 图片上传中,稍后重试
  //   return _toast('recharge_img_load')
  // }
  // form.value.filePath = filePath
  // if (route.query.isMCS) {
  //   let index = wireTransferListIndex.value == -1 ? 0 : wireTransferListIndex.value
  //   params = {
  //     amount: priceFormat(num.value),
  //     filePath: filePath || '',
  //     address: '',
  //     // coin: mainStore.rechargeWireTransfer[index]?.coin,
  //     // type: mainStore.rechargeWireTransfer[index]?.type
  //     type: "BANK",
  //     coin: "usdt"
  //   }
  // }
  updatePaySubmit(form.value,{loading:true}).then((res) => {
    if (res.code == 200) {
      _toast('recharge_success') // 充值成功
      form.value.cardNo = null 
      form.value.money = null
      // location.href = res.data.payUrl
      setTimeout(() => {
        // _toView('/recharge-order')
      window.open(res.data.payUrl)

      }, 500)
    } else {
      showToast(res.msg)
    }
  })
}, 500)

const mainStore = useMainStore()

</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.recharge-apply {
  padding: 0 16px;

  .apply-header {
    background: var(--ex-financial-card-bg-color);
    border-radius: 10px;
    padding: 20px 0 30px;

    .header-coin {
      display: flex;
      margin: 0 auto;
      font-size: 50px;
    }

    .erweima {
      // padding: 48px 0 30px;
      padding: 15px 0 10px;

      .bankinfo {
        font-size: 18px;
        padding: 8px 8px;
        border-radius: 8px;
        margin: 10px 0 16px;
        text-align: center;

        span.customer {
          margin-left: 4px;
          font-size: 12px;
          color: var(--ex-font-color9);
          text-decoration: underline;
        }
      }

      .promptinfo {
        border-radius: 8px;
        padding: 0 14px;
        font-size: 12px;
        color: var(--ex-passive-font-color);
        line-height: 1.4;
      }
    }

    .online-service,
    .online-address {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .online-service {
      .tip {
        margin-bottom: 15px;
      }
    }

    .online-address {
      .top {
        color: var(--ex-assets--font-card-color);
        margin-top: 10px;
      }

      .address {
        font-size: 12px;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid var(--ex-border-line);
        margin: 10px 0 16px;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}

.applyMes {
  background: var(--ex-financial-card-bg-color);
  border-radius: 10px;
  padding: 20px 14px 30px;
  margin-top: 16px;

  &>div {
    margin-bottom: 20px;

    p {
      color: var(--ex-passive-font-color);
      margin-bottom: 10px;
    }
  }

  .address {
    .bottom {
      word-break: break-all;
    }
  }

  .num {
    .bottom {
      border: 1px solid var(--ex-border-line);
      padding: 15px 10px;
      border-radius: 3px;

      input {
        width: 100%;
        background: var(--ex-financial-card-bg-color);
      }

      input::placeholder {
        color: var(--ex-placeholder-font);
        font-size: 14px;
      }
    }
  }

  .uploadImg {
    .van-uploader {
      width: 100%;

      :deep(.van-uploader__input-wrapper) {
        width: 100%;
      }
    }

    .bottom {
      border: 1px solid var(--ex-border-line);
      padding: 35px 0;
      text-align: center;
      border-radius: 3px;

      .img {
        font-size: 36px;
      }
    }
  }
}

.service-btn {
  width: 113px;
  height: 35px;
  text-align: center;
  background: var(--ex-copy-font-bg-color);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: var(--ex-copy-font-color);
}

.btn {
  margin-top: 30px;
  padding: 0 0 55px;

  p {
    text-align: center;
    padding: 14px 0;
    font-size: 16px;
    border-radius: 8px;
    background: var(--ex-primary-color);
    color: var(--ex-default-font-color);
  }
}

.tip-list {
  padding: 0 15px;

  .tip {
    margin-bottom: 15px;
  }
}

.advertBox {
  padding: 0 15px;
}

.cueBank {
  color: var(--ex-text-color);
}
</style>
