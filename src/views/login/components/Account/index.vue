<template>
  <van-form class="Account">
    <!-- 账号 -->
    <div class="formData">
      <p v-if="!['vitc'].includes(_getConfig('_APP_ENV'))">{{ _t18('account') }}</p>
      <p v-else>{{ _t18('login_emailCode') }}</p>
      <van-field autocomplete="off" v-model="formData.loginName"
        :placeholder="_t18('login_please') + _t18('account')" />

    </div>
    <!-- 密码 -->
    <div class="formData">
      <p>{{ _t18('login_pwd') }}</p>
      <van-field autocomplete="off" :class="isEye ? '' : 'pass'" v-model="formData.loginPassword" type="text"
        :placeholder="_t18('login_please', ['moonex']) + _t18('login_pwd', ['moonex'])">
        <template #button>
          <svg-load :name="isEye ? 'openeyes' : 'closeeyse'" class="icon2" @click="isEye = !isEye"></svg-load>

        </template>
      </van-field>
      <div class="forgotPwd">
        <span @click="_toView('/forgot-password')">{{ _t18('forget_pwd') }}?</span>
      </div>
    </div>
    <!-- 验证码 -->
    <div class="formData" v-if="mainStore.getISCode">
      <p>{{ _t18('login_code', ['moonex']) }}</p>
      <van-field autocomplete="off" v-model="formData.code" :placeholder="codePld()">
        <template #button>
          <img class="form-code" :src="codeUrl" @click="timestamp = +new Date()" />
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
  </van-form>
</template>

<script setup>
import { _getConfig, _t18, _toView } from '@/utils/public'
import { useMainStore } from '@/store/index'
import { signIn } from '@/api/user'
import { useUserStore } from '@/store/user'
import { useToast } from '@/hook/useToast'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const { _toast, _showName } = useToast()
const mainStore = useMainStore()
const userStore = useUserStore()
const router = useRouter()
//数据
const isEye = ref(false)
const formData = ref({
  loginName: '', //用户名/邮箱/手机号
  loginPassword: '', //密码
  signType: 3, ////自定义注册类型：1普通2邮箱3手机
  code: '' //验证码
})

// 图形验证码地址
const timestamp = ref(+new Date())
const codeUrl = computed(
  () => `${mainStore.verificationCodeUrl}?codeType=LOGIN&timestamp=${timestamp.value}`
)

const codePld = () => {
  var i18n = _showName('login_please') + _showName('login_code')
  if (['moonex'].includes(_getConfig('_APP_ENV'))) {
    i18n = _showName('login_please') + ' ' + _showName('login_code2', ['moonex'])
  }
  return i18n
}

// 登录
const submit = async () => {
  if (!formData.value.loginName) {
    return _toast('please_user')
  }
  if (!formData.value.loginPassword) {
    return _toast('please_pwd')
  }
  if (mainStore.getISCode && !formData.value.code) {
    return _toast('please_code')
  }

  const res = await signIn(formData.value, { loading: true })

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
.Account {
  //padding-top: 45px;

  .formData {
    padding-right: 0.5px;
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
      margin-bottom: 4px;
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
