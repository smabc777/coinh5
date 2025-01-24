<!-- 邮箱修改密码 -->
<script setup>
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { emailCode, updatePwdByEmail } from '@/api/user'
import { ref } from 'vue'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
const userStore = useUserStore()
userStore.getUserInfo()
// 用户信息
const { userInfo } = storeToRefs(userStore)
const newPwd = ref(false)
const NPwd = ref(false)
const form = ref({
  email: userInfo.value.user?.email,
  code: '',
  newPwd: '',
  NPwd: ''
})
const setKeyVal = (val) => {
  if (val == 'newPwd') {
    newPwd.value = !newPwd.value
  } else {
    NPwd.value = !NPwd.value
  }
}
const showPwdDiff = ref(false)
const pwdDiff = () => {
  showPwdDiff.value = !(form.value.newPwd == form.value.NPwd)
}
/**
 * 倒计时
 */

// 倒计时
const time = ref(0)
const flag = ref(false)
const send = () => {
  // 邮箱发送验证码
  if (form.value.email == '') {
    // showToast('请补充邮箱地址')
    _toast('login_please_emailCode')
    return
  }
  emailCode('UPD_PASSWORD', form.value.email, { loading: true }).then((res) => {
    if (res.code == '200') {
      flag.value = true
      time.value = 60 * 1000
    } else {
      showToast(res.msg)
    }
  })
}
// 倒计时结束
const finish = () => {
  flag.value = false
}
const submit = () => {
  if (form.value.code == '') {
    // showToast('验证码')
    _toast('verification_code')
    return
  }
  if (form.value.newPwd == '') {
    // showToast('请补充新密码')
    _toast('Fund_password_pleaseNew')
    return
  }
  if (form.value.newPwd != form.value.NPwd) {
    // showToast('两次密码不一致')
    _toast('register_pwd_diff')
    return
  }
  updatePwdByEmail(form.value.email, form.value.newPwd, form.value.code)
    .then((res) => {
      if (res.code == '200') {
        // showToast('修改成功！')
        _toast('Bank_update_success')
        setTimeout(() => {
          router.push('/homeSidebar')
        }, 500)
      } else {
        showToast(res.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>
<template>
  <div class="content">
    <div class="tip">{{ _t18('login_emailCode') }}</div>
    <div class="input disabled">
      <!-- <svg-load name="youxiang-x" class="icon"></svg-load> -->
      <input autocomplete="off" type="text" disabled v-model="form.email" />
    </div>
    <div class="tip">{{ _t18('verification_code') }}</div>
    <div class="input">
      <!-- <svg-load name="yanzhengma" class="icon"></svg-load> -->
      <input autocomplete="off" type="text" v-model="form.code" />
      <div class="code-box">
        <div class="wait-code" v-if="flag">
          <van-count-down :time="time" format="ss" @finish="finish" />
        </div>
        <div class="send-code" v-else @click="send">{{ _t18('login_send') }}</div>
      </div>
    </div>
    <div class="tip">{{ _t18('forgot_newPwd') }}</div>
    <div class="input">
      <svg-load name="mima" class="icon1"></svg-load>
      <input autocomplete="off" :type="newPwd ? 'text' : 'password'" v-model="form.newPwd" />
      <svg-load :name="newPwd ? 'openeyes' : 'closeeyse'" class="icon2" @click="setKeyVal('newPwd')"></svg-load>
    </div>
    <div class="tip">{{ _t18('forgot_require_newPwd') }}</div>
    <div class="input">
      <svg-load name="mima" class="icon1"></svg-load>
      <input autocomplete="off" :type="NPwd ? 'text' : 'password'" v-model="form.NPwd" @input="pwdDiff" />
      <svg-load :name="NPwd ? 'openeyes' : 'closeeyse'" class="icon2" @click="setKeyVal('NPwd')"></svg-load>
    </div>
    <p class="pwdDiff" v-if="showPwdDiff">*{{ _t18('register_pwd_diff') }}</p>
    <div class="btnBox" @click="submit">
      <ButtonBar :btnValue="_t18('btnConfirm', ['bitmake'])" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  padding: 30px 15px 0 15px;

  .tip {
    font-size: 14px;
    color: var(--ex-input-label-color2);
    margin-bottom: 10px;
    text-align: left;
  }

  .input {
    // padding: 0 15px;
    width: 100%;
    height: 50px;
    border-radius: 8px;
    background: var(--ex-input-background-color) !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;

    input {
      border-radius: 8px;
      width: 100%;
      height: 100%;
      padding: 0 38px;
      font-size: 14px;
      background: var(--ex-input-background-color);
    }

    /* 焦点状态样式 */
    input:focus {
      border: 1px solid var(--ex-input-focus-color);
      outline: none;
      /* 防止点击时出现默认的浏览器外观 */
    }

    .code-box {
      position: absolute;
      right: 10px;
      min-width: 76px;
      height: 34px;
      background: linear-gradient(39deg, #cb4ee8 0%, #10f4b1 100%);
      border-radius: 7px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--ex-default-reverse-font-color);

      div {
        font-size: 12px;
        font-weight: 500;
        color: var(--ex-default-reverse-font-color);
      }
    }
  }

  .disabled {
    background: #efefef;
  }

  .icon1 {
    position: absolute;
    top: 15px;
    left: 14px;
    font-size: 16px;
  }

  .icon2 {
    position: absolute;
    top: 17px;
    right: 14px;
    font-size: 16px;
  }

  .btnBox {
    margin-top: 50px;
  }

  .pwdDiff {
    color: var(--ex-font-color14);
  }
}

:deep(.van-count-down) {
  font-size: 14px;
  color: var(--ex-font-color);
  padding: 0;
}
</style>
