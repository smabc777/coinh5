<!-- 初级认证 -->
<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import Success from '../components/Success.vue'
import { uploadKYC } from '@/api/user'
import { reactive } from 'vue'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { _getConfig, _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast, _showName } = useToast()
const userStore = useUserStore()
userStore.getUserInfo()
// 用户信息
const { userInfo } = storeToRefs(userStore)
const formData = reactive({
  userName: '',
  number: ''
})
const cuttentRight = {
  iconRight: [{ iconName: 'kefu', iconSize: '20px', clickTo: 'event_serviceChange' }]
}
// 是否初级认证
const primaryAuth = ref(userInfo.value.detail?.auditStatusPrimary)

// 审核状态 0未申请 1通过 3审核中 2拒绝
// 提交认证信息
const submit = () => {
  if (formData.userName.trim() == '') {
    // showToast('请填写姓名')
    _toast('advanced_please_name')
    return
  }
  if (formData.number.trim() == '') {
    // showToast('请填写身份证号')
    _toast('login_please_id_number', ['vitc', 'cmmetrics'])
    return
  }
  // realName 姓名 ,idCard 证件号码 ,flag 1 初级 2高级
  let params = `realName=${formData.userName}&idCard=${formData.number}&flag=1`
  uploadKYC(params).then((res) => {
    if (res.code == '200') {
      // showToast('提交成功，请等待...')
      _toast('advanced_please_wait')
      primaryAuth.value = '3'
      userStore.getUserInfo()
    } else {
      showToast(res.msg)
      primaryAuth.value = '2'
    }
  })
}
const reSubmit = () => {
  primaryAuth.value = '0'
}
</script>
<template>
  <!-- 导航条 -->
  <HeaderBar :currentName="_t18('sidebar_primary', ['smartfund', 'moonex'])" :cuttentRight="cuttentRight"></HeaderBar>
  <div class="content" v-if="primaryAuth == '0' || primaryAuth == null">
    <div class="tip advanced_txt">
      <image-load filePath="defi/tips.png" name="tips" class="tips"></image-load>{{ _t18('advanced_txt', ['aams',
    'aug', 'moonex', 'vitc']) }}
    </div>
    <div v-if="['coinsexpto'].includes(_getConfig('_APP_ENV'))" class="tip_info">
      {{ _t18('basic_certification_info') }}
    </div>
    <div class="form">
      <div class="label">{{ _t18('advanced_name') }}</div>
      <div class="formInput">
        <input :placeholder="_t18('login_please_real_name')" v-model="formData.userName" />
      </div>
      <div class="label">{{ _t18('advanced_license_number', ['cmmetrics']) }}</div>
      <div class="formInput">
        <input :placeholder="_t18('login_please_id_number', ['vitc', 'cmmetrics'])" v-model="formData.number" />
      </div>
    </div>
    <div class="btnBox" @click="submit">
      <ButtonBar :btnValue="_t18('advanced_submit')" />
    </div>
  </div>
  <!-- 审核中 -->
  <div class="success" v-if="primaryAuth == '3'">
    <Success :text="_t18('under_review')" :imgUrl="'defi/zhong.png'" :color="'#333'">
      <template #btn>
        <div class="message">{{ _t18('under_reviews') }}</div>
        <div class="btnBox" @click="_back()">
          <ButtonBar :btnValue="_t18('finish')" />
        </div>
      </template>
    </Success>
  </div>
  <!-- 审核失败 -->
  <div class="success" v-if="primaryAuth == '2'">
    <Success :text="_t18('Audit_failure')" :imgUrl="'defi/failed.png'" :color="'#333'">
      <template #btn>
        <p style="margin-top:10px;font-size: 14px" v-if="['cmmetrics'].includes(_getConfig('_APP_ENV'))">
          {{ userInfo?.detail?.firstReason || '' }}</p>
        <div class="btnBox" @click="reSubmit">
          <ButtonBar :btnValue="_t18('Resubmit')" />
        </div>
      </template>
    </Success>
  </div>
  <!-- 审核成功 -->
  <div v-if="primaryAuth == '1'">
    <Success :text="_t18('advanced_success')" :imgUrl="'defi/success.png'" :color="'#333'"></Success>
    <div class="fromContent">
      <div>{{ _t18('advanced_name') }}：{{ userInfo.detail?.realName }}</div>
      <div>{{ _t18('advanced_license_number', ['cmmetrics']) }}：{{ userInfo.detail?.idCard }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  padding: 30px 15px 0 15px;
  color: var(--ex-default-font-color);

  .tip {
    font-size: 12px;
    color: var(--ex-text-color);
  }

  .tip_info {
    font-size: 12px;
    text-align: left;
  }

  .advanced_txt {
    font-size: 14px;
    margin-bottom: 24px;
    text-align: left;
  }

  .tips {
    width: 16px;
    height: 16px;
    margin: 0 2px;
    vertical-align: top;
  }

  .form {
    padding-top: 5px;
    font-size: 14px;

    .label {
      // width: 70px;
      color: var(--ex-input-label-color2);
      text-align: left;
    }

    .formInput {
      align-items: center;
      margin: 9px 0 24px 0;

      input {
        padding: 0 14px;
        width: 100%;
        height: 46px;
        font-size: 14px;
        border-radius: 8px;
        background: var(--ex-input-background-color);
        border: 1px solid rgba(0, 0, 0, 0);

        &::placeholder {
          color: var(--ex-input-font-color2);
        }
      }

      /* 焦点状态样式 */
      input:focus {
        border: 1px solid var(--ex-input-focus-color);
        outline: none;

        /* 防止点击时出现默认的浏览器外观 */
        &::placeholder {
          color: var(--ex-white);
        }
      }
    }
  }

  .message {
    font-size: 14px;
    color: #a7afb7;
    margin-top: 10px;
  }

  .btnBox {
    width: 100%;
    margin-top: 50px;
  }
}

.fromContent {
  color: var(--ex-default-font-color);
  padding: 70px 15px;

  div {
    border: 1px solid var(--ex-input-focus-color);
    margin-bottom: 20px;
    padding: 16px 13px;
    border-radius: 8px;
    background: var(--ex-input-background-color);
    color: var(--ex-default-font-color);
  }
}

.success {
  color: var(--ex-default-font-color);
  margin-top: 100px;
}
</style>
