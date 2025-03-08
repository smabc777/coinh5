<template>
  <van-form class="Email">
    <!-- 邮箱 -->
    <div class="formData">
      <p>{{ _t18('login_emailCode') }}</p>
      <van-field   autocomplete="off"
        v-model="formData.email"
        type="email"
        :placeholder="_t18('login_please') + _t18('login_emailCode',['moonex'])"
      />
    </div>
    <!-- 验证码 -->
    <div class="formData">
      <p>{{ _t18('login_code',['moonex']) }}</p>
      <van-field   autocomplete="off" v-model="formData.code"
                   :placeholder="codePld()">
        <template #button>
          <van-button
            v-if="!+time"
            class="form-code-but"
            @click="send"
            type="primary"
            color="linear-gradient(39deg, #CB4EE8 0%, #10F4B1 100%)"
            >{{ _t18('login_send') }}</van-button
          >
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
  </van-form>
</template>

<script setup>
import {_getConfig, _t18, _toView} from '@/utils/public'
import { useMainStore } from '@/store/index'
import { emailCode, signIn } from "@/api/user";
import { useUserStore } from "@/store/user";
import { useToast } from "@/hook/useToast";
import { showToast } from "vant";
import {useRouter} from "vue-router";

const { _toast, _showName } = useToast()
const mainStore = useMainStore()
const userStore = useUserStore()
const router = useRouter()
//数据
const formData = ref({
  email: '', //邮箱
  signType: 1,////自定义注册类型：1普通2邮箱3手机
  code: '' //验证码
})

// 邮箱验证码
const time = ref(0)
const send = () => {

  if (!formData.value.email) {
    return _toast(`login_please_emailCode`)
  }
  //发送验证码
  emailCode('LOGIN', formData.value.email,  {loading:true}).then((res) => {
    if (res.code == '200') {
      time.value = 60 * 1000
    } else {
      _toast(res.msg)
    }
  })
}
const codePld = () => {
  var i18n = _showName('login_please') + _showName('login_code')
  if (['moonex'].includes(_getConfig('_APP_ENV'))) {
    i18n = _showName('login_please') + ' ' + _showName('login_code2', ['moonex'])
  }
  return i18n
}

// 邮箱登录
const submit = async () => {

  if (!formData.value.email) {
    return _toast('please_email')
  }
  if (!formData.value.code) {
    return _toast('please_code')
  }

  const res = await signIn(formData.value,  {loading:true})

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

.Email {
  //padding-top: 45px;

  .formData { padding-right: .5px;
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
      border: 1px solid  rgba(0,0,0,0);
      /* 焦点状态样式 */
      &:hover{
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
        font-size: 12px;
        text-align: center;
      }
      .form-count-down{
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--ex-default-font-color);
        background: linear-gradient(39deg, #CB4EE8 0%, #10F4B1 100%);
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
.van-cell:after{
  display:none;
}
</style>
