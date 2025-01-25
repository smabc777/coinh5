<template>
  <van-form class="Mobile">
    <!-- 手机号 -->
    <div class="formData">
      <p>{{ _t18('login_mobileCode') }}</p>
      <van-field autocomplete="off" v-model="formData.phone" type="number"
        :placeholder="_t18('login_please') + _t18('login_mobileCode')">
        <template #button>
          <div class="form-area-code" @click="areaCodeShow = true">
            <span>+{{ formData.areaCode }}</span>
            <van-icon class="form-area-code-icon" name="play" />
          </div>
        </template>
      </van-field>
    </div>
    <!--  密码  -->
    <div class="formData">
      <p>{{ _t18('login_pwd') }}</p>
      <van-field autocomplete="off" v-model="formData.loginPassword" :type="!isEye ? 'password' : 'text'"
        :placeholder="pwdPld(1)">
        <template #button>
          <van-icon class="form-eye" @click="isEye = !isEye" :name="isEye ? 'eye' : 'closed-eye'" size="20" />
        </template>
      </van-field>
    </div>
    <!--  确认密码  -->
    <div class="formData">
      <p>{{ _t18('register_pwd_require') }}</p>
      <van-field autocomplete="off" v-model="formData.newPassword" :type="!isEye ? 'password' : 'text'"
        :placeholder="pwdPld(2)">
        <template #button>
          <van-icon class="form-eye" @click="isEye = !isEye" :name="isEye ? 'eye' : 'closed-eye'" size="20" />
        </template>
      </van-field>
    </div>
    <!--  邀请码  -->
    <div class="formData">
      <p v-if="REGISTER_REQUIRED_ACTIVECODE_MOBILE.includes(_getConfig('_APP_ENV'))">{{ _t18('register_invitation')
        }}({{
        _t18('required') }})</p>
      <p v-else>{{ _t18('register_invitation', ['moonex']) }} ({{ _t18('optional', ['moonex']) }})</p>
      <van-field autocomplete="off" v-model="formData.activeCode" :placeholder="invitationPld()" />
    </div>
    <!-- 验证码 -->
    <div class="formData">
      <p>{{ _t18('login_code', ['moonex']) }}</p>
      <van-field autocomplete="off" v-model="formData.code" :placeholder="codePld()">
        <template #button>
          <van-button v-if="!+time" class="form-code-but" @click="send" type="primary"
            color="linear-gradient(39deg, #CB4EE8 0%, #10F4B1 100%)">{{ _t18('login_send') }}
          </van-button>
          <div class="form-code-but form-count-down" v-else>
            <van-count-down :time="time" format="ss" @finish="time = 0" />
          </div>
        </template>
      </van-field>
    </div>

    <van-button class="form-but" type="primary" color="#613AF1" @click="submit">{{
        _t18('register')
      }}
    </van-button>

    <div class="is-account">
      {{ _t18('register_haveAccount') }}？
      <span @click="_toReplace('/')">
        {{ _t18('register_toLogin') }}
      </span>
    </div>

    <!--  区号弹窗  -->
    <areaCode></areaCode>
  </van-form>
</template>

<script setup>
import areaCode from './components/areaCode.vue'
import { _getConfig, _t18, _toReplace } from '@/utils/public'
import { useMainStore } from '@/store/index'
import { emailCode, mobileCode, signIn, signUp } from "@/api/user";
import { useUserStore } from "@/store/user";
import { useToast } from "@/hook/useToast";
import { showToast } from "vant";
import { REGISTER_REQUIRED_ACTIVECODE_MOBILE } from "@/config";
import { useRoute } from "vue-router";

const { _toast, _showName } = useToast()
const route = useRoute()
const mainStore = useMainStore()
const userStore = useUserStore()
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

//注册数据
const isEye = ref(false)
const formData = ref({
  phone: '', //手机号
  signType: 2, //注册类型：1邮箱 2手机 3账号
  areaCode: ['jphskt'].includes(_getConfig('_APP_ENV')) ? '81' : '93', ///号码-区号
  loginPassword: '', //密码
  newPassword: '', //二次密码
  activeCode: route.query.invite_code || '', //邀请码
  code: '' //验证码
})
if (['cmmetrics'].includes(__config._APP_ENV)) {
  formData.value.areaCode = '1'
}


// 区号弹窗
const areaCodeShow = ref(false)
const areaCodeClose = () => {
  areaCodeShow.value = false
}
// 设置区号
const setAreaCode = (areaCode) => {
  areaCodeShow.value = false
  formData.value.areaCode = areaCode
}
provide('areaCodeShow', areaCodeShow)
provide('areaCodeClose', areaCodeClose)
provide('setAreaCode', setAreaCode)

// 手机号验证码
const time = ref(0)
const send = () => {

  // 验证手机号
  if (!formData.value.phone || !formData.value.areaCode) {
    return _toast(`please_mobile`)
  }

  //发送验证码
  mobileCode('REGISTER', formData.value.areaCode + formData.value.phone, { loading: true }).then((res) => {
    if (res.code == '200') {
      time.value = 60 * 1000

    }
    _toast(res.msg)
  })
}

// 手机号注册

const submit = async () => {

  // 验证手机号
  if (!formData.value.phone || !formData.value.areaCode) {
    return _toast('please_mobile')
  }

  //区号+手机号
  // formData.value.phone = formData.value.areaCode + formData.value.phone

  if (!formData.value.loginPassword) {
    return _toast('please_pwd')
  }
  // 确认密码验证
  if (formData.value.loginPassword !== formData.value.newPassword) {
    return _toast('register_pwd_diff')
  }
  // 邀请码必填
  if (!formData.value.activeCode && REGISTER_REQUIRED_ACTIVECODE_MOBILE.includes(__config._APP_ENV)) {
    return _toast('plug_shareCode')
  }
  // 条件验证码
  if (!formData.value.code && mainStore.getISCode) {
    return _toast('please_code')
  }
  console.log(formData.value)
  let params = {
    activeCode: formData.value.activeCode,
    code: formData.value.code,
    loginPassword: formData.value.loginPassword,
    newPassword: formData.value.newPassword,
    phone: formData.value.areaCode + formData.value.phone,
    signType: 2
  }
  // const res = await signUp(formData.value, {loading: true})
  const res = await signUp(params, { loading: true })

  if (res.code == 200) {
    return showToast({
      message: _showName('register_success'),
      onClose: () => {
        _toReplace('/')
      }
    })
  } else {
    _toast(res.msg)
    timestamp.value = +new Date()
  }

}


</script>

<style lang="scss" scoped>
.Mobile {
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

      .form-code-but {
        position: absolute;
        top: -4.4px;
        right: 0;
        height: 34px;
        padding: 0 10px;
        min-width: 76px;
        text-align: center;
        font-size: 12px;
      }

      .form-count-down {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--ex-default-font-color);
        background: linear-gradient(39deg, #CB4EE8 0%, #10F4B1 100%);
        border-radius: 7px;
      }

      .form-area-code {
        display: flex;
        color: var(--ex-default-font-color);
        align-items: center;
        position: relative;
        padding-left: 8px;

        span {
          font-size: 14px;
          padding-right: 6px;
        }

        .form-area-code-icon {
          color: var(--ex-default-font-color);
          transform: rotate(.25turn);
        }

        &:after {
          content: ' ';
          position: absolute;
          left: 0;
          width: 1px;
          height: 25px;
          background: #979797;
        }
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
</style>
