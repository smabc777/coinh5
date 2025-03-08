<template>
  <van-form class="Account">
    <!-- 账号 密码 验证码 -->
    <div class="formData">
      <p>{{ _t18('account') }}</p>
      <van-field :onkeyup="formData.loginName = formData.loginName.replace(/\s+/g, '')" autocomplete="off"
        v-model="formData.loginName" :placeholder="accountPld()" />
    </div>
    <div class="formData">
      <p>{{ _t18('login_pwd') }}</p>
      <van-field autocomplete="off" v-model="formData.loginPassword" :class="isEye ? '' : 'pass'" type="text"
        :placeholder="pwdPld(1)">
        <template #button>
          <svg-load :name="isEye ? 'openeyes' : 'closeeyse'" class="icon2" @click="isEye = !isEye"></svg-load>
        </template>
      </van-field>
    </div>
    <div class="formData">
      <p>{{ _t18('register_pwd_require') }}</p>
      <van-field autocomplete="off" v-model="formData.newPassword" :class="isEye2 ? '' : 'pass'" type="text"
        :placeholder="pwdPld(2)">
        <template #button>
          <svg-load :name="isEye2 ? 'openeyes' : 'closeeyse'" class="icon2" @click="isEye2 = !isEye2"></svg-load>

        </template>
      </van-field>
    </div>
    <!-- 必填/选填 -->
    <div class="formData">
      <p v-if="tradeStore.rateinfo.invitationDisplay">{{
        _t18('register_invitation')
      }}({{ _t18('required') }})</p>
      <p v-else>{{ _t18('register_invitation', ['moonex']) }} ({{ _t18('optional', ['moonex']) }})</p>
      <van-field autocomplete="off" v-model="formData.activeCode" :placeholder="invitationPld()" />
    </div>
    <div class="formData" v-if="mainStore.getISCode">
      <p>{{ _t18('login_code') }}</p>
      <van-field autocomplete="off" v-model="formData.code" :placeholder="codePld()">
        <template #button>
          <img class="form-code" :src="codeUrl" @click="timestamp = +new Date()" />
        </template>
      </van-field>
    </div>


   
    <ButtonBar class="form-but" :btnValue="_t18('register')" @click="submit"></ButtonBar>


    <div class="is-account">
      {{ _t18('register_haveAccount') }}？
      <span @click="_toReplace('/login')">
        {{ _t18('register_toLogin') }}
      </span>
    </div>
  </van-form>
</template>

<script setup>
import { _getConfig, _t18, _toReplace, _toView } from '@/utils/public'
import { useToast } from '@/hook/useToast'
import { useMainStore } from '@/store/index'
import { useRoute } from 'vue-router'
import { signUp } from "@/api/user";
import { REGISTER_REQUIRED_ACTIVECODE } from "@/config";
import { showToast } from "vant";
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()
const { _toast, _showName } = useToast()
const route = useRoute()
const mainStore = useMainStore()

//注册数据
const isEye = ref(false)
const isEye2 = ref(false)

const formData = ref({
  signType: 3, //注册类型：1邮箱 2手机 3普通
  loginName: '', //用户名
  loginPassword: '', //密码
  newPassword: '', //二次密码
  activeCode: route.query.invite_code || '', //邀请码
  code: '' //验证码
})

const accountPld = () => {
  let i18n = _showName('login_name') + _showName('account')
  if (['moonex'].includes(_getConfig('_APP_ENV'))) {
    i18n = _showName('accountPld', ['moonex'])
  }
  return i18n
}
const pwdPld = (type) => {
  let i18n = _showName('login_please') + _showName('login_pwd')
  if (['moonex'].includes(_getConfig('_APP_ENV'))) {
    if (type == 1) {
      i18n = _showName('pwdPld', ['moonex'])
    } else if (type == 2) {
      i18n = _showName('pwdPld2', ['moonex'])
    }
  }
  return i18n
}
const invitationPld = () => {
  let i18n = _showName('login_please') + _showName('register_invitation')
  if (['moonex'].includes(_getConfig('_APP_ENV'))) {
    i18n = _showName('register_invitationPld', ['moonex'])

  }
  return i18n
}
const codePld = () => {
  var i18n = _showName('login_please') + _showName('login_code')
  if (['moonex'].includes(_getConfig('_APP_ENV'))) {
    i18n = _showName('login_please') + ' ' + _showName('login_code2', ['moonex'])
  }
  return i18n
}

// 图形验证码地址
const timestamp = ref(+new Date())
const codeUrl = computed(
  () => `${mainStore.verificationCodeUrl}?codeType=REGISTER&timestamp=${timestamp.value}`
)

// 注册
const submit = async () => {


  if (!formData.value.loginName) {
    return _toast('please_user')
  }
  if (!formData.value.loginPassword) {
    return _toast('please_pwd')
  }
  // 确认密码验证
  if (formData.value.loginPassword !== formData.value.newPassword) {
    return _toast('register_pwd_diff')
  }
  if (formData.value.loginPassword.length < 6 || formData.value.newPassword.length < 6) return _toast('stock95')

  // 邀请码必填
  if (!formData.value.activeCode && tradeStore.rateinfo.invitationDisplay) {
    return _toast(_showName('swap_input') + _showName('plug_shareCode'))
  }
  // 条件验证码
  if (!formData.value.code && mainStore.getISCode) {
    return _toast('please_code')
  }

  const res = await signUp(formData.value, { loading: true })

  if (res.code == 200) {
    return showToast({
      message: _showName('register_success'),
      onClose: () => {
        _toReplace('/login')
      }
    })
  } else {
    _toast(res.msg)
    timestamp.value = +new Date()
  }

}

</script>

<style lang="scss" scoped>
.Account {
  //padding-top: 45px;

  .formData {
    padding-right: .5px;
    margin-top: 14px;
    position: relative;

    p {
      font-size: 14px;
      color: var(--ex-input-label-color);
    }

    :deep(.van-field) {
      margin-top: 10px;
      padding: 14px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0);

      /* 焦点状态样式 */
      &:hover {
        border: 1px solid var(--ex-input-focus-color);
        outline: none;

        /* 防止点击时出现默认的浏览器外观 */
        input::placeholder {
          color: var(--ex-white);
        }
      }
    }

    .forgotPwd {
      text-align: right;
      margin-top: 8px;
      height: 14px;
      font-size: 14px;
      color: var(--ex-text-color);
    }

    .van-field__button {
      position: relative;


      .form-code {
        position: absolute;
        top: -2px;
        right: 0;
        height: 28px;
      }

      .form-eye {
        display: flex;
        align-items: center;
      }
    }

  }

  .form-but {
    margin-top: 32px;
    min-height: 54px;
    border-radius: 8px;
    width: 100%;
    padding: 16px;
    font-size: 18px;
  }

  .is-account {

    margin-top: 20px;
    text-align: center;
    font-size: 14px;

    span {
      color: var(--ex-text-color);
    }
  }

}
.van-cell:after{
  display:none;
}
</style>
