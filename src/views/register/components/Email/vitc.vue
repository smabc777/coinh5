<template>
  <van-form class="Email">
    <!-- 邮箱 -->
    <div class="formData">
      <p>{{ _t18('i18n_temp.fanyi.282058-7', ['vitc']) }}</p>
      <van-field
        autocomplete="off"
        v-model="formData.email"
        type="email"
        :placeholder="_t18('recharge_input_email', ['vitc'])"
      />
    </div>
    <div class="formData">
      <p>{{ _t18('login_mobileCode') }}</p>
      <van-field
        autocomplete="off"
        v-model="formData.phone"
        type="phone"
        :placeholder="_t18('login_please') + `&nbsp;`+_t18('login_mobileCode')"
      />
    </div>
    <!--  密码  -->
    <div class="formData">
      <p>{{ _t18('login_pwd') }}</p>
      <van-field
        autocomplete="off"
        v-model="formData.loginPassword"
        :type="!isEye ? 'password' : 'text'"
        :placeholder="_t18('i18n_temp.fanyi.282058-0', ['vitc'])"
      >
        <template #button>
          <van-icon
            class="form-eye"
            @click="isEye = !isEye"
            :name="isEye ? 'eye' : 'closed-eye'"
            size="20"
          />
        </template>
      </van-field>
    </div>
    <!--  确认密码  -->
    <div class="formData">
      <p>{{ _t18('register_pwd_require') }}</p>
      <van-field
        autocomplete="off"
        v-model="formData.newPassword"
        :type="!isEye ? 'password' : 'text'"
        :placeholder="_t18('i18n_temp.fanyi.282058-1', ['vitc'])"
      >
        <template #button>
          <van-icon
            class="form-eye"
            @click="isEye = !isEye"
            :name="isEye ? 'eye' : 'closed-eye'"
            size="20"
          />
        </template>
      </van-field>
    </div>

    <!--  邀请码  -->
    <div class="formData">
      <p>{{ _t18('register_invitation') }}({{ _t18('i18n_temp.fanyi.282058-2', 'vitc') }})</p>
      <van-field
        autocomplete="off"
        v-model="formData.activeCode"
        :placeholder="_t18('i18n_temp.fanyi.282058-3', 'vitc')"
      />
    </div>
    <!-- 验证码 -->
    <div class="formData">
      <p>{{ _t18('i18n_temp.fanyi.282058-4', ['vitc']) }}</p>
      <van-field
        autocomplete="off"
        v-model="formData.code"
        :placeholder="_t18('recharge_input_email_code', ['vitc'])"
      >
        <template #button>
          <van-button
            v-if="!+time"
            class="form-code-but"
            @click="send"
            type="primary"
            color="linear-gradient(39deg, #CB4EE8 0%, #10F4B1 100%)"
            >{{ _t18('login_send') }}
          </van-button>
          <div class="form-code-but form-count-down" v-else>
            <van-count-down :time="time" format="ss" @finish="time = 0" />
          </div>
        </template>
      </van-field>
    </div>

    <van-button class="form-but" type="primary" color="#613AF1" @click="submit"
      >{{ _t18('register') }}
    </van-button>

    <div class="is-account">
      {{ _t18('i18n_temp.fanyi.282058-8', ['vitc']) }}
      <span @click="_toReplace('/')">
        {{ _t18('i18n_temp.fanyi.282058-9', ['vitc']) }}
      </span>
    </div>
  </van-form>
</template>

<script setup>
import { _t18, _toReplace } from '@/utils/public'
import { useMainStore } from '@/store/index'
import { emailCode, signIn, signUp } from '@/api/user'
import { useUserStore } from '@/store/user'
import { useToast } from '@/hook/useToast'
import { showToast } from 'vant'
import { useRoute } from 'vue-router'
import { REGISTER_REQUIRED_ACTIVECODE } from '@/config'

const { _toast, _showName } = useToast()
const route = useRoute()
const mainStore = useMainStore()
const userStore = useUserStore()

//注册数据
const isEye = ref(false)
const formData = ref({
  email: '', //邮箱
  phone: '', //手机号
  signType: 1, //注册类型：1邮箱 2手机 3普通
  loginPassword: '', //密码
  newPassword: '', //二次密码
  activeCode: route.query.invite_code || '', //邀请码
  code: '' //验证码
})

// 邮箱验证码
const time = ref(0)
const send = () => {
  if (!formData.value.email) {
    return _toast(`login_please_emailCode`)
  }
  //发送验证码
  emailCode('REGISTER', formData.value.email, { loading: true }).then((res) => {
    if (res.code == '200') {
      time.value = 60 * 1000
    }
    _toast(res.msg)
  })
}

// 注册
const submit = async () => {
  if (!formData.value.email) {
    return _toast('i18n_temp.fanyi.282058-6', ['vitc'])
  }
  if (!formData.value.loginPassword) {
    return _toast('i18n_temp.fanyi.282058-0', ['vitc'])
  }
  // 确认密码验证
  if (formData.value.loginPassword !== formData.value.newPassword) {
    return _toast('register_pwd_diff')
  }
  // 邀请码必填
  if (!formData.activeCode && REGISTER_REQUIRED_ACTIVECODE.includes(__config._APP_ENV)) {
    return _toast('i18n_temp.fanyi.282058-3', ['vitc'])
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
.Email {
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
        outline: none; /* 防止点击时出现默认的浏览器外观 */
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
        font-size: 12px;
        text-align: center;
      }

      .form-count-down {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--ex-default-font-color);
        background: linear-gradient(39deg, #cb4ee8 0%, #10f4b1 100%);
        border-radius: 7px;
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
