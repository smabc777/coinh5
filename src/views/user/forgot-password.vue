<!-- 忘记密码 -->
<template>
  <van-form class="forgot-password">
    <!--语言切换-->
    <div class="languages">
      <div class="right" @click="_toView('/language-selection')">
        <image-load :filePath="currentLanguage.imgUrl" class="lang img" />
        <span>{{ currentLanguage.remark }}</span>
      </div>
      <van-icon @click="_toView('/login')" name="cross" size="20" color="var(--ex-default-font-color)" />
    </div>

    <div class="content">
      <!-- 邮箱 -->
      <div class="formData">
        <p>{{ _t18('login_emailCode') }}</p>
        <van-field autocomplete="off" v-model="formData.email" type="email"
          :placeholder="_t18('vitc_recharge_input_email')" />
      </div>

      <!-- 验证码 -->
      <div class="formData">
        <p>{{ _t18('login_code') }}</p>
        <van-field autocomplete="off" v-model="formData.code" :placeholder="_t18('vitc_recharge_input_email_code')">
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

      <!--  密码  -->
      <div class="formData">
        <p>{{ _t18('forgot_newPwd') }}</p>
        <van-field autocomplete="off" :class="isEye ? '' : 'pass'" v-model="formData.password" type="text"
          :placeholder="_t18('vitc_please_enter_newpwd')">
          <template #button>
            <svg-load :name="isEye ? 'openeyes' : 'closeeyse'" class="icon2" @click="isEye = !isEye"></svg-load>
          </template>
        </van-field>
      </div>

      <!--  确认密码  -->
      <div class="formData">
        <p>{{ _t18('forgot_require_newPwd') }}</p>
        <van-field autocomplete="off" v-model="formData.newPassword" :class="isEye ? '' : 'pass'" type="text"
          :placeholder="_t18('vitc_please_enter_newpwd')">
          <template #button>
            <svg-load :name="isEye1 ? 'openeyes' : 'closeeyse'" class="icon2" @click="isEye1 = !isEye1"></svg-load>
          </template>
        </van-field>
      </div>

      <van-button class="form-but" type="primary" color="#613AF1" @click="submit">{{ _t18('btnConfirm') }}
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import { backPwdToEmail, emailCode } from '@/api/user'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
import { _t18, _toView } from '@/utils/public'
import { useMainStore } from '@/store'

const mainStore = useMainStore()

//多语言
const currentLanguage = computed(() =>
  mainStore.languageList.find((elem) => elem.dictValue == mainStore.language)
)

// 眼睛
const isEye = ref(false)
const isEye1 = ref(false)

//表单数据
const formData = ref({
  type: 2,
  email: '',
  password: '',
  newPassword: '',
  code: ''
})

// 邮箱验证码
const time = ref(0)
const send = () => {
  if (!formData.value.email) {
    return _toast(`login_please_emailCode`)
  }
  //发送验证码
  emailCode('FIND_PASSWORD', formData.value.email, { loading: true }).then((res) => {
    if (res.code == '200') {
      time.value = 60 * 1000
    }
    _toast(res.msg)
  })
}

// 密码修改---提交
const submit = () => {
  let tempData = {
    email: formData.value.email, //邮箱
    password: formData.value.password, //密码
    newPassword: formData.value.password, //密码
    emailCode: formData.value.code //验证码
  }

  if (tempData.email == '') {
    // _toast('请填写邮箱')
    return _toast('please_email')
  }
  if (tempData.newPassword == '') {
    // _toast('请填写密码')
    return _toast('please_pwd')
  }
  if (mainStore.getISCode && tempData.emailCode == '') {
    // _toast('验证码')
    return _toast('please_code')
  }
  if (tempData.password !== tempData.newPassword) {
    // _toast('两次密码不一致')
    return _toast('register_pwd_diff')
  }

  forgerPasswordSubmit(tempData)
}
const forgerPasswordSubmit = (params) => {
  backPwdToEmail(params.email, params.newPassword, params.emailCode, { loading: true })
    .then((res) => {
      if (res.code == '200') {
        // _toast('重置成功！')
        _toast('reset_success')
        setTimeout(() => {
          router.push('/login')
        }, 500)
      } else {
        _toast(res.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<style lang="scss" scoped>
.forgot-password {
  .languages {
    padding: 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .right {
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }

      span {
        font-size: 14px;
        color: var(--ex-font-color8);
      }
    }
  }

  .content {
    padding: 20px 16px;

    .formData {
      margin-bottom: 30px;
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
  }
}
</style>
