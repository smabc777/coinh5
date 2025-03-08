<template>
  <van-form class="Mobile">
    <!-- 手机号 -->
    <div class="formData">
      <p>{{ _t18('login_mobileCode', ['moonex']) }}</p>
      <van-field autocomplete="off" v-model="formData.phone" type="number" :placeholder="mobilePld()">
        <template #button>
          <div class="form-area-code" @click="areaCodeShow = true">
            <span>+{{ formData.areaCode }}</span>
            <van-icon class="form-area-code-icon" name="play" />
          </div>
        </template>
      </van-field>
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

 
    <ButtonBar class="form-but" :btnValue="_t18('login')" @click="submit"></ButtonBar>

    <div class="is-account">
      {{ _t18('login_noAccount') }}？
      <span @click="_toView('/register')">
        {{ _t18('login_toRegister') }}
      </span>
    </div>

    <!--  区号弹窗  -->
    <areaCode></areaCode>
  </van-form>
</template>

<script setup>
import areaCode from './components/areaCode.vue'
import { _getConfig, _t18, _toView } from '@/utils/public'
import { useMainStore } from '@/store/index'
import { emailCode, mobileCode, signIn } from "@/api/user";
import { useUserStore } from "@/store/user";
import { useToast } from "@/hook/useToast";
import { showToast } from "vant";
import { useRouter } from "vue-router";

const { _toast, _showName } = useToast()
const mainStore = useMainStore()
const userStore = useUserStore()
const router = useRouter()
//数据
const formData = ref({
  phone: '', //手机号
  areaCode: '93', //号码-区号
  signType: 2,////自定义注册类型：1普通2邮箱3手机
  code: '' //验证码
})
if (['jphskt'].includes(__config._APP_ENV)) {
  formData.value.areaCode = '81'
}
if (['cmmetrics'].includes(__config._APP_ENV)) {
  formData.value.areaCode = '1'
}

const codePld = () => {
  var i18n = _showName('login_please') + _showName('login_code')
  if (['moonex'].includes(_getConfig('_APP_ENV'))) {
    i18n = _showName('login_please') + ' ' + _showName('login_code2', ['moonex'])
  }
  return i18n
}

const mobilePld = () => {

  let i18n = _showName('login_please') + _showName('login_mobileCode')
  if (['moonex'].includes(_getConfig('_APP_ENV'))) {
    i18n = _showName('login_please') + ' ' + _showName('login_mobileCode2', ['moonex'])
  }
  return i18n
}

// 区号弹窗
const areaCodeShow = ref(false)
const areaCodeClose = () => {
  areaCodeShow.value = false
}
// 设置区号
const setAreaCode = (areaCode) => {
  areaCodeShow.value = false
  console.log('---sadasdass----', areaCode)
  formData.value.areaCode = areaCode
}
provide('areaCodeShow', areaCodeShow)
provide('areaCodeClose', areaCodeClose)
provide('setAreaCode', setAreaCode)

// 手机号验证码
const time = ref(0)
const send = () => {

  if (!formData.value.phone) {
    return _toast(`please_mobile`)
  }
  //发送验证码
  mobileCode('LOGIN', formData.value.areaCode + formData.value.phone, { loading: true }).then((res) => {
    if (res.code == '200') {
      time.value = 60 * 1000

    }
    _toast(res.msg)
  })
}

// 手机号登录
const submit = async () => {

  if (!formData.value.phone) {
    return _toast('please_mobile')
  }
  if (!formData.value.code) {
    return _toast('please_code')
  }
  let params = {
    code: formData.value.code,
    phone: formData.value.areaCode + formData.value.phone,
    signType: 2
  }
  const res = await signIn(params, { loading: true })

  if (res.code == 200 && res.data.satoken) {
    userStore.setIsSign(true)
    userStore.setToken(res.data.satoken)
    // userStore.getUserInfo()
    return showToast({
      message: _showName('login_success'),
      onClose: () => {
        router.replace('/')
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

    &:nth-of-type(2) {
      margin-bottom: 18px;
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
.van-cell:after{
  display:none;
}
</style>
